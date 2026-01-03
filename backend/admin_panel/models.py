from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class SystemAdmin(models.Model):
    items = None
    ROLES = (
        ('SUPERADMIN', 'Super Admin'),
        ('MODERATOR', 'Moderator'),
        ('SUPPORT', 'Support'),
    )

    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLES, default='SUPERADMIN')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Security Fields
    failed_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.email} ({self.role})"

class AccessLog(models.Model):
    admin = models.ForeignKey(SystemAdmin, on_delete=models.SET_NULL, null=True, related_name='access_logs')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=(('SUCCESS', 'Success'), ('FAILURE', 'Failure')))

    def __str__(self):
        return f"{self.status} - {self.ip_address} - {self.timestamp}"
