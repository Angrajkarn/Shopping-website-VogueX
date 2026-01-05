from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from djongo import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    gender = models.CharField(max_length=10, blank=True, null=True, choices=(('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')))
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    super_coins = models.IntegerField(default=0)
    is_plus_member = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('order', 'Order Update'),
        ('promo', 'Promotion'),
        ('system', 'System Alert'),
        ('coin', 'SuperCoin Reward'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='system')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.email}"

class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps', null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"OTP for {self.email or self.phone_number}: {self.otp_code}"

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    pincode = models.CharField(max_length=10)
    locality = models.CharField(max_length=255)
    address = models.TextField() # Area and Street
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    alternate_phone = models.CharField(max_length=15, blank=True, null=True)
    
    ADDRESS_TYPES = (('HOME', 'Home'), ('WORK', 'Work'))
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPES, default='HOME')
    
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.pincode}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"

class JobApplication(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    linkedin_profile = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    position = models.CharField(max_length=200)
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(upload_to='resumes/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application: {self.full_name} for {self.position}"

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
