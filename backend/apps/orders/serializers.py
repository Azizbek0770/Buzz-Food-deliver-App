from rest_framework import serializers
from .models import Order, OrderItem
from apps.restaurants.models import MenuItem, Restaurant
from apps.restaurants.serializers import RestaurantSerializer

class MenuItemInOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemInOrderSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='items')
    restaurant = RestaurantSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'restaurant', 'status', 'status_display',
            'total_amount', 'delivery_address', 'items', 'total_items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ('user', 'status', 'created_at', 'updated_at')
    
    def get_total_items(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        validated_data['user'] = self.context['request'].user
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order 