import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache
from .models import Order
from .serializers import OrderSerializer
from channels.layers import get_channel_layer

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.order_group_name = None
        
        if not self.user.is_authenticated:
            await self.close()
            return
            
        if "orderId" in self.scope["url_route"]["kwargs"]:
            order_id = self.scope["url_route"]["kwargs"]["orderId"]
            self.order_group_name = f"order_{order_id}"
            await self.channel_layer.group_add(
                self.order_group_name,
                self.channel_name
            )
        else:
            self.order_group_name = f"user_orders_{self.user.id}"
            await self.channel_layer.group_add(
                self.order_group_name,
                self.channel_name
            )
        
        await self.accept()
        
        # Send initial data
        if self.order_group_name.startswith("order_"):
            order = await self.get_order(order_id)
            if order:
                await self.send_order_update(order)

    async def disconnect(self, close_code):
        if self.order_group_name:
            await self.channel_layer.group_discard(
                self.order_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get("action")
            
            if action == "subscribe":
                order_id = data.get("orderId")
                if order_id:
                    old_group = self.order_group_name
                    self.order_group_name = f"order_{order_id}"
                    
                    if old_group:
                        await self.channel_layer.group_discard(
                            old_group,
                            self.channel_name
                        )
                    
                    await self.channel_layer.group_add(
                        self.order_group_name,
                        self.channel_name
                    )
                    
                    order = await self.get_order(order_id)
                    if order:
                        await self.send_order_update(order)
            
            elif action == "unsubscribe":
                if self.order_group_name.startswith("order_"):
                    self.order_group_name = f"user_orders_{self.user.id}"
                    await self.channel_layer.group_add(
                        self.order_group_name,
                        self.channel_name
                    )
        
        except json.JSONDecodeError:
            pass

    async def order_update(self, event):
        order_data = event["data"]
        await self.send(text_data=json.dumps({
            "type": "order.update",
            "data": order_data
        }))

    @database_sync_to_async
    def get_order(self, order_id):
        try:
            cache_key = f"order:{order_id}"
            order_data = cache.get(cache_key)
            
            if not order_data:
                order = Order.objects.get(id=order_id)
                serializer = OrderSerializer(order)
                order_data = serializer.data
                cache.set(cache_key, order_data, timeout=300)  # 5 minutes
                
            return order_data
        except Order.DoesNotExist:
            return None

    async def send_order_update(self, order_data):
        await self.send(text_data=json.dumps({
            "type": "order.update",
            "data": order_data
        }))

    @classmethod
    async def notify_order_update(cls, order):
        serializer = OrderSerializer(order)
        order_data = serializer.data
        
        # Update cache
        cache_key = f"order:{order.id}"
        cache.set(cache_key, order_data, timeout=300)
        
        channel_layer = get_channel_layer()
        
        # Notify specific order group
        await channel_layer.group_send(
            f"order_{order.id}",
            {
                "type": "order.update",
                "data": order_data
            }
        )
        
        # Notify user's orders group
        await channel_layer.group_send(
            f"user_orders_{order.user.id}",
            {
                "type": "order.update",
                "data": order_data
            }
        ) 