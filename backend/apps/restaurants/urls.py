from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestaurantViewSet, MenuItemViewSet, CategoryViewSet

app_name = 'restaurants'

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('menu-items', MenuItemViewSet, basename='menu-item')
router.register('', RestaurantViewSet, basename='restaurant')

urlpatterns = [
    path('', include(router.urls)),
] 