import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from django.utils import timezone
from users.models import User
from orders.models import Order
from django.db.models import Sum

class AdminDashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Check permission (In production, verify admin token here)
        # For now, we assume middleware handles auth or we allow connection 
        # and validate first message
        
        self.room_group_name = 'admin_dashboard'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'get_live_stats':
            # Calculate stats and send back
            stats = await self.get_live_stats()
            await self.send(text_data=json.dumps({
                'type': 'live_stats',
                'data': stats
            }))

    # Receive message from room group (Broadcast)
    async def dashboard_update(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'update',
            'data': message
        }))

    @sync_to_async
    def get_live_stats(self):
        # Real-time metrics
        # 1. Active Users (Mocked for now or use Session cache)
        active_users = 42 # Placeholder for Redis session count
        
        # 2. Orders Today
        now = timezone.now()
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        orders_today = Order.objects.filter(created_at__gte=start_of_day).count()
        
        # 3. Revenue Today
        revenue_today = Order.objects.filter(created_at__gte=start_of_day).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        return {
            'active_users': active_users,
            'orders_today': orders_today,
            'revenue_today': float(revenue_today),
            'timestamp': now.isoformat()
        }
