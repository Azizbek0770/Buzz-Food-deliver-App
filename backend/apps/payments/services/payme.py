import base64
import json
from datetime import datetime
from decimal import Decimal
from django.conf import settings
from ..models import Payment, PaymeTransaction

class PaymeException(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message
        super().__init__(message)

class PaymeService:
    ERROR_INVALID_AMOUNT = -31001
    ERROR_TRANSACTION_NOT_FOUND = -31003
    ERROR_ALREADY_PAID = -31050
    ERROR_ORDER_NOT_FOUND = -31051
    ERROR_ORDER_AVAILABLE = -31052
    ERROR_TRANSACTION_CANCELLED = -31053
    ERROR_INVALID_STATE = -31054

    def __init__(self):
        self.key = settings.PAYME_KEY
        self.merchant_id = settings.PAYME_MERCHANT_ID
        self.test_mode = settings.PAYME_TEST_MODE

    def _generate_auth_token(self):
        auth_token = f"{self.merchant_id}:{self.key}"
        return base64.b64encode(auth_token.encode()).decode()

    def create_transaction(self, order, amount):
        """To'lov tranzaksiyasini yaratish"""
        payment = Payment.objects.create(
            order=order,
            user=order.user,
            payment_type='payme',
            amount=amount,
            status='pending'
        )

        return payment

    def check_transaction(self, transaction_id):
        """Tranzaksiya holatini tekshirish"""
        try:
            transaction = PaymeTransaction.objects.get(transaction_id=transaction_id)
            return {
                'state': transaction.status,
                'create_time': int(transaction.created_at.timestamp() * 1000),
                'perform_time': int(transaction.perform_time.timestamp() * 1000) if transaction.perform_time else None,
                'cancel_time': int(transaction.cancel_time.timestamp() * 1000) if transaction.cancel_time else None,
                'reason': transaction.reason
            }
        except PaymeTransaction.DoesNotExist:
            raise PaymeException(
                self.ERROR_TRANSACTION_NOT_FOUND,
                'Transaction not found'
            )

    def perform_transaction(self, transaction_id, amount):
        """To'lovni amalga oshirish"""
        try:
            transaction = PaymeTransaction.objects.get(transaction_id=transaction_id)
            
            if transaction.status == 2:
                raise PaymeException(
                    self.ERROR_ALREADY_PAID,
                    'Transaction already paid'
                )
            
            if transaction.status < 0:
                raise PaymeException(
                    self.ERROR_TRANSACTION_CANCELLED,
                    'Transaction cancelled'
                )

            if Decimal(str(amount)) != transaction.amount * 100:
                raise PaymeException(
                    self.ERROR_INVALID_AMOUNT,
                    'Invalid amount'
                )

            transaction.status = 2
            transaction.perform_time = datetime.now()
            transaction.save()

            # To'lov muvaffaqiyatli bo'lganda order statusini yangilash
            transaction.payment.status = 'completed'
            transaction.payment.save()
            
            transaction.payment.order.status = 'paid'
            transaction.payment.order.save()

            return {
                'state': transaction.status,
                'perform_time': int(transaction.perform_time.timestamp() * 1000),
                'transaction': transaction.id
            }

        except PaymeTransaction.DoesNotExist:
            raise PaymeException(
                self.ERROR_TRANSACTION_NOT_FOUND,
                'Transaction not found'
            )

    def cancel_transaction(self, transaction_id, reason):
        """To'lovni bekor qilish"""
        try:
            transaction = PaymeTransaction.objects.get(transaction_id=transaction_id)
            
            if transaction.status == -2:
                raise PaymeException(
                    self.ERROR_ALREADY_PAID,
                    'Transaction already cancelled'
                )

            transaction.status = -2
            transaction.cancel_time = datetime.now()
            transaction.reason = reason
            transaction.save()

            # To'lov bekor qilinganda order statusini yangilash
            transaction.payment.status = 'cancelled'
            transaction.payment.save()
            
            transaction.payment.order.status = 'cancelled'
            transaction.payment.order.save()

            return {
                'state': transaction.status,
                'cancel_time': int(transaction.cancel_time.timestamp() * 1000),
                'transaction': transaction.id
            }

        except PaymeTransaction.DoesNotExist:
            raise PaymeException(
                self.ERROR_TRANSACTION_NOT_FOUND,
                'Transaction not found'
            ) 