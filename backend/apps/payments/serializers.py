from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'payment_type', 'amount', 
            'status', 'transaction_id', 'created_at'
        ]
        read_only_fields = ['user', 'status', 'transaction_id']

class PaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'payment_type', 'amount', 'status',
            'transaction_id', 'created_at'
        ] 