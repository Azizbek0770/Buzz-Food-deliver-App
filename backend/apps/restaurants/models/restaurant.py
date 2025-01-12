from django.db import models
from django.utils import timezone
from apps.users.models import User
from .category import Category

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    address = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='restaurants/logos/', null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    opening_time = models.TimeField(default=timezone.now().replace(hour=9, minute=0, second=0).time())
    closing_time = models.TimeField(default=timezone.now().replace(hour=22, minute=0, second=0).time())
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='restaurants')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at'] 