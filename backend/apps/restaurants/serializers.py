from rest_framework import serializers
from .models import Restaurant, MenuItem, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = (
            'id', 'name', 'description', 'price', 'image',
            'category', 'calories', 'is_available'
        )

class RestaurantSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    menu_items = MenuItemSerializer(many=True, read_only=True)
    rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Restaurant
        fields = (
            'id', 'name', 'description', 'address', 'logo',
            'phone_number', 'opening_time', 'closing_time',
            'category', 'menu_items', 'rating', 'total_reviews',
            'is_active'
        )

class RestaurantListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)

    class Meta:
        model = Restaurant
        fields = (
            'id', 'name', 'description', 'address', 'logo',
            'category', 'rating', 'total_reviews', 'is_active'
        ) 