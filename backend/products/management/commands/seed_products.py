import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Product, ProductVariant, Inventory, ProductImage
from django.db import transaction
import time

class Command(BaseCommand):
    help = 'Seeds the database with 50,000+ products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting data seeding...')
        start_time = time.time()

        # Config
        TOTAL_PRODUCTS = 2000
        BATCH_SIZE = 1000

        # Data Pools
        BRANDS = ['Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Levis', 'Gucci', 'Calvin Klein', 'Roadster', 'Highlander', 'Peter England', 'Woodland', 'Fastrack', 'Biba', 'W', 'FabIndia', 'Allen Solly', 'Van Heusen', 'Louis Philippe', 'Raymond']
        CATEGORIES = {
            'Men': ['T-Shirts', 'Jeans', 'Shirts', 'Trousers', 'Jackets', 'Suits', 'Kurtas', 'Sneakers', 'Formal Shoes'],
            'Women': ['Dresses', 'Tops', 'Kurtas', 'Sarees', 'Jeans', 'Skirts', 'Heels', 'Flats', 'Handbags'],
            'Kids': ['T-Shirts', 'Shorts', 'Dresses', 'Jeans', 'Toys', 'School Bags'],
            'Electronics': ['Mobiles', 'Headphones', 'Smartwatches', 'Laptops', 'Speakers', 'Cameras'],
            'Beauty': ['Makeup', 'Skincare', 'Fragrance', 'Haircare'],
            'Home': ['Decor', 'Bedding', 'Kitchen', 'Furniture']
        }
        ADJECTIVES = ['Premium', 'Classic', 'Urban', 'Modern', 'Stylish', 'Elegant', 'Casual', 'Formal', 'Sporty', 'Comfortable', 'Luxury', 'Essential', 'Trendy', 'Vintage', 'Cotton', 'Silk', 'Leather', 'Denim', 'Wool']
        
        IMAGES = {
            'Men': [
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
                "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
                "https://images.unsplash.com/photo-1617137968427-85924c809a29?w=500&q=80",
                "https://images.unsplash.com/photo-1593030761757-71bd90dbe3e4?w=500&q=80"
            ],
            'Women': [
                "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=500&q=80",
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
                "https://images.unsplash.com/photo-1529139574466-a302d2052505?w=500&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80"
            ],
            'Kids': [
                "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&q=80",
                "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80",
                "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&q=80"
            ],
            'Electronics': [
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
                "https://images.unsplash.com/photo-1526857240824-92be52581d9b?w=500&q=80",
                "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
            ],
            'Generic': [
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
            ]
        }

        # Clear existing data to ensure we see the new rich descriptions
        self.stdout.write('Clearing existing data...')
        Product.objects.all().delete()
        
        products_to_create = []
        
        self.stdout.write('Generating product objects...')
        
        # We will create products in memory first
        for i in range(TOTAL_PRODUCTS):
            main_cat = random.choice(list(CATEGORIES.keys()))
            sub_cat = random.choice(CATEGORIES[main_cat])
            adj = random.choice(ADJECTIVES)
            brand = random.choice(BRANDS)
            
            name = f"{brand} {adj} {sub_cat} {random.randint(100, 999)}"
            # Ensure unique slug by appending random string or ID
            slug = slugify(f"{name}-{random.randint(100000, 999999)}")
            
            # Simulated category JSON
            category_json = {
                "level1": main_cat,
                "level2": sub_cat,
                "level3": "General"
            }
            
            # Attributes
            attributes_json = {
                "material": random.choice(["Cotton", "Polyester", "Leather", "Metal", "Plastic"]),
                "warranty": f"{random.choice([1, 2, 3])} Year",
                "origin": "India"
            }

            # Rich Description Generation
            features = [
                "Premium quality material for long-lasting durability.",
                "Designed for maximum comfort and style.",
                "Perfect for both casual and formal occasions.",
                "Easy to clean and maintain.",
                "Available in multiple sizes and colors."
            ]
            selected_features = random.sample(features, 3)
            
            description_long = f"""Experience the epitome of style and comfort with the {name}. 
            
Designed by {brand}, this {sub_cat} features a modern aesthetic that perfectly blends functionality with fashion. Whether you're heading to work or a weekend getaway, this is your perfect companion.

Key Features:
• {selected_features[0]}
• {selected_features[1]}
• {selected_features[2]}

Specifications:
• Brand: {brand}
• Material: {attributes_json['material']}
• Warranty: {attributes_json['warranty']}
• Origin: {attributes_json['origin']}

Care Instructions:
• Machine wash cold, gentle cycle.
• Do not bleach.
• Tumble dry low.

Upgrade your collection today with this premium offering from {brand}."""

            product = Product(
                name=name,
                slug=slug,
                brand=brand,
                category=category_json,
                description_short=f"High quality {name} for your daily needs.",
                description_long=description_long,
                attributes=attributes_json,
                rating_average=round(random.uniform(3.5, 5.0), 1),
                rating_count=random.randint(10, 5000),
                status='ACTIVE'
            )
            products_to_create.append(product)
            
            # Batch Insert Products
            if len(products_to_create) >= BATCH_SIZE:
                self.save_batch(products_to_create, i, main_cat, start_time)
                products_to_create = [] # Reset

        # Save remaining
        if products_to_create:
            self.save_batch(products_to_create, TOTAL_PRODUCTS, "Mixed", start_time)

        total_time = time.time() - start_time
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {TOTAL_PRODUCTS} products in {total_time:.2f} seconds!'))

    def save_batch(self, products_list, current_count, category_hint, start_time):
        # 1. Bulk Create Products
        created_products = Product.objects.bulk_create(products_list)
        
        # 2. Prepare Variants and Images
        variants_to_create = []
        images_to_create = []
        
        for product in created_products:
            # Determine image category
            cat_level1 = product.category.get('level1', 'Generic')
            img_pool = {
                'Men': [
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
                    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80",
                    "https://images.unsplash.com/photo-1617137968427-85924c809a29?w=500&q=80",
                    "https://images.unsplash.com/photo-1593030761757-71bd90dbe3e4?w=500&q=80"
                ],
                'Women': [
                    "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=500&q=80",
                    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80",
                    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
                    "https://images.unsplash.com/photo-1529139574466-a302d2052505?w=500&q=80",
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80"
                ],
                'Kids': [
                    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500&q=80",
                    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80",
                    "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=500&q=80"
                ],
                'Electronics': [
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
                    "https://images.unsplash.com/photo-1526857240824-92be52581d9b?w=500&q=80",
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
                ],
                'Beauty': [
                    "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=500&q=80",
                    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80"
                ],
                'Home': [
                    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80",
                    "https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=500&q=80"
                ]
            }.get(cat_level1, [ "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"])
            
            img_url = random.choice(img_pool)
            
            # Create Image object
            images_to_create.append(ProductImage(
                product=product,
                image_type='MAIN',
                url=img_url,
                display_order=0
            ))

            # Create 1-3 Variants
            base_price = random.randint(499, 15999)
            num_variants = random.randint(1, 3)
            
            for v in range(num_variants):
                sku = f"{product.slug}-{v+1}"
                selling_price = base_price + (v * 100)
                mrp = int(selling_price * random.uniform(1.2, 1.8))
                
                variant = ProductVariant(
                    product=product,
                    sku=sku,
                    attributes={"size": random.choice(["S", "M", "L", "XL"]), "color": random.choice(["Red", "Blue", "Black"])},
                    price_mrp=mrp,
                    price_selling=selling_price,
                    currency='INR',
                    is_active=True
                )
                variants_to_create.append(variant)

        # 3. Bulk Create Images
        ProductImage.objects.bulk_create(images_to_create)
        
        # 4. Bulk Create Variants
        created_variants = ProductVariant.objects.bulk_create(variants_to_create)
        
        # 5. Prepare Inventory
        inventory_to_create = []
        for variant in created_variants:
            stock = random.randint(0, 200) # Some out of stock
            status = 'IN_STOCK' if stock > 0 else 'OUT_OF_STOCK'
            
            inventory_to_create.append(Inventory(
                variant=variant,
                total_stock=stock,
                available_stock=stock,
                reserved_stock=0,
                low_stock_threshold=5,
                stock_status=status
            ))
            
        # 6. Bulk Create Inventory
        Inventory.objects.bulk_create(inventory_to_create)
        
        # Progress Log
        elapsed = time.time() - start_time
        self.stdout.write(f"Processed {current_count} products... ({elapsed:.1f}s)")
