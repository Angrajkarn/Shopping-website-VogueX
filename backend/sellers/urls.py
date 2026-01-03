from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardView, InventoryInsightView, PayoutViewSet, 
    NotificationViewSet, SellerSignupView, SellerLoginView,
    SendSellerOTPView
)

router = DefaultRouter()
router.register(r'payouts', PayoutViewSet, basename='payout')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('auth/signup/', SellerSignupView.as_view(), name='seller-signup'),
    path('auth/login/', SellerLoginView.as_view(), name='seller-login'),
    path('auth/send-otp/', SendSellerOTPView.as_view(), name='seller-send-otp'),
    path('dashboard/', DashboardView.as_view(), name='seller-dashboard'),
    path('inventory-insights/', InventoryInsightView.as_view(), name='inventory-insights'),
    path('', include(router.urls)),
]
