from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed initial users'

    def handle(self, *args, **options):
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser('admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Created admin: admin@example.com / admin123'))
        
        if not User.objects.filter(email='demo@example.com').exists():
            User.objects.create_user('demo@example.com', 'demo123', first_name='Demo', last_name='User')
            self.stdout.write(self.style.SUCCESS('Created demo user: demo@example.com / demo123'))
        else:
            self.stdout.write(self.style.SUCCESS('Users already exist'))
