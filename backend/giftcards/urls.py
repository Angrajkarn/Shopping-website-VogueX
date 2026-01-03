from django.urls import path
from .views import ValidateGiftCardView, CreateGiftCardView

urlpatterns = [
    path('validate/', ValidateGiftCardView.as_view(), name='validate_gift_card'),
    path('create/', CreateGiftCardView.as_view(), name='create_gift_card'),
]
