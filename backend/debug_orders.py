import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from orders.models import Order
from orders.serializers import OrderSerializer
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.first()

if not user:
    print("No user found")
else:
    print(f"Checking orders for {user.email}")
    orders = Order.objects.filter(user=user).order_by('-created_at')
    
    try:
        serializer = OrderSerializer(orders, many=True)
        print("Serialization Successful")
        # print(serializer.data) 
    except Exception as e:
        print(f"Serialization Failed: {e}")
        import traceback
        traceback.print_exc()

    # Also check individual order item serialization
    print("Checking individual orders...")
    for order in orders:
        try:
            s = OrderSerializer(order)
            _ = s.data
            print(f"Order {order.id} OK")
        except Exception as e:
            print(f"Order {order.id} Failed: {e}")
