
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

print("Django setup complete.")

try:
    print("Importing RecommendationEngine...")
    from analytics.ml import RecommendationEngine
    
    print("Initializing Engine...")
    engine = RecommendationEngine()
    
    print("Fetching Popular Products...")
    product_ids = engine.get_popular_products()
    print("Products IDs:", product_ids)
    
    print("Querying Product Model...")
    from products.models import Product
    valid_ids = [int(pid) for pid in product_ids if str(pid).isdigit()]
    products = Product.objects.filter(id__in=valid_ids)
    print("Products Found:", products.count())
    for p in products:
        print(f" - {p.name} ({p.id})")
except Exception as e:
    print("ERROR CAUGHT:")
    import traceback
    traceback.print_exc()
