from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SellerProfile, SellerDashboard, Payout, SellerNotification
from .serializers import (
    SellerProfileSerializer, SellerDashboardSerializer, 
    PayoutSerializer, SellerNotificationSerializer,
    SellerOTPSerializer, VerifySellerOTPSerializer
)
from .utils import calculate_seller_score, predict_inventory_demand, fraud_order_check
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from users.models import OTP # Reuse users OTP model
import random
from django.utils import timezone
from datetime import timedelta
from users.utils import send_otp_email # Reuse email sender

User = get_user_model()

class SellerBasePermission(permissions.BasePermission):
    """
    Ensure user is registered as a seller
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        # Check if user has seller profile
        return hasattr(request.user, 'seller_profile')

class DashboardView(APIView):
    permission_classes = [SellerBasePermission]

    def get(self, request):
        seller = request.user.seller_profile
        
        # Get or Create Dashboard Cache
        dashboard, created = SellerDashboard.objects.get_or_create(seller=seller)
        
        # Refresh Logic (Real-time simulation)
        # In prod, this would be async or incremental. Here we fetch fresh counts.
        
        # Recalculate Score
        new_score = calculate_seller_score(seller)
        seller.seller_score = new_score
        seller.save()
        
        # Serialize
        data = SellerDashboardSerializer(dashboard).data
        data['seller_score'] = new_score
        data['badge'] = seller.badge
        data['verification_status'] = seller.verification_status
        
        return Response(data)

class InventoryInsightView(APIView):
    permission_classes = [SellerBasePermission]

    def get(self, request):
        # Scan products for this seller (assuming Product has 'seller' or filtered by brand/user)
        # For now, we mock scanning all products as if this user owns them or by some relation
        # In a real multi-vendor setup, Product would have ForeignKey(Seller)
        
        # Taking top 20 products to analyze
        products = Product.objects.all()[:20] 
        insights = []
        
        for p in products:
            # Mock daily sales avg (random or from Orders)
            daily_sales = 5 # Mock
            # Calculate inventory health
            # Assuming product has 'stock' field?
            stock = getattr(p, 'stock', 0)
            
            insight = predict_inventory_demand(p.id, stock, daily_sales)
            insight['product_name'] = p.name
            insights.append(insight)
            
        return Response(insights)

class PayoutViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [SellerBasePermission]
    serializer_class = PayoutSerializer

    def get_queryset(self):
        return Payout.objects.filter(seller=request.user.seller_profile)

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [SellerBasePermission]
    serializer_class = SellerNotificationSerializer

    def get_queryset(self):
        return SellerNotification.objects.filter(seller=self.request.user.seller_profile)
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller_profile)

class RegisterSellerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

class SellerSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        store_name = data.get('store_name')
        name = data.get('name', 'Seller')
        otp_code = data.get('otp')
        
        if not email or not password or not store_name or not otp_code:
            return Response({"error": "Email, Password, Store Name and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Verify OTP
        otp_obj = OTP.objects.filter(
            email=email, 
            otp_code=otp_code,
            is_verified=False,
            created_at__gte=timezone.now() - timedelta(minutes=10)
        ).first()
        
        if not otp_obj:
             return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
        if SellerProfile.objects.filter(store_name=store_name).exists():
            return Response({"error": "Store Name already taken"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # 1. Create User
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=name.split(' ')[0],
                last_name=name.split(' ')[-1] if ' ' in name else '',
                is_seller=True
            )
            
            # 2. Create Seller Profile
            seller_profile = SellerProfile.objects.create(
                user=user,
                store_name=store_name,
                phone_number=data.get('phone_number', ''),
                gst_number=data.get('gst_number', '')
            )
            
            # 3. Create Dashboard
            SellerDashboard.objects.create(seller=seller_profile)
            
            # 4. Mark OTP verified
            otp_obj.is_verified = True
            otp_obj.save()
            
            # 5. Generate Token
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Seller Account Created Successfully",
                "seller": SellerProfileSerializer(seller_profile).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendSellerOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SellerOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone_number = serializer.validated_data.get('phone_number')
            
            # Check if User already exists (prevent duplicate signup)
            if email and User.objects.filter(email=email).exists():
                 return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate 6-digit OTP
            otp_code = str(random.randint(100000, 999999))
            
            # Save OTP
            OTP.objects.create(
                email=email,
                phone_number=phone_number,
                otp_code=otp_code
            )
            
            # Send Email (Production)
            if email:
                try:
                    send_otp_email(email, otp_code, subject="VogueX Seller Verification")
                except Exception as e:
                    print(f"Failed to send email: {e}")
            
            # Debug/Mock output for development
            print(f"========================================")
            print(f"SELLER OTP for {email or phone_number}: {otp_code}")
            print(f"========================================")
            
            return Response({"message": "OTP sent successfully. Check your email/phone."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(username=email, password=password) # username is email
        
        if not user:
            # Try matching by email explicitly if username != email in some configs
            try:
                u = User.objects.get(email=email)
                if u.check_password(password):
                    user = u
            except User.DoesNotExist:
                pass
        
        if not user:
             return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)
             
        # Check if Seller
        if not hasattr(user, 'seller_profile'):
            return Response({"error": "This account is not registered as a Seller"}, status=status.HTTP_403_FORBIDDEN)
            
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "message": "Login Successful",
            "seller": SellerProfileSerializer(user.seller_profile).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        })
