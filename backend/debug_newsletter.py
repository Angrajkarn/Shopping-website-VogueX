import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from users.models import NewsletterSubscriber

print("Attempting to get or create subscriber...")
try:
    obj, created = NewsletterSubscriber.objects.get_or_create(email="debug_script@example.com")
    print(f"Success! Created: {created}, Obj: {obj}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
