from django.db import models
from django.conf import settings

class UserInteraction(models.Model):
    INTERACTION_TYPES = (
        ('VIEW', 'View Product'),
        ('HOVER', 'Hover Product'),
        ('SEARCH', 'Search Query'),
        ('CART_ADD', 'Add to Cart'),
        ('PURCHASE', 'Purchase'),
        ('EXIT', 'Page Exit Summary'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    session_id = models.CharField(max_length=255, null=True, blank=True, help_text="Anonymous session ID for non-logged in users")
    interaction_type = models.CharField(max_length=20, choices=INTERACTION_TYPES)
    product_id = models.CharField(max_length=255, null=True, blank=True) 
    metadata = models.JSONField(default=dict, blank=True) # e.g. search query, time spent duration
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['session_id', 'timestamp']),
            models.Index(fields=['interaction_type']),
        ]

    def __str__(self):
        actor = self.user.email if self.user else self.session_id
        return f"{actor} - {self.interaction_type} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"
