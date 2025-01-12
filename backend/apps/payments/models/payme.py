from django.db import models
from django.utils.translation import gettext_lazy as _

class PaymeTransaction(models.Model):
    TRANSACTION_STATUS = (
        ('pending', _('Kutilmoqda')),
        ('processing', _('Jarayonda')),
        ('completed', _('Bajarildi')),
        ('cancelled', _('Bekor qilindi')),
        ('failed', _('Muvaffaqiyatsiz')),
    )

    payment = models.ForeignKey(
        'payments.Payment',
        on_delete=models.CASCADE,
        related_name='payme_transactions',
        verbose_name=_('To\'lov')
    )
    transaction_id = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_('Tranzaksiya ID')
    )
    request_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('So\'rov ID')
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_('Summa')
    )
    status = models.CharField(
        max_length=20,
        choices=TRANSACTION_STATUS,
        default='pending',
        verbose_name=_('Holat')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Yaratilgan vaqt')
    )
    performed_time = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Bajarilgan vaqt')
    )
    cancelled_time = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_('Bekor qilingan vaqt')
    )
    reason = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Sabab')
    )

    class Meta:
        verbose_name = _('Payme tranzaksiya')
        verbose_name_plural = _('Payme tranzaksiyalar')
        ordering = ['-created_at']

    def __str__(self):
        return f"Payme tranzaksiya #{self.id}"

    def save(self, *args, **kwargs):
        if self.status == 'completed' and not self.performed_time:
            from django.utils import timezone
            self.performed_time = timezone.now()
        elif self.status == 'cancelled' and not self.cancelled_time:
            from django.utils import timezone
            self.cancelled_time = timezone.now()
        super().save(*args, **kwargs) 