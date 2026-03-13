import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ShoppingSession, SessionMember
import uuid

class ShoppingSessionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'shop_{self.session_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Notify others about new member
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'user': self.scope.get('user').email if self.scope.get('user').is_authenticated else 'Guest'
            }
        )

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type')

        if message_type == 'product_like':
            # Broadcast like event to everyone in the room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'broadcast_event',
                    'event': {
                        'type': 'product_like',
                        'product_id': data.get('product_id'),
                        'product_name': data.get('product_name'),
                        'user': self.scope.get('user').email if self.scope.get('user').is_authenticated else 'Guest'
                    }
                }
            )
        elif message_type == 'chat_message':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'broadcast_event',
                    'event': {
                        'type': 'chat_message',
                        'message': data.get('message'),
                        'user': self.scope.get('user').email if self.scope.get('user').is_authenticated else 'Guest'
                    }
                }
            )

    # Receive message from room group
    async def user_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system',
            'message': f"{event['user']} joined the session"
        }))

    async def broadcast_event(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event['event']))
