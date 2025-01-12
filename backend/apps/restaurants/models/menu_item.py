from django.db import models
from django.utils.translation import gettext_lazy as _
from .restaurant import Restaurant

class MenuItem(models.Model):
    CATEGORY_CHOICES = [
        ('main', _('Main Course')),
        ('appetizer', _('Appetizer')),
        ('dessert', _('Dessert')),
        ('drink', _('Drink')),
    ]

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='menu_items/', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.restaurant.name} - {self.name}" 