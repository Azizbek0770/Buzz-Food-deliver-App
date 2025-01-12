from rest_framework import serializers
from apps.restaurants.models import Restaurant
from apps.users.models import User
from apps.orders.models import Order, OrderItem

class StatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_restaurants = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    active_orders = serializers.IntegerField()

class AdminRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 
                 'is_active', 'is_staff', 'date_joined')
        read_only_fields = ('date_joined',)

class AdminOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class AdminOrderSerializer(serializers.ModelSerializer):
    items = AdminOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__' 