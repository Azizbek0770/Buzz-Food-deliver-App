from django.db import models
from django.conf import settings
from apps.orders.models import Order

class Payment(models.Model):
    PAYMENT_TYPES = (
        ('payme', 'Payme'),
        ('click', 'Click'),
        ('cash', 'Naqd pul'),
        ('terminal', 'Terminal')
    )

    PAYMENT_STATUS = (
        ('pending', 'Kutilmoqda'),
        ('processing', 'Jarayonda'),
        ('completed', 'Yakunlandi'),
        ('failed', 'Xatolik yuz berdi'),
        ('cancelled', 'Bekor qilindi'),
        ('refunded', 'Qaytarildi')
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    transaction_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    payment_details = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order.id} - {self.amount} - {self.status}"

class PaymeTransaction(models.Model):
    TRANSACTION_STATUS = (
        (-2, 'Bekor qilingan'),
        (-1, 'Xatolik yuz berdi'),
        (0, 'Kutilmoqda'),
        (1, 'To\'lov amalga oshirilmoqda'),
        (2, 'To\'lov amalga oshirildi')
    )

    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='payme_transaction')
    transaction_id = models.CharField(max_length=255, unique=True)
    request_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.SmallIntegerField(choices=TRANSACTION_STATUS, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    perform_time = models.DateTimeField(null=True, blank=True)
    cancel_time = models.DateTimeField(null=True, blank=True)
    reason = models.SmallIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_id} - {self.amount}" 