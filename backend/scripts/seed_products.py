import os
import sys
import django
import random
from decimal import Decimal

# Setup Django Environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from products.models import Product, ProductImage, ProductVariant, Inventory, PricingRule

def create_products():
    print("Starting Product Seeding...")
    
    # 1. Create or Get Seller
    seller, created = User.objects.get_or_create(
        email="seller@fashionadvance.com",
        defaults={
            'first_name': 'Fashion',
            'last_name': 'Advance',
            'is_staff': True,
            'is_active': True,
            'is_seller': True
        }
    )
    if created:
        seller.set_password("seller123")
        seller.save()
        print("Created Seller User")

    # Real-World Data (Simulated Scraping)
    products_data = [
        # --- MOBILES (Matches 'Mobiles' Nav) ---
        {
            "name": "Apple iPhone 16 Pro Max",
            "category": {"level1": "Mobiles", "level2": "Smartphones"},
            "price": 159900,
            "images": [
                "https://images.unsplash.com/photo-1696446701796-da6122569ed9?q=80&w=1000&auto=format&fit=crop", # iPhone 15/16 lookalike
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Experience the ultimate in smartphone technology with the iPhone 16 Pro Max. Featuring the A18 Pro chip, a stunning titanium design, and our most advanced camera system yet.",
            "brand": "Apple"
        },
        {
            "name": "Samsung Galaxy Z Fold 6",
            "category": {"level1": "Mobiles", "level2": "Foldables"},
            "price": 164999,
            "images": [
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop", # Foldable generic
                "https://images.unsplash.com/photo-1611096006073-7c82b32f4c0c?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Unfold your world with the Samsung Galaxy Z Fold 6. A massive 7.6-inch display, multitasking powerhouse, and durability that defies expectations.",
            "brand": "Samsung"
        },

        # --- ELECTRONICS (Matches 'Electronics' Nav) ---
        {
            "name": "Sony WH-1000XM5 Wireless Headphones",
            "category": {"level1": "Electronics", "level2": "Audio"},
            "price": 29990,
            "images": [
                "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Industry-leading noise cancellation, exceptional sound quality, and crystal-clear calls. The Sony WH-1000XM5 redefines your listening experience.",
            "brand": "Sony"
        },
        {
            "name": "MacBook Air M3",
            "category": {"level1": "Electronics", "level2": "Laptops"},
            "price": 114900,
            "images": [
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Supercharged by the M3 chip. The world's most popular laptop is faster and more capable than ever.",
            "brand": "Apple"
        },
        
        # --- MEN ---
        {
            "name": "Premium Linen Shirt - Beige",
            "category": {"level1": "Men", "level2": "Topwear"},
            "price": 2499,
            "images": [
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Stay cool and stylish this summer with our 100% organic linen shirt. Features a relaxed fit and breathable fabric.",
            "brand": "Zara"
        },
        {
            "name": "Relaxed Fit Cargo Pants",
            "category": {"level1": "Men", "level2": "Bottomwear"},
            "price": 3299,
            "images": [
                "https://images.unsplash.com/photo-1517445312882-b41fa2143899?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Utility meets style. These relaxed-fit cargo pants feature multiple pockets and durable cotton fabric for everyday wear.",
            "brand": "H&M",
            "attributes": {"style": "Urban", "fit": "Relaxed"}
        },
        {
            "name": "Nike Air Jordan 1 High",
            "category": {"level1": "Men", "level2": "Footwear"},
            "price": 16995,
            "images": [
                "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "The sneaker that started it all. The Air Jordan 1 delivers heritage style with premium materials and comfortable cushioning.",
            "brand": "Nike"
        },
        {
            "name": "Luxury Chronograph Watch",
            "category": {"level1": "Accessories", "level2": "Watches"},
            "price": 18500,
            "images": [
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Premium chronograph watch with stainless steel strap and sapphire crystal glass.",
            "brand": "Fossil"
        },
        
        # --- ACCESSORIES ---
         {
            "name": "Classic Aviator Sunglasses",
            "category": {"level1": "Accessories", "level2": "Eyewear"},
            "price": 5500,
            "images": [
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop",
                 "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Timeless style. These aviator sunglasses feature polarized lenses and a durable metal frame.",
            "brand": "Ray-Ban",
            "attributes": {"style": "Minimalist", "gender": "Unisex"}
        },

        # --- WOMEN ---
        {
            "name": "Floral Maxi Summer Dress",
            "category": {"level1": "Women", "level2": "Dresses"},
            "price": 4500,
            "images": [
                "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Embrace the season with this stunning floral maxi dress. Perfect for beach days or garden parties.",
            "brand": "Mango",
            "attributes": {"style": "Bohemian", "season": "Summer"}
        },
        {
            "name": "High-Waist Yoga Leggings",
            "category": {"level1": "Women", "level2": "Activewear"},
            "price": 2200,
            "images": [
                "https://images.unsplash.com/photo-1506619216599-9d524738e328?q=80&w=1000&auto=format&fit=crop", 
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Buttery soft and squat-proof. These high-waisted leggings are designed for maximum comfort and performance.",
            "brand": "Lululemon"
        },
        {
            "name": "Luxury Leather Handbag",
            "category": {"level1": "Women", "level2": "Bags"},
            "price": 12500,
            "images": [
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Crafted from premium Italian leather, this handbag is the perfect blend of elegance and functionality.",
            "brand": "Gucci",
            "attributes": {"style": "Luxury", "material": "Leather"}
        },
        # --- OCCASION: PARTY WEAR ---
        {
            "name": "Sequin Evening Gown",
            "category": {"level1": "Women", "level2": "Party Wear"},
            "price": 8999,
            "images": [
                "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Shine like a star in this floor-length sequin evening gown. Perfect for galas and parties.",
            "brand": "Zara",
            "attributes": {"style": "Party", "material": "Sequin"}
        },
        # --- OCCASION: OFFICE CHIC ---
        {
            "name": "Slim Fit Navy Blazer",
            "category": {"level1": "Men", "level2": "Formal Wear"},
            "price": 5999,
            "images": [
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Sharp, sophisticated, and comfortable. This slim-fit blazer is essential for the modern professional.",
            "brand": "Raymond"
        },
        # --- OCCASION: VACATION VIBES ---
        {
            "name": "Tropical Print Summer Shirt",
            "category": {"level1": "Men", "level2": "Vacation"},
            "price": 1499,
            "images": [
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Get ready for the beach with this vibrant tropical print shirt. Lightweight and breathable.",
            "brand": "H&M"
        },
        # --- OCCASION: PARTY WEAR ---
        {
            "name": "Sequin Evening Gown",
            "category": {"level1": "Women", "level2": "Party Wear"},
            "price": 8999,
            "images": [
                "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Shine like a star in this floor-length sequin evening gown. Perfect for galas and parties.",
            "brand": "Zara"
        },
        # --- OCCASION: OFFICE CHIC ---
        {
            "name": "Slim Fit Navy Blazer",
            "category": {"level1": "Men", "level2": "Formal Wear"},
            "price": 5999,
            "images": [
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Sharp, sophisticated, and comfortable. This slim-fit blazer is essential for the modern professional.",
            "brand": "Raymond"
        },
        # --- OCCASION: VACATION VIBES ---
        {
            "name": "Tropical Print Summer Shirt",
            "category": {"level1": "Men", "level2": "Vacation"},
            "price": 1499,
            "images": [
                "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Get ready for the beach with this vibrant tropical print shirt. Lightweight and breathable.",
            "brand": "H&M"
        },

        # --- HOME & FURNITURE (Matches 'Home & Furniture' Nav) ---
        {
            "name": "Modern Ceramic Vase Set",
            "category": {"level1": "Home & Furniture", "level2": "Decor"},
            "price": 1800,
            "images": [
                "https://images.unsplash.com/photo-1581783342308-f792ca86d5da?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Minimalist ceramic vases to elevate your home decor. Perfect for fresh or dried flowers.",
            "brand": "West Elm"
        },
        {
            "name": "Solid Wood Queen Bed",
            "category": {"level1": "Home & Furniture", "level2": "Furniture"},
            "price": 45000,
            "images": [
                 "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=1000&auto=format&fit=crop",
                 "https://images.unsplash.com/photo-1616594039964-40891a9046c9?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Elegant solid wood queen size bed with a contemporary design. Durable and stylish.",
            "brand": "Urban Ladder"
        },

        # --- APPLIANCES (Matches 'Appliances' Nav) ---
        {
            "name": "Smart Air Fryer XL",
            "category": {"level1": "Appliances", "level2": "Kitchen"},
            "price": 8999,
            "images": [
                "https://images.unsplash.com/photo-1626161869896-e2a2ba7b2c93?q=80&w=1000&auto=format&fit=crop", 
                "https://images.unsplash.com/photo-1595568164391-764955badd48?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Cook healthier meals with 90% less oil. Digital touchscreen, 8 presets, and large capacity.",
            "brand": "Philips"
        },
        {
            "name": "LG 360L Double Door Refrigerator",
            "category": {"level1": "Appliances", "level2": "Large Appliances"},
            "price": 38990,
            "images": [
                "https://images.unsplash.com/photo-1571175443880-49e1d58b794a?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Smart Inverter Compressor, Frost Free, and Convertible modes. Energy efficient and spacious.",
            "brand": "LG"
        },
        {
            "name": "Dyson V15 Detect Vacuum",
            "category": {"level1": "Appliances", "level2": "Home Appliances"},
            "price": 65900,
            "images": [
                "https://images.unsplash.com/photo-1558317374-a354d5f3d463?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "The most powerful, intelligent cordless vacuum. Laser reveals microscopic dust.",
            "brand": "Dyson"
        },

        # --- TRAVEL (Matches 'Travel' Nav) ---
        {
            "name": "American Tourister Ivy Spinner",
            "category": {"level1": "Travel", "level2": "Luggage"},
            "price": 7999,
            "images": [
                "https://images.unsplash.com/photo-1565514020176-87d2963b7829?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1581561059902-6902264b3879?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Durable polycarbonate hard-shell suitcase with 360-degree spinner wheels. Perfect for international travel.",
            "brand": "American Tourister"
        }, 
        {
             "name": "Travel Neck Pillow Memory Foam",
             "category": {"level1": "Travel", "level2": "Accessories"},
             "price": 1499,
             "images": [
                 "https://images.unsplash.com/photo-1520939817992-d667169f4b1d?q=80&w=1000&auto=format&fit=crop",
                 "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=1000&auto=format&fit=crop"
             ],
             "description": "Ergonomic memory foam neck pillow for comfortable long-haul flights.",
             "brand": "TravelBlue"
        },

        # --- BEAUTY, TOYS & MORE (Matches exact Name) ---
        {
            "name": "L'Oreal Paris Revitalift Serum",
            "category": {"level1": "Beauty, Toys & More", "level2": "Beauty"},
            "price": 899,
            "images": [
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Hydrating Hyaluronic Acid Serum for plump, youthful skin. #1 Dermatologist recommended.",
            "brand": "L'Oreal"
        },
        {
            "name": "LEGO Ferrari Daytona SP3",
            "category": {"level1": "Beauty, Toys & More", "level2": "Toys"},
            "price": 39999,
            "images": [
                "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1581557991964-125469da3b8a?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "Build your own supercar with this Technic ultimate car concept. 3,778 pieces of pure engineering.",
            "brand": "LEGO"
        },
        
        # --- TWO WHEELERS (Matches 'Two Wheelers' Nav) ---
        {
            "name": "Ola S1 Pro Electric Scooter",
            "category": {"level1": "Two Wheelers", "level2": "Electric Scooters"},
            "price": 139999,
            "images": [
                "https://images.unsplash.com/photo-1678720175855-321111663f73?q=80&w=1000&auto=format&fit=crop", # Generic Electric Scooter
                "https://images.unsplash.com/photo-1626847037657-fd3622613551?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "The future of mobility. 195km range, 120kmph top speed, and MoveOS 4 smart features. (Booking Amount Only)",
            "brand": "Ola Electric"
        },
        {
            "name": "Studds Ninja Elite Helmet",
            "category": {"level1": "Two Wheelers", "level2": "Accessories"},
            "price": 1850,
            "images": [
                "https://images.unsplash.com/photo-1558293950-8b1b22295ce1?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1627443916964-706d8848d5d1?q=80&w=1000&auto=format&fit=crop"
            ],
            "description": "DOT certified full-face helmet with hypoallergenic liner and quick-release visor.",
            "brand": "Studds"
        },
    ]

    for p_data in products_data:
        # Check if exists -> Update Category
        if Product.objects.filter(name=p_data['name']).exists():
            print(f"Updating {p_data['name']}...")
            product = Product.objects.get(name=p_data['name'])
            product.category = p_data['category'] # FORCE UPDATE CATEGORY
            product.save()
            continue

        # Create Product
        product = Product.objects.create(
            seller=seller,
            name=p_data['name'],
            slug=p_data['name'].lower().replace(" ", "-"),
            brand=p_data['brand'],
            category=p_data['category'],
            description_short=p_data['description'][:100] + "...",
            description_long=p_data['description'],
            attributes=p_data.get('attributes', {}),  # Support style/attributes
            rating_average=random.uniform(4.2, 5.0),
            rating_count=random.randint(50, 5000),
            status='ACTIVE'
        )

        # Create Images
        for idx, img_url in enumerate(p_data['images']):
            ProductImage.objects.create(
                product=product,
                image_type='MAIN' if idx == 0 else 'GALLERY',
                url=img_url,
                display_order=idx
            )

        # Create Variant (Default)
        variant = ProductVariant.objects.create(
            product=product,
            sku=f"SKU-{product.slug[:5].upper()}-{random.randint(1000, 9999)}",
            price_mrp=Decimal(p_data['price']) * Decimal(1.2), # 20% higher MRP
            price_selling=Decimal(p_data['price']),
            currency='INR'
        )

        # Inventory
        Inventory.objects.create(
            variant=variant,
            total_stock=100,
            available_stock=random.randint(5, 95),
            stock_status='IN_STOCK'
        )
        
        print(f"Created: {product.name}")

    print("Seeding Complete!")

if __name__ == '__main__':
    create_products()
