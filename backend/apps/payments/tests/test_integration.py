from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from decimal import Decimal
from ..models import Payment, ClickTransaction, PaymeTransaction
from ..services.click_service import ClickService
from ..services.payme_service import PaymeService

User = get_user_model()

class PaymentIntegrationTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        self.client.login(username='testuser', password='testpass123')

    def test_full_payment_flow(self):
        """To'liq to'lov jarayonini tekshirish"""
        # 1. To'lov yaratish
        payment_data = {
            'amount': '100000.00',
            'payment_type': 'click',
        }
        response = self.client.post(
            reverse('payments:payment-create'),
            payment_data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        payment_id = response.json()['id']

        # 2. Click to'lovini boshlash
        click_data = {
            'action': 'prepare',
            'merchant_trans_id': payment_id,
            'amount': '100000.00'
        }
        response = self.client.post(
            reverse('payments:click-endpoint'),
            click_data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        merchant_prepare_id = response.json()['merchant_prepare_id']

        # 3. Click to'lovini yakunlash
        complete_data = {
            'action': 'complete',
            'click_trans_id': '123456',
            'merchant_trans_id': payment_id,
            'merchant_prepare_id': merchant_prepare_id,
            'amount': '100000.00',
            'sign_time': '2023-01-01 12:00:00',
            'sign': 'test_sign'
        }
        response = self.client.post(
            reverse('payments:click-endpoint'),
            complete_data,
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 4. To'lov holatini tekshirish
        payment = Payment.objects.get(id=payment_id)
        self.assertEqual(payment.status, 'completed')

        click_trans = ClickTransaction.objects.get(payment_id=payment_id)
        self.assertEqual(click_trans.status, 'completed')

    def test_payment_statistics(self):
        """To'lov statistikasini tekshirish"""
        # Test uchun to'lovlarni yaratish
        payments = [
            Payment.objects.create(
                user=self.user,
                amount=Decimal('100000.00'),
                payment_type='click',
                status='completed'
            ),
            Payment.objects.create(
                user=self.user,
                amount=Decimal('50000.00'),
                payment_type='payme',
                status='completed'
            ),
            Payment.objects.create(
                user=self.user,
                amount=Decimal('75000.00'),
                payment_type='cash',
                status='pending'
            )
        ]

        response = self.client.get(reverse('payments:payment-statistics'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(data['total_statistics']['total_payments'], 3)
        self.assertEqual(data['total_statistics']['successful_payments'], 2)
        self.assertEqual(
            Decimal(data['total_statistics']['total_amount']),
            Decimal('225000.00')
        )

    def test_payment_history(self):
        """To'lovlar tarixini tekshirish"""
        # Test uchun to'lovlarni yaratish
        payments = [
            Payment.objects.create(
                user=self.user,
                amount=Decimal('100000.00'),
                payment_type='click',
                status='completed'
            ),
            Payment.objects.create(
                user=self.user,
                amount=Decimal('50000.00'),
                payment_type='payme',
                status='failed'
            )
        ]

        response = self.client.get(reverse('payments:payment-history'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['payment_type'], 'click')
        self.assertEqual(data[1]['payment_type'], 'payme')

    def test_concurrent_payments(self):
        """Bir vaqtning o'zida bir nechta to'lovlarni tekshirish"""
        # 1. Bir nechta to'lovlarni yaratish
        payment1 = Payment.objects.create(
            user=self.user,
            amount=Decimal('100000.00'),
            payment_type='click',
            status='pending'
        )
        payment2 = Payment.objects.create(
            user=self.user,
            amount=Decimal('50000.00'),
            payment_type='payme',
            status='pending'
        )

        # 2. Click to'lovini boshlash
        click_service = ClickService()
        click_result = click_service.prepare_payment(payment1)

        # 3. Payme to'lovini boshlash
        payme_service = PaymeService()
        payme_result = payme_service.create_transaction({
            'amount': payment2.amount,
            'order_id': str(payment2.id)
        })

        # 4. Natijalarni tekshirish
        self.assertIsNotNone(click_result['merchant_prepare_id'])
        self.assertIsNotNone(payme_result['transaction_id'])

        # 5. To'lovlar holatini tekshirish
        payment1.refresh_from_db()
        payment2.refresh_from_db()

        self.assertEqual(payment1.status, 'pending')
        self.assertEqual(payment2.status, 'pending') 