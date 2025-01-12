from django.test import TestCase
from django.contrib.auth import get_user_model
from decimal import Decimal
from ..models import Payment, ClickTransaction
from ..services.click_service import ClickService, ClickException

User = get_user_model()

class ClickServiceTestCase(TestCase):
    def setUp(self):
        self.service = ClickService()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.payment = Payment.objects.create(
            user=self.user,
            amount=Decimal('100000.00'),
            payment_type='click',
            status='pending'
        )

    def test_prepare_payment(self):
        """To'lovni tayyorlash testi"""
        result = self.service.prepare_payment(self.payment)

        self.assertEqual(result['merchant_trans_id'], str(self.payment.id))
        self.assertIsNotNone(result['merchant_prepare_id'])
        self.assertEqual(result['amount'], self.payment.amount)
        self.assertEqual(result['status'], 0)
        self.assertIsNone(result['error'])

        # ClickTransaction yaratilganligini tekshirish
        click_trans = ClickTransaction.objects.get(payment=self.payment)
        self.assertEqual(click_trans.status, 'pending')
        self.assertEqual(click_trans.amount, self.payment.amount)

    def test_complete_payment(self):
        """To'lovni yakunlash testi"""
        # Click tranzaksiyani yaratish
        click_trans = ClickTransaction.objects.create(
            payment=self.payment,
            amount=self.payment.amount,
            status='pending'
        )

        # To'lov ma'lumotlarini tayyorlash
        data = {
            'click_trans_id': '123456',
            'service_id': self.service.service_id,
            'merchant_trans_id': str(self.payment.id),
            'merchant_prepare_id': str(click_trans.id),
            'amount': str(self.payment.amount),
            'action': 'complete',
            'sign_time': '2023-01-01 12:00:00',
            'sign': 'test_sign'  # Bu test uchun
        }

        # _generate_sign metodini mock qilish
        self.service._generate_sign = lambda x: 'test_sign'

        result = self.service.complete_payment(data)

        # Natijalarni tekshirish
        self.assertEqual(result['click_trans_id'], data['click_trans_id'])
        self.assertEqual(result['merchant_trans_id'], str(self.payment.id))
        self.assertEqual(result['status'], 0)
        self.assertIsNone(result['error'])

        # Payment va ClickTransaction yangilanganligini tekshirish
        self.payment.refresh_from_db()
        click_trans.refresh_from_db()

        self.assertEqual(self.payment.status, 'completed')
        self.assertEqual(click_trans.status, 'completed')
        self.assertEqual(click_trans.click_trans_id, data['click_trans_id'])

    def test_check_payment(self):
        """To'lov holatini tekshirish testi"""
        click_trans = ClickTransaction.objects.create(
            payment=self.payment,
            amount=self.payment.amount,
            status='completed',
            click_trans_id='123456'
        )

        result = self.service.check_payment('123456')

        self.assertEqual(result['click_trans_id'], '123456')
        self.assertEqual(result['merchant_trans_id'], str(self.payment.id))
        self.assertEqual(result['merchant_confirm_id'], str(click_trans.id))
        self.assertEqual(result['status'], 0)
        self.assertIsNone(result['error'])

    def test_invalid_amount(self):
        """Noto'g'ri summa testi"""
        click_trans = ClickTransaction.objects.create(
            payment=self.payment,
            amount=self.payment.amount,
            status='pending'
        )

        data = {
            'click_trans_id': '123456',
            'service_id': self.service.service_id,
            'merchant_trans_id': str(self.payment.id),
            'merchant_prepare_id': str(click_trans.id),
            'amount': '50000.00',  # Noto'g'ri summa
            'action': 'complete',
            'sign_time': '2023-01-01 12:00:00',
            'sign': 'test_sign'
        }

        self.service._generate_sign = lambda x: 'test_sign'

        with self.assertRaises(ClickException) as context:
            self.service.complete_payment(data)

        self.assertEqual(context.exception.code, -2)
        self.assertEqual(context.exception.message, "Noto'g'ri summa") 