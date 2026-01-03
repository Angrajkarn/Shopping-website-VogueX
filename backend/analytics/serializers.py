from rest_framework import serializers
from .models import UserInteraction

class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = ['interaction_type', 'product_id', 'metadata', 'session_id']
