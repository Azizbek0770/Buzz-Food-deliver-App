from celery import shared_task
from django.core.mail import send_mail

@shared_task
def notify_status_change(order_id, new_status):
    # Import Order inside the function to avoid circular import
    from .models import Order
    
    order = Order.objects.get(id=order_id)
    send_mail(
        subject=f'Buyurtma #{order.id} statusi o\'zgardi',
        message=f'Sizning buyurtmangiz statusi {new_status} ga o\'zgardi.',
        from_email='noreply@example.com',
        recipient_list=[order.user.email],
    ) 