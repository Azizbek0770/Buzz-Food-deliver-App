from django.contrib import admin
from .models import Payment, ClickTransaction, PaymeTransaction

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user', 'payment_type', 'amount',
        'status', 'created_at'
    ]
    list_filter = ['payment_type', 'status', 'created_at']
    search_fields = ['user__username', 'id']
    readonly_fields = ['created_at']
    ordering = ['-created_at']

@admin.register(ClickTransaction)
class ClickTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'payment', 'click_trans_id',
        'status', 'created_at', 'performed_time'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['click_trans_id', 'payment__user__username']
    readonly_fields = ['created_at', 'performed_time', 'cancelled_time']
    ordering = ['-created_at']

@admin.register(PaymeTransaction)
class PaymeTransactionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'payment', 'transaction_id',
        'status', 'created_at', 'performed_time'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['transaction_id', 'payment__user__username']
    readonly_fields = ['created_at', 'performed_time', 'cancelled_time']
    ordering = ['-created_at']

    def has_add_permission(self, request):
        return False  # Yangi Payme tranzaksiya qo'shishni taqiqlash 