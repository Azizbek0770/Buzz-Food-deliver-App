from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.http import Http404

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        if isinstance(exc, ValidationError):
            return Response({
                'error': 'Validatsiya xatosi',
                'details': exc.messages
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(exc, Http404):
            return Response({
                'error': 'Topilmadi',
                'details': str(exc)
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'error': 'Tizim xatosi',
            'details': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if response.status_code == 403:
        response.data = {
            'error': 'Ruxsat berilmagan',
            'details': response.data.get('detail', 'Sizda bu amalni bajarish uchun ruxsat yo\'q')
        }
    
    elif response.status_code == 401:
        response.data = {
            'error': 'Autentifikatsiya zarur',
            'details': response.data.get('detail', 'Iltimos, tizimga kiring')
        }

    return response 