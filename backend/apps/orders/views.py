from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Prefetch
from .models import Order, OrderItem
from .serializers import OrderSerializer
from .tasks import notify_status_change
from apps.restaurants.models import MenuItem
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related(
            Prefetch(
                'items',
                queryset=OrderItem.objects.select_related('menu_item')
            ),
            'restaurant'
        ).order_by('-created_at')

class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related(
            Prefetch(
                'items',
                queryset=OrderItem.objects.select_related('menu_item')
            ),
            'restaurant'
        )

class OrderStatusUpdateView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        old_status = self.get_object().status
        order = serializer.save()
        if old_status != order.status:
            notify_status_change.delay(order.id, order.status) 

class DeliveryOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Faqat yetkazib beruvchiga tegishli buyurtmalarni qaytaradi
        if self.request.user.is_delivery_driver:
            return Order.objects.filter(
                status__in=['pending', 'accepted', 'on_way'],
                delivery_driver=self.request.user
            ).order_by('-created_at')
        return Order.objects.none()
    
    @action(detail=True, methods=['post'])
    def accept_order(self, request, pk=None):
        order = self.get_object()
        if order.status != 'pending':
            return Response(
                {'error': 'Bu buyurtma boshqa yetkazib beruvchi tomonidan qabul qilingan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'accepted'
        order.delivery_driver = request.user
        order.save()
        return Response(self.get_serializer(order).data)
    
    @action(detail=True, methods=['post'])
    def start_delivery(self, request, pk=None):
        order = self.get_object()
        if order.status != 'accepted' or order.delivery_driver != request.user:
            return Response(
                {'error': 'Buyurtma holatini o\'zgartirish mumkin emas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'on_way'
        order.save()
        return Response(self.get_serializer(order).data)
    
    @action(detail=True, methods=['post'])
    def complete_delivery(self, request, pk=None):
        order = self.get_object()
        if order.status != 'on_way' or order.delivery_driver != request.user:
            return Response(
                {'error': 'Buyurtma holatini o\'zgartirish mumkin emas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'delivered'
        order.save()
        return Response(self.get_serializer(order).data) 