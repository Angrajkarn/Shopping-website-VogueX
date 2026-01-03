from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'product_name', 'product_image', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    gift_card_code = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Order
        fields = ['id', 'order_id', 'user', 'total_amount', 'status', 'created_at', 'shipping_address', 'items', 'gift_card_discount', 'gift_card_code']
        read_only_fields = ['user', 'created_at', 'gift_card_discount']
