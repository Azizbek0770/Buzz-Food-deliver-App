from django.core.cache import cache
from django.conf import settings
from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Avg, Count
from .models import Restaurant, MenuItem, Category
from .serializers import (
    RestaurantSerializer,
    RestaurantListSerializer,
    MenuItemSerializer,
    CategorySerializer
)
from rest_framework.decorators import action

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RestaurantListSerializer
        return RestaurantSerializer

    def get_queryset(self):
        cache_key = 'restaurant_list'
        queryset = cache.get(cache_key)
        
        if queryset is None:
            queryset = Restaurant.objects.filter(is_active=True)
            queryset = queryset.annotate(
                rating=Avg('reviews__rating'),
                total_reviews=Count('reviews')
            )
            
            category = self.request.query_params.get('category', None)
            if category:
                queryset = queryset.filter(category__name=category)
            
            search = self.request.query_params.get('search', None)
            if search:
                queryset = queryset.filter(name__icontains=search)
            
            cache.set(cache_key, queryset, timeout=300)  # 5 daqiqa cache
        
        return queryset

    @action(detail=True, methods=['get'])
    def menu(self, request, pk=None):
        cache_key = f'restaurant_menu_{pk}'
        menu_items = cache.get(cache_key)
        
        if menu_items is None:
            restaurant = self.get_object()
            menu_items = MenuItem.objects.filter(
                restaurant=restaurant,
                is_available=True
            ).order_by('category', 'name')
            
            serializer = MenuItemSerializer(menu_items, many=True)
            menu_items = serializer.data
            cache.set(cache_key, menu_items, timeout=300)
        
        return Response(menu_items)

class RestaurantMenuView(views.APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, restaurant_id):
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id, is_active=True)
            menu_items = MenuItem.objects.filter(
                restaurant=restaurant,
                is_available=True
            ).order_by('category', 'name')
            
            serializer = MenuItemSerializer(menu_items, many=True)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response(
                {'error': 'Restoran topilmadi'},
                status=status.HTTP_404_NOT_FOUND
            )

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = MenuItem.objects.filter(is_available=True)
        restaurant_id = self.request.query_params.get('restaurant', None)
        category_id = self.request.query_params.get('category', None)
        
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
            
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]