from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from ..models import Payment, ClickTransaction

User = get_user_model()

class ClickAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
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
        self.click_url = reverse('payments:click-endpoint')

    def test_prepare_payment(self):
        """To'lovni tayyorlash API testi"""
        data = {
            'action': 'prepare',
            'merchant_trans_id': str(self.payment.id),
            'amount': str(self.payment.amount)
        }

        response = self.client.post(self.click_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['merchant_trans_id'], str(self.payment.id))
        self.assertEqual(Decimal(response.data['amount']), self.payment.amount)
        self.assertEqual(response.data['status'], 0)
        self.assertIsNone(response.data['error'])

    def test_complete_payment(self):
        """To'lovni yakunlash API testi"""
        click_trans = ClickTransaction.objects.create(
            payment=self.payment,
            amount=self.payment.amount,
            status='pending'
        )

        data = {
            'action': 'complete',
            'click_trans_id': '123456',
            'service_id': 'test_service',
            'merchant_trans_id': str(self.payment.id),
            'merchant_prepare_id': str(click_trans.id),
            'amount': str(self.payment.amount),
            'sign_time': '2023-01-01 12:00:00',
            'sign': 'test_sign'
        }

        response = self.client.post(self.click_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['click_trans_id'], '123456')
        self.assertEqual(response.data['merchant_trans_id'], str(self.payment.id))
        self.assertEqual(response.data['status'], 0)
        self.assertIsNone(response.data['error'])

        # Payment va ClickTransaction yangilanganligini tekshirish
        self.payment.refresh_from_db()
        click_trans.refresh_from_db()

        self.assertEqual(self.payment.status, 'completed')
        self.assertEqual(click_trans.status, 'completed')

    def test_check_payment(self):
        """To'lov holatini tekshirish API testi"""
        click_trans = ClickTransaction.objects.create(
            payment=self.payment,
            amount=self.payment.amount,
            status='completed',
            click_trans_id='123456'
        )

        response = self.client.get(
            self.click_url,
            {'click_trans_id': '123456'},
            format='json'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['click_trans_id'], '123456')
        self.assertEqual(response.data['merchant_trans_id'], str(self.payment.id))
        self.assertEqual(response.data['status'], 0)
        self.assertIsNone(response.data['error'])

    def test_invalid_action(self):
        """Noto'g'ri harakat testi"""
        data = {
            'action': 'invalid_action',
            'merchant_trans_id': str(self.payment.id)
        }

        response = self.client.post(self.click_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], -8)
        self.assertEqual(response.data['error_note'], "Noto'g'ri harakat")

    def test_payment_not_found(self):
        """To'lov topilmadi testi"""
        data = {
            'action': 'prepare',
            'merchant_trans_id': '99999',
            'amount': '100000.00'
        }

        response = self.client.post(self.click_url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], -5)
        self.assertEqual(response.data['error_note'], "To'lov topilmadi") 