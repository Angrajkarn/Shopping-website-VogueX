from django.db import models
from django.conf import settings
from django.utils import timezone

class SellerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='seller_profile')
    store_name = models.CharField(max_length=100, unique=True)
    gst_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=15)
    
    # Verification
    STATUS_CHOICES = (
        ('PENDING', 'Pending Verification'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
        ('SUSPENDED', 'Suspended'),
    )
    verification_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Metrics
    rating = models.FloatField(default=0.0)
    total_sales = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    return_rate = models.FloatField(default=0.0) # Percentage
    
    # Gamification
    seller_score = models.IntegerField(default=50) # 0-100
    badge = models.CharField(max_length=20, default='New Seller') # e.g., Gold, Platinum
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.store_name} ({self.user.email})"

class SellerDashboard(models.Model):
    """
    Cache table for real-time dashboard stats to avoid expensive queries on every load.
    Updated via Signals or Celery tasks.
    """
    seller = models.OneToOneField(SellerProfile, on_delete=models.CASCADE, related_name='dashboard_stats')
    
    # Real-time stats (Daily/Monthly reset logic handled in utils)
    today_views = models.IntegerField(default=0)
    today_sales = models.IntegerField(default=0)
    today_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    pending_orders = models.IntegerField(default=0)
    low_stock_products = models.IntegerField(default=0)
    
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dashboard for {self.seller.store_name}"

class Payout(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='payouts')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    
    STATUS_CHOICES = (
        ('PROCESSING', 'Processing'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PROCESSING')
    
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    payout_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payout {self.id} - {self.seller.store_name} - {self.amount}"

class SellerNotification(models.Model):
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=100)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    TYPE_CHOICES = (
        ('ORDER', 'New Order'),
        ('STOCK', 'Low Stock'),
        ('PAYOUT', 'Payout'),
        ('SYSTEM', 'System Alert'),
    )
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='SYSTEM')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
