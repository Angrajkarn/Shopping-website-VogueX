from rest_framework import generics, permissions, status
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer, AddressSerializer, OTPSerializer, VerifyOTPSerializer,
    GoogleLoginSerializer, ForgotPasswordSerializer, ResetPasswordSerializer,
    ContactMessageSerializer, JobApplicationSerializer, NotificationSerializer
)
from .models import Address, OTP, ContactMessage, JobApplication, Notification
from orders.models import Order
from rest_framework_simplejwt.tokens import RefreshToken
import random
import requests
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .utils import send_otp_email, send_welcome_email, send_password_reset_success_email

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class SendSignupOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "User with this email already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate and Save OTP
            otp_code = str(random.randint(100000, 999999))
            OTP.objects.create(email=email, otp_code=otp_code)
            
            # Send Email (VogueX Premium HTML)
            try:
                success = send_otp_email(email, otp_code)
                if success:
                    print(f"DEBUG: Premium HTML Email sent to {email}")
                else:
                    raise Exception("Email sending function returned False")

            except Exception as e:
                print(f"EMAIL ERROR (Recovered): {e}")
                print(f"========================================")
                print(f"FALLBACK OTP for {email}: {otp_code}")
                print(f"========================================")
                # In production, we might want to alert admins, but for now allow flow to proceed
                
            return Response({"message": f"OTP sent to {email}"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

class JobApplicationCreateView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.AllowAny]

class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        email = data.get('email')
        otp_code = data.get('otp')
        
        # Verify OTP
        if not otp_code:
             return Response({"error": "OTP is required."}, status=status.HTTP_400_BAD_REQUEST)
             
        otp_obj = OTP.objects.filter(
            email=email, 
            otp_code=otp_code,
            is_verified=False,
            created_at__gte=timezone.now() - timedelta(minutes=10)
        ).first()
        
        if not otp_obj:
            return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        # Create User
        try:
            response = super().create(request, *args, **kwargs)
            
            # Mark OTP as verified
            otp_obj.is_verified = True
            otp_obj.save()
            
            # Send Welcome Email (VogueX Premium)
            try:
                # Need to fetch the created user properly from response or request
                # super().create returns the serializer data. 
                # Let's verify if we can access creation status.
                # Actually, simple refactor:
                user_email = response.data.get('email')
                user_name = response.data.get('first_name', 'Fashionista')
                send_welcome_email(user_email, user_name)
            except Exception as e:
                print(f"WELCOME EMAIL ERROR: {e}")
            
            return response
        except IntegrityError:
            return Response(
                {"error": "User with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

class SendOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone_number = serializer.validated_data.get('phone_number')
            
            # Generate 6-digit OTP
            otp_code = str(random.randint(100000, 999999))
            
            # Save OTP
            OTP.objects.create(
                email=email,
                phone_number=phone_number,
                otp_code=otp_code
            )
            
            # In a real app, send via SMS or Email
            print(f"========================================")
            print(f"OTP for {email or phone_number}: {otp_code}")
            print(f"========================================")
            
            return Response({"message": "OTP sent successfully", "debug_otp": otp_code}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone_number = serializer.validated_data.get('phone_number')
            otp_code = serializer.validated_data.get('otp')
            
            # Find OTP
            otp_obj = OTP.objects.filter(
                email=email, 
                phone_number=phone_number, 
                otp_code=otp_code,
                is_verified=False,
                created_at__gte=timezone.now() - timedelta(minutes=10)
            ).first()
            
            if not otp_obj:
                return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get or Create User
            user = None
            try:
                if email:
                    user, created = User.objects.get_or_create(email=email)
                    if created:
                        user.set_unusable_password()
                        user.save()
                elif phone_number:
                    # Look for existing user with this phone number
                    user = User.objects.filter(phone_number=phone_number).first()
                    if not user:
                        # Create new user with a placeholder email
                        # Use timestamp to ensure uniqueness of placeholder email
                        import time
                        timestamp = int(time.time())
                        placeholder_email = f"{phone_number}_{timestamp}@example.com"
                        user = User.objects.create(
                            phone_number=phone_number,
                            email=placeholder_email
                        )
                        user.set_unusable_password()
                        user.save()
            except Exception as e:
                return Response({"error": f"Error creating user: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Only mark OTP as verified if we successfully got/created the user
            otp_obj.is_verified = True
            otp_obj.save()
            
            if user:
                tokens = get_tokens_for_user(user)
                return Response(tokens, status=status.HTTP_200_OK)
                
            return Response({"error": "User could not be created"}, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data['token']
            
            # Verify token with Google
            try:
                response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}')
                if response.status_code != 200:
                    print(f"GOOGLE TOKEN ERROR: {response.text}")
                    return Response({"error": f"Invalid Google Token: {response.text}"}, status=status.HTTP_400_BAD_REQUEST)
                
                google_data = response.json()
                print(f"GOOGLE TOKEN DATA: {google_data}")
                email = google_data.get('email')
                
                if not email:
                    return Response({"error": "Email not found in Google Token"}, status=status.HTTP_400_BAD_REQUEST)
                
                user, created = User.objects.get_or_create(email=email)
                if created:
                    user.first_name = google_data.get('given_name', '')
                    user.last_name = google_data.get('family_name', '')
                    user.set_unusable_password()
                    user.save()
                
                tokens = get_tokens_for_user(user)
                return Response(tokens, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            
            if user:
                # Generate OTP
                otp_code = str(random.randint(100000, 999999))
                OTP.objects.create(email=email, otp_code=otp_code)
                
                # Send Email (VogueX Premium Reset OTP)
                try:
                    send_otp_email(email, otp_code, subject="Reset Password - VogueX OTP")
                    print(f"DEBUG: Password Reset Email sent to {email}")
                except Exception as e:
                    print(f"EMAIL ERROR: {e}")
                
                return Response({"message": "OTP sent if email exists"}, status=status.HTTP_200_OK)
            
            # Don't reveal if user exists
            return Response({"message": "OTP sent if email exists"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        print(f"DEBUG: Reset Password Request Data: {request.data}")
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            
            otp_obj = OTP.objects.filter(
                email=email, 
                otp_code=otp_code,
                is_verified=False,
                created_at__gte=timezone.now() - timedelta(minutes=10)
            ).first()
            
            if not otp_obj:
                print(f"DEBUG: Invalid or expired OTP for {email} code {otp_code}")
                # Check if it exists but is verified or expired
                debug_otp = OTP.objects.filter(email=email, otp_code=otp_code).first()
                if debug_otp:
                    print(f"DEBUG: Found OTP but invalid. Verified: {debug_otp.is_verified}, Created: {debug_otp.created_at}")
                else:
                    print("DEBUG: OTP does not exist at all")

                return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.filter(email=email).first()
            if user:
                user.set_password(new_password)
                user.save()
                otp_obj.is_verified = True
                otp_obj.save()
                
                # Send Success Email
                try:
                    send_password_reset_success_email(email, user.first_name)
                except Exception as e:
                    print(f"SUCCESS EMAIL ERROR: {e}")

                return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
            
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"DEBUG: Serializer Errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDashboardView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        total_orders = Order.objects.filter(user=user).count()
        recent_orders = Order.objects.filter(user=user).order_by('-created_at')[:5]
        saved_addresses = Address.objects.filter(user=user).count()
        payment_methods = 0
        
        formatted_orders = []
        for order in recent_orders:
            formatted_orders.append({
                'id': order.id,
                'created_at': order.created_at,
                'total_amount': order.total_amount,
                'status': order.status
            })

        return Response({
            "total_orders": total_orders,
            "saved_addresses": saved_addresses,
            "payment_methods": payment_methods,
            "super_coins": user.super_coins,
            "is_plus_member": user.is_plus_member,
            "recent_orders": formatted_orders
        })

class NotificationListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        unread_count = queryset.filter(is_read=False).count()
        return Response({
            "notifications": serializer.data,
            "unread_count": unread_count
        })

    def patch(self, request, *args, **kwargs):
        # Mark specific notification as read
        notification_id = request.data.get('id')
        if notification_id:
            try:
                notification = Notification.objects.get(id=notification_id, user=request.user)
                notification.is_read = True
                notification.save()
                return Response({"status": "success"})
            except Notification.DoesNotExist:
                return Response({"error": "Notification not found"}, status=404)
        
        # Mark ALL as read
        if request.data.get('mark_all_read'):
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
            return Response({"status": "success"})

        return Response({"error": "Invalid request"}, status=400)

class NewsletterSubscriptionView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if email:
            print(f"Newsletter Subscription for: {email}")
            return Response({"message": "Subscribed successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
