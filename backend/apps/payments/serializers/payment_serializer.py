from rest_framework import serializers
from apps.payments.models import Payment
from apps.orders.serializers import OrderSerializer

class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    order_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Payment
        fields = ('id', 'order', 'order_id', 'user', 'amount', 'payment_type', 
                 'status', 'transaction_id', 'created_at')
        read_only_fields = ('id', 'user', 'status', 'transaction_id', 'created_at') 