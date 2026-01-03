from django.urls import path
from .views import (
    SignupView, UserProfileView, AddressListCreateView, AddressDetailView,
    SendOTPView, VerifyOTPView, GoogleLoginView,
    ForgotPasswordView, ResetPasswordView, SendSignupOTPView,
    ContactMessageCreateView, JobApplicationCreateView, UserDashboardView, NotificationListView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/signup/otp/', SendSignupOTPView.as_view(), name='send-signup-otp'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('contact/', ContactMessageCreateView.as_view(), name='contact-create'),
    path('careers/apply/', JobApplicationCreateView.as_view(), name='job-application-create'),
    
    # New Auth Endpoints
    path('auth/otp/send/', SendOTPView.as_view(), name='send-otp'),
    path('auth/otp/verify/', VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('notifications/', NotificationListView.as_view(), name='notifications'),
]
