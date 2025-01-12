from django.contrib.auth.models import AbstractUser
from django.db import models

def user_profile_image_path(instance, filename):
    return f'users/{instance.id}/profile/{filename}'

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    is_restaurant_owner = models.BooleanField(default=False)
    is_delivery_driver = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to=user_profile_image_path, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username 