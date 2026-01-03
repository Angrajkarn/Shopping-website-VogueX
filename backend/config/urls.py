from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def home(request):
    return JsonResponse({"status": "active", "message": "Fashion Advance API is Running"})

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/loyalty/', include('loyalty.urls')),
    path('api/giftcards/', include('giftcards.urls')),
    path('api/sellers/', include('sellers.urls')),
    path('api/admin-panel/', include('admin_panel.urls')),
]
