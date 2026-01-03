from rest_framework import serializers
from .models import GiftCard

class GiftCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiftCard
        fields = ['code', 'current_balance', 'expiry_date', 'is_active']
        read_only_fields = ['code', 'current_balance', 'expiry_date', 'is_active']

class GiftCardRedeemSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)

class GiftCardCreateSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='initial_balance')
    
    class Meta:
        model = GiftCard
        fields = ['amount']
        
    def create(self, validated_data):
        amount = validated_data.pop('initial_balance')
        return GiftCard.objects.create(initial_balance=amount, current_balance=amount)
