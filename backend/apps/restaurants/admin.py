from django.contrib import admin
from .models import Restaurant, MenuItem, Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'owner', 'is_active', 'created_at')
    list_filter = ('is_active', 'category')
    search_fields = ('name', 'description', 'address')
    ordering = ('-created_at',)
    raw_id_fields = ('owner',)

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'price', 'category', 'is_available')
    list_filter = ('is_available', 'category', 'restaurant')
    search_fields = ('name', 'description')
    ordering = ('restaurant', 'category', 'name') 