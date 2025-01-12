from rest_framework import serializers
from ..models import Payment

class PaymentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id',
            'payment_type',
            'amount',
            'status',
            'transaction_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'transaction_id',
            'created_at',
            'updated_at'
        ] 