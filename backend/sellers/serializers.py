from rest_framework import serializers
from .models import SellerProfile, SellerDashboard, Payout, SellerNotification
from users.serializers import UserSerializer # Assuming this exists
from django.contrib.auth import get_user_model

User = get_user_model()

class SellerProfileSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = SellerProfile
        fields = [
            'id', 'user', 'user_details', 'store_name', 'gst_number', 'phone_number',
            'verification_status', 'rating', 'total_sales', 'total_revenue',
            'return_rate', 'seller_score', 'badge', 'created_at'
        ]
        read_only_fields = ['user', 'rating', 'total_sales', 'total_revenue', 'return_rate', 'seller_score', 'badge']

    def get_user_details(self, obj):
        return {
            "name": f"{obj.user.first_name} {obj.user.last_name}",
            "email": obj.user.email
        }

class SellerDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerDashboard
        fields = '__all__'

class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = '__all__'

class SellerNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerNotification
        fields = '__all__'

class SellerOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(max_length=15, required=False)

    def validate(self, attrs):
        if not attrs.get('email') and not attrs.get('phone_number'):
            raise serializers.ValidationError("Either email or phone number is required")
        return attrs

class VerifySellerOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    phone_number = serializers.CharField(max_length=15, required=False)
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        if not attrs.get('email') and not attrs.get('phone_number'):
            raise serializers.ValidationError("Either email or phone number is required")
        return attrs
