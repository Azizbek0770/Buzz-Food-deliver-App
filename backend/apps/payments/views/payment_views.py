from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from ..models import Payment
from ..serializers import PaymentSerializer, PaymentHistorySerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def history(self, request):
        payments = self.get_queryset().order_by('-created_at')
        page = self.paginate_queryset(payments)
        
        if page is not None:
            serializer = PaymentHistorySerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = PaymentHistorySerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        queryset = self.get_queryset()
        
        # Umumiy to'lovlar statistikasi
        total_payments = queryset.count()
        total_amount = queryset.aggregate(total=Sum('amount'))['total'] or 0
        
        # Muvaffaqiyatli to'lovlar
        successful_payments = queryset.filter(status='completed').count()
        successful_amount = queryset.filter(status='completed').aggregate(
            total=Sum('amount'))['total'] or 0
            
        # Oxirgi 30 kunlik statistika
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_stats = queryset.filter(
            created_at__gte=thirty_days_ago
        ).values('created_at__date').annotate(
            count=Count('id'),
            total=Sum('amount')
        ).order_by('created_at__date')
        
        return Response({
            'total_payments': total_payments,
            'total_amount': total_amount,
            'successful_payments': successful_payments,
            'successful_amount': successful_amount,
            'daily_statistics': daily_stats
        }) 