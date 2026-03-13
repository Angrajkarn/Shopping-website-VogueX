from django.urls import path
from .views import LoyaltyDashboardView, AwardCoinsView

urlpatterns = [
    path('dashboard/', LoyaltyDashboardView.as_view(), name='loyalty_dashboard'),
    path('award/', AwardCoinsView.as_view(), name='loyalty_award'),
]
