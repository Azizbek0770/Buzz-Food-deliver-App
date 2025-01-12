from rest_framework import viewsets, views, status
from rest_framework.response import Response
from .permissions import IsSuperAdmin
from apps.restaurants.models import Restaurant, MenuItem
from apps.users.models import User
from apps.orders.models import Order
from django.db.models import Count, Sum
from .serializers import (
    AdminRestaurantSerializer,
    AdminUserSerializer,
    AdminOrderSerializer,
    StatsSerializer,
    MenuItemSerializer
)

class AdminStatsView(views.APIView):
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        stats = {
            'total_users': User.objects.count(),
            'total_restaurants': Restaurant.objects.count(),
            'total_orders': Order.objects.count(),
            'active_orders': Order.objects.exclude(status__in=['completed', 'cancelled']).count(),
            'total_revenue': Order.objects.filter(status='completed').aggregate(Sum('total_amount'))['total_amount__sum'] or 0,
            'total_menu_items': MenuItem.objects.count()
        }
        serializer = StatsSerializer(stats)
        return Response(serializer.data)

class AdminRestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = AdminRestaurantSerializer
    permission_classes = [IsSuperAdmin]

    def get_queryset(self):
        return Restaurant.objects.annotate(
            menu_items_count=Count('menu_items'),
            orders_count=Count('orders')
        )

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsSuperAdmin]

    def get_queryset(self):
        return User.objects.annotate(
            orders_count=Count('orders')
        )

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = AdminOrderSerializer
    permission_classes = [IsSuperAdmin]

    def get_queryset(self):
        return Order.objects.select_related('user', 'restaurant', 'delivery_driver') 