from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.models import User
from .models import Restaurant, Category, MenuItem
from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class CategoryAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.category = Category.objects.create(
            name='Fast Food',
            description='Fast Food Restaurants'
        )

    def test_get_categories_list(self):
        url = reverse('restaurants:category-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_category(self):
        url = reverse('restaurants:category-list')
        data = {
            'name': 'Italian',
            'description': 'Italian Restaurants'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)

class RestaurantAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.category = Category.objects.create(
            name='Fast Food',
            description='Fast Food Restaurants'
        )
        self.restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            category=self.category,
            owner=self.user
        )

    def test_get_restaurants_list(self):
        url = reverse('restaurants:restaurant-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_restaurant_detail(self):
        url = reverse('restaurants:restaurant-detail', kwargs={'pk': self.restaurant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Restaurant')
        self.assertEqual(response.data['category_name'], 'Fast Food')

    def test_create_restaurant(self):
        url = reverse('restaurants:restaurant-list')
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
        url = reverse('restaurants:restaurant-detail', kwargs={'pk': self.restaurant.pk})
        data = {
            'name': 'Updated Restaurant',
            'description': self.restaurant.description,
            'address': self.restaurant.address,
            'category': self.category.id
        }
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Restaurant')

    def test_filter_restaurants_by_category(self):
        new_category = Category.objects.create(
            name='Italian',
            description='Italian Restaurants'
        )
        Restaurant.objects.create(
            name='Italian Restaurant',
            description='Italian Food',
            address='Italian Street',
            category=new_category,
            owner=self.user
        )
        
        url = reverse('restaurants:restaurant-list')
        response = self.client.get(url + f'?category={self.category.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Restaurant') 

class RestaurantTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            phone='+998901234567',
            is_active=True
        )
        
        self.menu_item = MenuItem.objects.create(
            restaurant=self.restaurant,
            name='Test Dish',
            description='Test Dish Description',
            price=25000,
            category='Main',
            is_available=True
        )

    def test_get_restaurant_list(self):
        url = reverse('restaurant-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_restaurant_detail(self):
        url = reverse('restaurant-detail', kwargs={'pk': self.restaurant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Restaurant')

    def test_get_restaurant_menu(self):
        url = reverse('restaurant-menu', kwargs={'pk': self.restaurant.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Test Dish')

    def test_create_menu_item(self):
        url = reverse('menuitem-list')
        data = {
            'restaurant': self.restaurant.pk,
            'name': 'New Dish',
            'description': 'New Description',
            'price': 30000,
            'category': 'Main',
            'is_available': True
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MenuItem.objects.count(), 2)

class RestaurantModelTests(TestCase):
    def test_restaurant_str(self):
        restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            phone='+998901234567'
        )
        self.assertEqual(str(restaurant), 'Test Restaurant')

    def test_menu_item_str(self):
        restaurant = Restaurant.objects.create(
            name='Test Restaurant',
            description='Test Description',
            address='Test Address',
            phone='+998901234567'
        )
        menu_item = MenuItem.objects.create(
            restaurant=restaurant,
            name='Test Dish',
            description='Test Description',
            price=25000,
            category='Main'
        )
        self.assertEqual(str(menu_item), 'Test Dish') 