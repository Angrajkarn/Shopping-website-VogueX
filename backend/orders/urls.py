from django.urls import path
from .views import OrderListCreateView, OrderDetailView, RazorpayOrderView, RazorpayWebhookView, VerifyPaymentView, CancelOrderView, InvoiceView, SyncCartView

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<str:order_id>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<str:order_id>/cancel/', CancelOrderView.as_view(), name='cancel-order'),
    path('orders/<str:order_id>/invoice/', InvoiceView.as_view(), name='order-invoice'),
    path('orders/cart/sync/', SyncCartView.as_view(), name='cart-sync'),
    path('razorpay/create/', RazorpayOrderView.as_view(), name='razorpay-create'),
    path('razorpay/verify/', VerifyPaymentView.as_view(), name='razorpay-verify'),
    path('webhook/razorpay/', RazorpayWebhookView.as_view(), name='razorpay-webhook'),
]
