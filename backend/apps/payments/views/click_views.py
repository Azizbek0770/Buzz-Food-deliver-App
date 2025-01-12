from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from ..services.click_service import ClickService, ClickException
from ..models import Payment

@method_decorator(csrf_exempt, name='dispatch')
class ClickAPIView(APIView):
    """
    Click to'lov tizimi uchun API
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.click_service = ClickService()

    def post(self, request, *args, **kwargs):
        try:
            action = request.data.get('action')
            if action == 'prepare':
                return self._prepare(request.data)
            elif action == 'complete':
                return self._complete(request.data)
            else:
                return Response({
                    'error': -8,
                    'error_note': "Noto'g'ri harakat"
                }, status=status.HTTP_400_BAD_REQUEST)
        except ClickException as e:
            return Response({
                'error': e.code,
                'error_note': e.message
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': -8,
                'error_note': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _prepare(self, data):
        """To'lovni tayyorlash"""
        try:
            payment = Payment.objects.get(id=data['merchant_trans_id'])
            result = self.click_service.prepare_payment(payment)
            return Response(result)
        except Payment.DoesNotExist:
            return Response({
                'error': -5,
                'error_note': "To'lov topilmadi"
            }, status=status.HTTP_404_NOT_FOUND)

    def _complete(self, data):
        """To'lovni yakunlash"""
        result = self.click_service.complete_payment(data)
        return Response(result)

    def get(self, request, *args, **kwargs):
        """To'lov holatini tekshirish"""
        try:
            click_trans_id = request.query_params.get('click_trans_id')
            if not click_trans_id:
                return Response({
                    'error': -8,
                    'error_note': "click_trans_id parametri ko'rsatilmagan"
                }, status=status.HTTP_400_BAD_REQUEST)

            result = self.click_service.check_payment(click_trans_id)
            return Response(result)
        except ClickException as e:
            return Response({
                'error': e.code,
                'error_note': e.message
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': -8,
                'error_note': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 