from rest_framework import serializers
from django.contrib.auth import get_user_model
from sellers.models import SellerProfile
from sellers.serializers import SellerProfileSerializer

User = get_user_model()

class UserAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active', 'is_seller', 'is_plus_member']

class AdminSellerSerializer(SellerProfileSerializer):
    email = serializers.EmailField(source='user.email')
    
    class Meta(SellerProfileSerializer.Meta):
        fields = SellerProfileSerializer.Meta.fields + ['email']

from orders.serializers import OrderSerializer
from users.serializers import AddressSerializer

class UserDetailAdminSerializer(UserAdminSerializer):
    orders = OrderSerializer(many=True, read_only=True)
    addresses = AddressSerializer(many=True, read_only=True)
    
    class Meta(UserAdminSerializer.Meta):
        fields = UserAdminSerializer.Meta.fields + ['phone_number', 'super_coins', 'gender', 'profile_picture', 'addresses', 'orders']
