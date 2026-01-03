from djongo import models
from django.conf import settings
from products.models import Product

import random
import string

def generate_order_id():
    # Generate a random 10-digit number as a string
    return ''.join(random.choices(string.digits, k=10))

class Order(models.Model):
    # Public facing ID (e.g. "8293710293")
    order_id = models.CharField(max_length=20, default=generate_order_id, unique=True, editable=False)
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pending')
    gift_card_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    shipping_address = models.TextField()
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.CharField(max_length=50) # External ID or Gift Card ID
    product_name = models.CharField(max_length=255)
    product_image = models.URLField(blank=True, null=True)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product_name}"
