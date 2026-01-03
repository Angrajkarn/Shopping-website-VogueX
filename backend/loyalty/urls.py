from django.urls import path
from .views import LoyaltyDashboardView

urlpatterns = [
    path('dashboard/', LoyaltyDashboardView.as_view(), name='loyalty_dashboard'),
]
