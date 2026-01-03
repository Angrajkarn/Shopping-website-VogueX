from django.core.management.base import BaseCommand
from products.models import Product
from products.serializers import ProductSerializer

class Command(BaseCommand):
    help = 'Debug serialization'

    def handle(self, *args, **options):
        try:
            p = Product.objects.get(id=1)
            self.stdout.write(f"Found {p.name}")
            s = ProductSerializer(p)
            self.stdout.write(str(s.data))
            self.stdout.write("Success")
        except Product.DoesNotExist:
             self.stdout.write("Product 1 not found")
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {e}"))
            import traceback
            traceback.print_exc()
