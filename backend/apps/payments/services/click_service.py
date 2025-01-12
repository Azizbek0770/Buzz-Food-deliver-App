import hashlib
import json
from datetime import datetime
from django.conf import settings
from ..models import Payment, ClickTransaction

class ClickException(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message
        super().__init__(message)

class ClickService:
    def __init__(self):
        self.service_id = settings.CLICK_SERVICE_ID
        self.secret_key = settings.CLICK_SECRET_KEY
        self.merchant_id = settings.CLICK_MERCHANT_ID

    def _generate_sign(self, data):
        sign_string = (
            f"{data['click_trans_id']}"
            f"{data['service_id']}"
            f"{self.secret_key}"
            f"{data['merchant_trans_id']}"
            f"{data.get('amount', '')}"
            f"{data.get('action', '')}"
            f"{data.get('sign_time', '')}"
        )
        return hashlib.md5(sign_string.encode('utf-8')).hexdigest()

    def prepare_payment(self, payment):
        """To'lovni tayyorlash"""
        try:
            click_trans = ClickTransaction.objects.create(
                payment=payment,
                amount=payment.amount,
                status='pending'
            )

            return {
                'merchant_trans_id': str(payment.id),
                'merchant_prepare_id': str(click_trans.id),
                'service_id': self.service_id,
                'amount': payment.amount,
                'status': 0,
                'error': None
            }
        except Exception as e:
            raise ClickException(-1, str(e))

    def complete_payment(self, data):
        """To'lovni yakunlash"""
        try:
            # Imzoni tekshirish
            if self._generate_sign(data) != data['sign']:
                raise ClickException(-1, "Noto'g'ri imzo")

            payment = Payment.objects.get(id=data['merchant_trans_id'])
            click_trans = ClickTransaction.objects.get(id=data['merchant_prepare_id'])

            # To'lov summasini tekshirish
            if float(data['amount']) != float(payment.amount):
                raise ClickException(-2, "Noto'g'ri summa")

            # To'lovni yakunlash
            click_trans.click_trans_id = data['click_trans_id']
            click_trans.status = 'completed'
            click_trans.performed_time = datetime.now()
            click_trans.save()

            payment.status = 'completed'
            payment.save()

            return {
                'click_trans_id': data['click_trans_id'],
                'merchant_trans_id': str(payment.id),
                'merchant_confirm_id': str(click_trans.id),
                'status': 0,
                'error': None
            }
        except Payment.DoesNotExist:
            raise ClickException(-5, "To'lov topilmadi")
        except ClickTransaction.DoesNotExist:
            raise ClickException(-6, "Click tranzaksiya topilmadi")
        except Exception as e:
            raise ClickException(-7, str(e))

    def check_payment(self, click_trans_id):
        """To'lov holatini tekshirish"""
        try:
            click_trans = ClickTransaction.objects.get(click_trans_id=click_trans_id)
            return {
                'click_trans_id': click_trans_id,
                'merchant_trans_id': str(click_trans.payment.id),
                'merchant_confirm_id': str(click_trans.id),
                'status': 0 if click_trans.status == 'completed' else 1,
                'error': None
            }
        except ClickTransaction.DoesNotExist:
            raise ClickException(-6, "Click tranzaksiya topilmadi") 