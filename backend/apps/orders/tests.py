from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User
from apps.restaurants.models import Restaurant, MenuItem
from .models import Order, OrderItem

class OrderAPITests(APITestCase):
    def setUp(self):
        # Foydalanuvchi yaratish
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Restoran va menu item yaratish
        self.restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            owner=self.user
        )
        self.menu_item = MenuItem.objects.create(
            restaurant=self.restaurant,
            name='Test Item',
            description='Test Item Description',
            price=10000,
            category='main'
        )

    def test_create_order(self):
        url = reverse('order-list')
        data = {
            'restaurant': self.restaurant.id,
            'items': [
                {
                    'menu_item': self.menu_item.id,
                    'quantity': 2
                }
            ],
            'delivery_address': 'Test Delivery Address'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(OrderItem.objects.count(), 1)

    def test_get_order_list(self):
        # Buyurtma yaratish
        order = Order.objects.create(
            user=self.user,
            restaurant=self.restaurant,
            delivery_address='Test Address',
            total_amount=20000
        )
        OrderItem.objects.create(
            order=order,
            menu_item=self.menu_item,
            quantity=2,
            price=10000
        )

        url = reverse('order-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_order_detail(self):
        order = Order.objects.create(
            user=self.user,
            restaurant=self.restaurant,
            delivery_address='Test Address',
            total_amount=20000
        )
        OrderItem.objects.create(
            order=order,
            menu_item=self.menu_item,
            quantity=2,
            price=10000
        )

        url = reverse('order-detail', kwargs={'pk': order.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_amount'], '20000.00')

    def test_update_order_status(self):
        order = Order.objects.create(
            user=self.user,
            restaurant=self.restaurant,
            delivery_address='Test Address',
            total_amount=20000
        )

        url = reverse('order-detail', kwargs={'pk': order.pk})
        data = {'status': 'confirmed'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'confirmed') 