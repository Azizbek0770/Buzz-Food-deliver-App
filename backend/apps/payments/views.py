import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .services.payme import PaymeService, PaymeException
from .models import Payment, PaymeTransaction

class PaymeAPIView(APIView):
    permission_classes = []

    def __init__(self):
        super().__init__()
        self.payme_service = PaymeService()

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            method = data.get('method')
            params = data.get('params', {})

            if method == 'CheckPerformTransaction':
                response = self._check_perform_transaction(params)
            elif method == 'CreateTransaction':
                response = self._create_transaction(params)
            elif method == 'PerformTransaction':
                response = self._perform_transaction(params)
            elif method == 'CancelTransaction':
                response = self._cancel_transaction(params)
            elif method == 'CheckTransaction':
                response = self._check_transaction(params)
            else:
                response = {
                    'error': {
                        'code': -32601,
                        'message': 'Method not found'
                    }
                }

            return Response(response)

        except PaymeException as e:
            return Response({
                'error': {
                    'code': e.code,
                    'message': e.message
                }
            })
        except Exception as e:
            return Response({
                'error': {
                    'code': -32400,
                    'message': str(e)
                }
            })

    def _check_perform_transaction(self, params):
        """Tranzaksiyani tekshirish"""
        account = params.get('account', {})
        amount = params.get('amount')
        
        try:
            order_id = account.get('order_id')
            payment = Payment.objects.get(order_id=order_id)
            
            if payment.status != 'pending':
                raise PaymeException(
                    self.payme_service.ERROR_ORDER_AVAILABLE,
                    'Order is not available'
                )

            if payment.amount * 100 != amount:
                raise PaymeException(
                    self.payme_service.ERROR_INVALID_AMOUNT,
                    'Incorrect amount'
                )

            return {
                'result': {
                    'allow': True
                }
            }

        except Payment.DoesNotExist:
            raise PaymeException(
                self.payme_service.ERROR_ORDER_NOT_FOUND,
                'Order not found'
            )

    def _create_transaction(self, params):
        """Tranzaksiya yaratish"""
        account = params.get('account', {})
        amount = params.get('amount')
        transaction_id = params.get('id')
        time = params.get('time')

        try:
            order_id = account.get('order_id')
            payment = Payment.objects.get(order_id=order_id)

            transaction = PaymeTransaction.objects.create(
                payment=payment,
                transaction_id=transaction_id,
                request_id=str(time),
                amount=amount / 100,
                status=1
            )

            return {
                'result': {
                    'create_time': int(transaction.created_at.timestamp() * 1000),
                    'transaction': str(transaction.id),
                    'state': transaction.status
                }
            }

        except Payment.DoesNotExist:
            raise PaymeException(
                self.payme_service.ERROR_ORDER_NOT_FOUND,
                'Order not found'
            )

    def _perform_transaction(self, params):
        """To'lovni amalga oshirish"""
        transaction_id = params.get('id')
        return {
            'result': self.payme_service.perform_transaction(
                transaction_id,
                params.get('amount')
            )
        }

    def _cancel_transaction(self, params):
        """To'lovni bekor qilish"""
        transaction_id = params.get('id')
        reason = params.get('reason')
        return {
            'result': self.payme_service.cancel_transaction(
                transaction_id,
                reason
            )
        }

    def _check_transaction(self, params):
        """Tranzaksiya holatini tekshirish"""
        transaction_id = params.get('id')
        return {
            'result': self.payme_service.check_transaction(transaction_id)
        } 