from django.db import models
from apps.orders.models import Order
from apps.users.models import User
from django.core.exceptions import ValidationError

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('completed', 'Tugallandi'),
        ('failed', 'Muvaffaqiyatsiz'),
        ('refunded', 'Qaytarildi'),
    ]

    PAYMENT_TYPES = [
        ('cash', 'Naqd pul'),
        ('card', 'Karta'),
        ('online', 'Online to\'lov'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.order.id}" 

    def clean(self):
        if self.amount <= 0:
            raise ValidationError("To'lov summasi 0 dan katta bo'lishi kerak")
        if self.status == 'completed' and not self.transaction_id:
            raise ValidationError("Yakunlangan to'lovda transaction_id bo'lishi shart") 