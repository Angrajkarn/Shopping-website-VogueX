import random
import uuid
import time
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.db import transaction
from products.models import Product, ProductImage, ProductVariant, Inventory
from users.models import User

class Command(BaseCommand):
    help = 'Seed the database with 50,000 additional products across diverse categories'

    def add_arguments(self, parser):
        parser.add_argument('--total', type=int, default=50000, help='Number of products to add')

    def handle(self, *args, **kwargs):
        total_goal = kwargs['total']
        self.stdout.write(f"Starting Seeding Process for {total_goal} ADDITIONAL products...")
        start_time = time.time()

        # 1. Ensure Seller Exists
        seller = User.objects.filter(is_seller=True).first() or \
                 User.objects.filter(is_staff=True).first() or \
                 User.objects.first()
        
        if not seller:
            seller = User.objects.create_superuser(
                email="admin@voguex.com",
                password="securepassword",
                first_name="Admin",
                last_name="Seller"
            )
            self.stdout.write(f"Created default seller: {seller.email}")

        categories = [
            {"level1": "Men", "level2": "Clothing", "level3": "Formal Shirts"},
            {"level1": "Men", "level2": "Clothing", "level3": "Denim Jeans"},
            {"level1": "Men", "level2": "Footwear", "level3": "Sport Shoes"},
            {"level1": "Women", "level2": "Clothing", "level3": "Party Dresses"},
            {"level1": "Women", "level2": "Clothing", "level3": "Designer Sarees"},
            {"level1": "Women", "level2": "Accessories", "level3": "Handbags"},
            {"level1": "Electronics", "level2": "Mobiles", "level3": "Flagship Phones"},
            {"level1": "Electronics", "level2": "Laptops", "level3": "Gaming Laptops"},
            {"level1": "Electronics", "level2": "Audio", "level3": "Wireless Headphones"},
            {"level1": "Home & Living", "level2": "Kitchen", "level3": "Coffee Makers"},
            {"level1": "Home & Living", "level2": "Decor", "level3": "Antique Vases"},
            {"level1": "Beauty", "level2": "Fragrances", "level3": "Luxury Perfumes"},
            {"level1": "Kids", "level2": "Toys", "level3": "Educational Blocks"},
            {"level1": "Kids", "level2": "Clothing", "level3": "Infant Rompers"},
            {"level1": "Kids", "level2": "Baby Care", "level3": "Organic Lotions"},
            {"level1": "Sports", "level2": "Fitness", "level3": "Yoga Mats"},
            {"level1": "Sports", "level2": "Camping", "level3": "Outdoor Tents"},
            {"level1": "Sports", "level2": "Sportswear", "level3": "Compression Tees"},
            {"level1": "Automotive", "level2": "Accessories", "level3": "Dashboard Cameras"},
            {"level1": "Automotive", "level2": "Tools", "level3": "Portable Tire Inflators"},
            {"level1": "Books", "level2": "Fiction", "level3": "Bestselling Novels"},
            {"level1": "Books", "level2": "Self-Help", "level3": "Mindfulness Guides"},
            {"level1": "Grocery", "level2": "Snacks", "level3": "Artisanal Chocolates"},
            {"level1": "Grocery", "level2": "Beverages", "level3": "Cold Brew Coffee"},
            {"level1": "Jewelry", "level2": "Watches", "level3": "Chronograph Watches"},
            {"level1": "Jewelry", "level2": "Necklaces", "level3": "Diamond Pendants"},
            {"name": "Furniture", "level1": "Furniture", "level2": "Bedroom", "level3": "Memory Foam Mattresses"},
            {"name": "Furniture", "level1": "Furniture", "level2": "Office", "level3": "Ergonomic Chairs"},
            {"level1": "Pets", "level2": "Dog Food", "level3": "Premium Kibble"},
            {"level1": "Pets", "level2": "Accessories", "level3": "Smart Pet Collars"},
        ]

        brands = ["VogueX", "Nike", "Adidas", "Apple", "Samsung", "ZARA", "H&M", "Levi's", "Sony", "LG", "Dell", "HP", "Ray-Ban", "Gucci", "Prada", "Tesla", "BMW", "Lego", "Nestle", "Rolex", "Logitech", "Herman Miller"]
        
        adjectives = ["Premium", "Classic", "Elegant", "Ultra", "Dynamic", "Minimalist", "Modern", "Vintage", "Limited Edition", "Signature", "Eco-Friendly", "Smart", "Ergonomic", "Handcrafted", "Futuristic"]
        product_names = ["Masterpiece", "Essentials", "Series X", "Horizon", "Infinity", "Elegance", "Turbo", "Vantage", "Pulse", "Zenith", "Prime", "Elite", "Pro", "Core", "Fusion"]

        images_pool = [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
            "https://images.unsplash.com/photo-1560343090-f0409e92791a",
            "https://images.unsplash.com/photo-1503602642458-232111445657",
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
            "https://images.unsplash.com/photo-1481349518771-20055b2a7b24",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
            "https://images.unsplash.com/photo-1546433178-62ff60737f9b",
            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        ]

        batch_size = 500
        total_created = 0

        while total_created < total_goal:
            current_batch_count = min(batch_size, total_goal - total_created)
            products_to_create = []
            
            for i in range(current_batch_count):
                cat = random.choice(categories)
                brand = random.choice(brands)
                adj = random.choice(adjectives)
                name_seed = random.choice(product_names)
                
                # Using timestamp and UUID to ensure unique slugs even on multi-run
                timestamp = int(time.time())
                name = f"{brand} {adj} {cat['level3']} {name_seed} #{total_created + i + 1}"
                slug = f"{slugify(name)}-{str(uuid.uuid4())[:12]}"
                
                p = Product(
                    seller=seller,
                    name=name,
                    slug=slug,
                    brand=brand,
                    category=cat,
                    description_short=f"Premium {name} engineered for the {cat['level1']} niche.",
                    description_long=f"Experience the future with {name}. This product represents VogueX's commitment to quality in the {cat['level2']} segment, blending {adj} aesthetics with unparalleled performance for {cat['level3']}.",
                    attributes={"material": "Aerospace Grade", "tech": "AI-Powered", "warranty": "Global Lifetime"},
                    rating_average=round(random.uniform(4.0, 5.0), 1),
                    rating_count=random.randint(50, 10000),
                    status='ACTIVE'
                )
                products_to_create.append(p)

            created_products = Product.objects.bulk_create(products_to_create)
            
            variants_to_create = []
            images_to_create = []
            
            for p in created_products:
                sku = f"VX-EXT-{str(uuid.uuid4())[:14].upper()}"
                mrp = random.randint(100, 5000)
                selling_price = mrp * round(random.uniform(0.6, 0.9), 2)
                
                v = ProductVariant(
                    product=p,
                    sku=sku,
                    attributes={"edition": "Standard", "region": "Global"},
                    price_mrp=mrp,
                    price_selling=selling_price,
                    currency='USD',
                    is_active=True
                )
                variants_to_create.append(v)
                
                img = ProductImage(
                    product=p,
                    image_type='MAIN',
                    url=random.choice(images_pool),
                    display_order=0
                )
                images_to_create.append(img)

            created_variants = ProductVariant.objects.bulk_create(variants_to_create)
            ProductImage.objects.bulk_create(images_to_create)

            inventory_to_create = []
            for v in created_variants:
                stock = random.randint(10, 5000)
                inv = Inventory(
                    variant=v,
                    total_stock=stock,
                    available_stock=stock,
                    stock_status='IN_STOCK'
                )
                inventory_to_create.append(inv)
                
            Inventory.objects.bulk_create(inventory_to_create)

            total_created += current_batch_count
            self.stdout.write(f"Injected {total_created}/{total_goal} new products...")

        end_time = time.time()
        self.stdout.write(self.style.SUCCESS(f"Successfully injected {total_goal} additional products in {round(end_time - start_time, 2)} seconds! Total catalog is now approaching 100k+."))
