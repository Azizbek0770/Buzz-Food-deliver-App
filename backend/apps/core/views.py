from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from apps.restaurants.models import Restaurant, MenuItem
from django.utils import timezone

class RestaurantSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.9

    def items(self):
        return Restaurant.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.updated_at or obj.created_at

    def location(self, obj):
        return f'/restaurant/{obj.id}'

class MenuItemSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return MenuItem.objects.filter(is_available=True)

    def lastmod(self, obj):
        return obj.updated_at or obj.created_at

    def location(self, obj):
        return f'/restaurant/{obj.restaurant.id}/menu/{obj.id}'

class StaticViewSitemap(Sitemap):
    priority = 1.0
    changefreq = 'weekly'

    def items(self):
        return ['home', 'about', 'contact', 'restaurants']

    def location(self, item):
        return reverse(item)

sitemaps = {
    'static': StaticViewSitemap,
    'restaurants': RestaurantSitemap,
    'menu_items': MenuItemSitemap,
} 