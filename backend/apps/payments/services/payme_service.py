from django.conf import settings
from ..models import Payment

class PaymeService:
    def __init__(self):
        self.merchant_id = settings.PAYME_MERCHANT_ID
        self.key = settings.PAYME_KEY
        
    def create_transaction(self, payment: Payment):
        # Payme transaction yaratish logikasi
        pass
        
    def check_transaction(self, transaction_id: str):
        # Transaction statusini tekshirish
        pass
        
    def perform_transaction(self, transaction_id: str):
        # To'lovni amalga oshirish
        pass 