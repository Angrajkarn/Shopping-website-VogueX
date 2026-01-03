from django.db import models
from django.conf import settings
import secrets
from django.utils import timezone

class GiftCard(models.Model):
    code = models.CharField(max_length=50, unique=True, editable=False)
    initial_balance = models.DecimalField(max_digits=10, decimal_places=2)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchased_gift_cards')
    
    def save(self, *args, **kwargs):
        if not self.code:
             self.code = f"GCSE-{secrets.token_hex(4).upper()}-{secrets.token_hex(4).upper()}"
        super().save(*args, **kwargs)

    def is_valid(self):
        return self.is_active and self.current_balance > 0 and (self.expiry_date is None or self.expiry_date > timezone.now())

    def __str__(self):
        return f"{self.code} - {self.current_balance}"

class GiftCardUsage(models.Model):
    gift_card = models.ForeignKey(GiftCard, on_delete=models.CASCADE, related_name='usages')
    # Using string reference to avoid circular imports if possible, or lazy loading
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='gift_card_usages')
    amount_used = models.DecimalField(max_digits=10, decimal_places=2)
    used_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.gift_card.code} used {self.amount_used} on {self.order}"
