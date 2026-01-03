from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminDashboardStatsView, 
    UserManagementViewSet, 
    SellerVerificationViewSet,
    AdminLoginView,
    AdminSignupView,
    AdminActivityView,
    RevenueForecastView,
    UserAnalyticsView,
    SellerPerformanceView
)

router = DefaultRouter()
router.register(r'users', UserManagementViewSet, basename='admin-users')
router.register(r'sellers', SellerVerificationViewSet, basename='admin-sellers')

urlpatterns = [
    path('auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('dashboard/activity/', AdminActivityView.as_view(), name='admin-activity'),
    
    # Advanced Analytics
    path('analytics/revenue-forecast/', RevenueForecastView.as_view(), name='admin-revenue-forecast'),
    path('analytics/users/rfm/', UserAnalyticsView.as_view(), name='admin-user-rfm'),
    path('sellers/<int:pk>/performance/', SellerPerformanceView.as_view(), name='admin-seller-performance'),

    path('', include(router.urls)),
]
