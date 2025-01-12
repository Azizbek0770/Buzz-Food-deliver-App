from django.urls import path
from .views import (
    AdminStatsView,
    AdminRestaurantViewSet,
    AdminUserViewSet,
    AdminOrderViewSet
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    # Restaurants
    path('restaurants/', AdminRestaurantViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='admin-restaurants'),
    path('restaurants/<int:pk>/', AdminRestaurantViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='admin-restaurant-detail'),
    # Users
    path('users/', AdminUserViewSet.as_view({
        'get': 'list'
    }), name='admin-users'),
    path('users/<int:pk>/', AdminUserViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='admin-user-detail'),
    # Orders
    path('orders/', AdminOrderViewSet.as_view({
        'get': 'list'
    }), name='admin-orders'),
    path('orders/<int:pk>/', AdminOrderViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update'
    }), name='admin-order-detail'),
] 