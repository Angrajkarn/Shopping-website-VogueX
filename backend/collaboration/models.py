from django.db import models
import uuid
from users.models import User

class ShoppingSession(models.Model):
    session_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_sessions')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Session {self.session_id} - {self.created_by.email}"

class SessionMember(models.Model):
    session = models.ForeignKey(ShoppingSession, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    guest_id = models.CharField(max_length=100, null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('session', 'user', 'guest_id')
