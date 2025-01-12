import json
from channels.testing import WebsocketCommunicator
from django.test import TestCase, TransactionTestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.restaurants.models import Restaurant, MenuItem
from apps.orders.models import Order
from apps.orders.consumers import OrderConsumer
from django.core.cache import cache

User = get_user_model()

class OrderFlowIntegrationTest(TransactionTestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='test123',
            phone='+998901234567'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test restaurant
        self.restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            phone='+998901234567'
        )
        
        # Create menu items
        self.menu_item = MenuItem.objects.create(
            restaurant=self.restaurant,
            name='Test Item',
            description='Test Description',
            price=10000
        )
        
        # Clear cache
        cache.clear()

    async def test_order_creation_and_websocket(self):
        # Create order via API
        order_data = {
            'restaurant': self.restaurant.id,
            'items': [{
                'menu_item': self.menu_item.id,
                'quantity': 2
            }],
            'delivery_address': 'Test Address',
            'phone': '+998901234567'
        }
        
        response = self.client.post(
            reverse('order-create'),
            data=order_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order_id = response.data['id']
        
        # Connect to WebSocket
        communicator = WebsocketCommunicator(
            OrderConsumer.as_asgi(),
            f'/ws/orders/{order_id}/'
        )
        connected, _ = await communicator.connect()
        self.assertTrue(connected)
        
        # Update order status
        order = Order.objects.get(id=order_id)
        order.status = 'preparing'
        order.save()
        
        # Check WebSocket message
        response = await communicator.receive_json_from()
        self.assertEqual(response['type'], 'order.update')
        self.assertEqual(response['data']['status'], 'preparing')
        
        await communicator.disconnect()

    def test_order_cache(self):
        # Create order
        order_data = {
            'restaurant': self.restaurant.id,
            'items': [{
                'menu_item': self.menu_item.id,
                'quantity': 2
            }],
            'delivery_address': 'Test Address',
            'phone': '+998901234567'
        }
        
        response = self.client.post(
            reverse('order-create'),
            data=order_data,
            format='json'
        )
        order_id = response.data['id']
        
        # First request - should hit database
        response = self.client.get(f'/api/orders/{order_id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Second request - should hit cache
        cache_key = f'order:{order_id}'
        self.assertIsNotNone(cache.get(cache_key))
        
        # Update order
        order = Order.objects.get(id=order_id)
        order.status = 'delivered'
        order.save()
        
        # Cache should be invalidated
        self.assertIsNone(cache.get(cache_key))

    def test_concurrent_order_creation(self):
        from concurrent.futures import ThreadPoolExecutor
        import threading
        
        def create_order():
            client = APIClient()
            client.force_authenticate(user=self.user)
            
            order_data = {
                'restaurant': self.restaurant.id,
                'items': [{
                    'menu_item': self.menu_item.id,
                    'quantity': 1
                }],
                'delivery_address': f'Address {threading.get_ident()}',
                'phone': '+998901234567'
            }
            
            return client.post(
                reverse('order-create'),
                data=order_data,
                format='json'
            )
        
        with ThreadPoolExecutor(max_workers=3) as executor:
            responses = list(executor.map(lambda _: create_order(), range(3)))
        
        # Check all orders were created successfully
        self.assertTrue(all(r.status_code == status.HTTP_201_CREATED for r in responses))
        self.assertEqual(Order.objects.count(), 3)

    def test_order_validation(self):
        # Test invalid menu item
        order_data = {
            'restaurant': self.restaurant.id,
            'items': [{
                'menu_item': 9999,  # Non-existent item
                'quantity': 2
            }],
            'delivery_address': 'Test Address',
            'phone': '+998901234567'
        }
        
        response = self.client.post(
            reverse('order-create'),
            data=order_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test invalid phone number
        order_data = {
            'restaurant': self.restaurant.id,
            'items': [{
                'menu_item': self.menu_item.id,
                'quantity': 2
            }],
            'delivery_address': 'Test Address',
            'phone': 'invalid'
        }
        
        response = self.client.post(
            reverse('order-create'),
            data=order_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_metrics(self):
        from django_prometheus.models import ExportModelOperationsMixin
        
        # Create order
        order_data = {
            'restaurant': self.restaurant.id,
            'items': [{
                'menu_item': self.menu_item.id,
                'quantity': 2
            }],
            'delivery_address': 'Test Address',
            'phone': '+998901234567'
        }
        
        response = self.client.post(
            reverse('order-create'),
            data=order_data,
            format='json'
        )
        
        # Check metrics endpoint
        metrics_response = self.client.get('/metrics')
        self.assertEqual(metrics_response.status_code, status.HTTP_200_OK)
        
        # Check if order metrics are present
        self.assertIn(b'django_model_inserts_total{model="order"}', 
                     metrics_response.content) 