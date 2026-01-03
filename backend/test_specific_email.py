
import os
import django
from django.core.mail import send_mail

# Setup Django standalone
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

RECIPIENT = 'karnkumarbnk@gmail.com'

try:
    print(f"Attempting to send email to {RECIPIENT}...")
    send_mail(
        subject='Fashion Advance - Admin Test',
        message='This is a test email from the backend to verify settings.',
        from_email=None, # Uses DEFAULT_FROM_EMAIL
        recipient_list=[RECIPIENT],
        fail_silently=False,
    )
    print("SUCCESS: Email sent successfully!")
except Exception as e:
    print(f"FAILURE: Could not send email.\nError: {e}")
