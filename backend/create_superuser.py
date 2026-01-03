import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = 'admin@example.com'
password = 'admin'

if not User.objects.filter(email=email).exists():
    User.objects.create_superuser(email=email, password=password, first_name='Super', last_name='Admin')
    print(f"Superuser '{email}' created with password '{password}'")
else:
    print(f"Superuser '{email}' already exists")
