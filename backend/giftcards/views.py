from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import GiftCard
from .serializers import GiftCardSerializer, GiftCardRedeemSerializer, GiftCardCreateSerializer

class ValidateGiftCardView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GiftCardRedeemSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            try:
                gc = GiftCard.objects.get(code=code)
                if not gc.is_valid():
                     return Response({'error': 'Gift card is inactive, expired, or has zero balance'}, status=status.HTTP_400_BAD_REQUEST)
                
                return Response(GiftCardSerializer(gc).data)
            except GiftCard.DoesNotExist:
                return Response({'error': 'Invalid Gift Card Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateGiftCardView(APIView):
    # This endpoint should be protected in production
    permission_classes = [permissions.AllowAny] 

    def post(self, request):
        serializer = GiftCardCreateSerializer(data=request.data)
        if serializer.is_valid():
            gc = serializer.save()
            if request.user.is_authenticated:
                gc.created_by = request.user
                gc.save()
            return Response(GiftCardSerializer(gc).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
