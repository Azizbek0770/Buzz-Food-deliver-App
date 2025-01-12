from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User
from apps.restaurants.models import Restaurant, Category

class RestaurantAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.category = Category.objects.create(name='Fast Food')
        self.restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            category=self.category,
            owner=self.user
        )

    def test_get_restaurants_list(self):
        url = reverse('restaurant-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_restaurant_detail(self):
        url = reverse('restaurant-detail', kwargs={'pk': self.restaurant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Restaurant')

    def test_create_restaurant(self):
        url = reverse('restaurant-list')
        data = {
            'name': 'New Restaurant',
            'description': 'New Description',
            'address': 'New Address',
            'category': self.category.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Restaurant.objects.count(), 2)

    def test_update_restaurant(self):
        url = reverse('restaurant-detail', kwargs={'pk': self.restaurant.pk})
        data = {
            'name': 'Updated Restaurant',
            'description': self.restaurant.description,
            'address': self.restaurant.address,
            'category': self.category.id
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Restaurant') 