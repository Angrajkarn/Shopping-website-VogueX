from rest_framework import generics, filters, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, ProductVariant, Wishlist, Review
from .serializers import ProductSerializer, WishlistSerializer, ReviewSerializer, CategorySerializer
from django.db.models import Q
from django.utils.text import slugify
import uuid
from .utils_scraper import ScraperService
from .models import Product, ProductVariant, Wishlist, Review, ProductImage
import traceback

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description_short', 'brand']
    ordering_fields = ['rating_average', 'created_at', 'price_selling']

    def get_queryset(self):
        queryset = Product.objects.filter(status='ACTIVE')
        
        # Filter by Category (Smarter mapping for Frontend Slugs)
        category = self.request.query_params.get('category')
        if category:
            category = category.lower()
            if category in ['men', 'mens-shirts', 'men-clothing']:
                queryset = queryset.filter(category__level1__iexact='Men')
            elif category in ['women', 'womens-dresses', 'women-clothing']:
                queryset = queryset.filter(category__level1__iexact='Women')
            elif category in ['accessories', 'sunglasses', 'handbags']:
                queryset = queryset.filter(
                    Q(category__level1__iexact='Accessories') |
                    Q(category__level2__iexact='Accessories') |
                    Q(category__level3__icontains='Handbags') |
                    Q(category__level1__iexact='Jewelry')
                )
            else:
                # Generic fallback: check all levels
                queryset = queryset.filter(
                    Q(category__level1__iexact=category) |
                    Q(category__level2__iexact=category) |
                    Q(category__level3__iexact=category) |
                    Q(category__level3__icontains=category.replace('-', ' '))
                )
            
        # Filter by SubCategory (Level 2) -> Jeans, Mobiles
        subcategory = self.request.query_params.get('subcategory')
        if subcategory:
            queryset = queryset.filter(category__level2__iexact=subcategory)

        # Filter by Brand
        brand = self.request.query_params.get('brand')
        if brand:
            brands = brand.split(',')
            queryset = queryset.filter(brand__in=brands)

        # Filter by Rating
        rating = self.request.query_params.get('rating')
        if rating:
            queryset = queryset.filter(rating_average__gte=float(rating))

        # Filter by Size
        # Note: Size is stored in Variant attributes JSON.
        # We search if ANY variant has this size.
        size = self.request.query_params.get('size')
        if size:
            sizes = size.split(',')
            # Django JSONField lookup for list of values is tricky, so we use refined check:
            # We want products where variants__attributes__size is in our list.
            # Simple approach: Attributes is a dict {"size": "M"}.
            q_objs = Q()
            for s in sizes:
                q_objs |= Q(variants__attributes__size__iexact=s)
            queryset = queryset.filter(q_objs).distinct()
            
        # Filter by Price Range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price and max_price:
            # Filter products that have at least one variant in range
            queryset = queryset.filter(
                variants__price_selling__gte=min_price,
                variants__price_selling__lte=max_price
            ).distinct()
        
        return queryset.order_by('-created_at')

class FilterOptionsView(APIView):
    """
    Returns available filter options (brands, sizes, max_price) based on current category context.
    """
    def get(self, request):
        category = request.query_params.get('category')
        subcategory = request.query_params.get('subcategory')
        
        queryset = Product.objects.filter(status='ACTIVE')
        if category:
            queryset = queryset.filter(category__level1__iexact=category)
        if subcategory:
            queryset = queryset.filter(category__level2__iexact=subcategory)
            
        # 1. Distinct Brands
        brands = queryset.values_list('brand', flat=True).distinct().order_by('brand')
        
        # 2. Distinct Sizes (from variants)
        # This is a bit heavy if many variants, but workable for moderate datasets.
        # We'll extract all 'size' values from variants of these products.
        variants = ProductVariant.objects.filter(product__in=queryset)
        sizes = set()
        for v in variants:
            if v.attributes and 'size' in v.attributes:
                sizes.add(v.attributes['size'])
        
        # Sort sizes logically if possible, else alphabetical
        sorted_sizes = sorted(list(sizes))
        
        # 3. Price Range (Min/Max)
        # Using Python aggregation briefly or DB aggregation
        # DB is better
        from django.db.models import Min, Max
        price_stats = variants.aggregate(min_price=Min('price_selling'), max_price=Max('price_selling'))
        
        return Response({
            'brands': [b for b in brands if b], # Filter None
            'sizes': [s for s in sorted_sizes if s],
            'min_price': price_stats['min_price'] or 0,
            'max_price': price_stats['max_price'] or 100000
        })

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id' # Can switch to 'slug' if needed, but ID is safer for now.

class ProductBySlugView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'

class CategoryListView(APIView):
    def get(self, request):
        # Return unique categories from products
        # A simple list of strings for now
        categories = Product.objects.values_list('category__level2', flat=True).distinct()
        data = [{'name': c, 'slug': c.lower().replace(' ', '-')} for c in categories if c]
        return Response(data)

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        product_id = self.request.data.get('product_id')
        if not Wishlist.objects.filter(user=self.request.user, product_id=product_id).exists():
            serializer.save(user=self.request.user)

class WishlistDetailView(generics.DestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'product_id'
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
    
    def delete(self, request, *args, **kwargs):
        product_id = kwargs.get('product_id')
        try:
            item = Wishlist.objects.get(user=request.user, product_id=product_id)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs.get('id')
        return Review.objects.filter(product_id=product_id).order_by('-created_at')

    def perform_create(self, serializer):
        try:
            product_id = self.kwargs.get('id')
            print(f"DEBUG: Reviewing Product ID: {product_id}")
            product = Product.objects.get(id=product_id)
            serializer.save(user=self.request.user, product=product)
            
            # Update Product Aggregate Rating
            reviews = Review.objects.filter(product=product)
            count = reviews.count()
            avg = sum([r.rating for r in reviews]) / count if count > 0 else 0
            
            product.rating_count = count
            product.rating_average = round(avg, 1)
            product.save()
        except Product.DoesNotExist:
            print(f"DEBUG: Product {product_id} not found. Attempting to auto-heal from Order Items...")
            from orders.models import OrderItem
            from django.utils.text import slugify
            import uuid

            # Use product_id (from URL) which corresponds to OrderItem.product_id
            order_item = OrderItem.objects.filter(product_id=product_id).first()
            
            if order_item:
                print(f"DEBUG: Found OrderItem: {order_item.product_name}. Creating Product...")
                product = Product.objects.create(
                    id=product_id,
                    name=order_item.product_name,
                    slug=slugify(order_item.product_name) + '-' + str(uuid.uuid4())[:8],
                    brand="Generic",
                    category={"level1": "Uncategorized"},
                    description_short="Auto-generated from Order History",
                    description_long="This product was auto-created because it was missing from the catalog but present in an order.",
                    status='ACTIVE',
                    # Link image if possible? We need ProductImage model. 
                    # For now just create the core Product so Review can link.
                )
                # Retry saving review
                serializer.save(user=self.request.user, product=product)

                # Initialize stats
                product.rating_count = 1
                product.rating_average = float(serializer.validated_data.get('rating', 0))
                product.save()
                return # Done
            else:
                # Truly not found
                print(f"ERROR: Product {product_id} not found and no OrderItem trace.")
                raise serializers.ValidationError({"detail": f"Product with ID {product_id} not found."})

        except Exception as e:
            print(f"ERROR in Review: {str(e)}")
            traceback.print_exc()
            raise serializers.ValidationError({"detail": str(e)})

class ProductScraperView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)

        service = ScraperService()
        data = service.scrape_product(url)

        if 'error' in data:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        # Scrape Success! Now AUTO-SAVE to DB
        try:
            # 1. Check if exists by name (mock check)
            existing = Product.objects.filter(name__iexact=data['title']).first()
            if existing:
                serializer = ProductSerializer(existing)
                return Response(serializer.data)

            # 2. Create Product
            product = Product.objects.create(
                name=data['title'],
                slug=slugify(data['title'])[:200] + '-' + str(uuid.uuid4())[:8],
                brand="Imported",
                category={"level1": "Uncategorized"},
                description_short=data['description'][:499] if data['description'] else "No description",
                description_long=data['description'] or "Imported from external source.",
                status='ACTIVE'
            )

            # 3. Create Variant (Price)
            price = float(data.get('price', 0))
            ProductVariant.objects.create(
                product=product,
                sku=f"IMP-{str(uuid.uuid4())[:8].upper()}",
                attributes={"size": "One Size", "color": "Default"},
                price_mrp=price * 1.2 if price else 9999, # Fake MRP
                price_selling=price if price else 0,
                is_active=True
            )

            # 4. Create Image
            if data.get('image'):
                ProductImage.objects.create(
                    product=product,
                    image_type='MAIN',
                    url=data['image'],
                    display_order=0
                )

            # Return full structure
            serializer = ProductSerializer(product)
            return Response(serializer.data)

        except Exception as e:
            print(f"Scrape Save Error: {e}")
            # Fallback: Just return scraped data if save fails
            return Response(data)

class VoiceCommandView(APIView):
    """
    Advanced Intent Engine.
    Processes natural language commands on the server for security and extensibility.
    Uses Keyword Scoring and Context Data (Path, ProductID) for intelligent routing.
    """
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        command = request.data.get('command', '').lower().strip()
        context = request.data.get('context', {})
        
        # 1. Define Intents with Keyword Weighting
        INTENTS = {
            "navigate_home": {
                "keywords": ["home", "main", "start", "index", "landing"],
                "action": "navigate", "val": "/", "msg": "Taking you home."
            },
            "open_cart": {
                "keywords": ["cart", "bag", "checkout", "basket", "buy"],
                "action": "navigate", "val": "/cart", "msg": "Opening your shopping bag."
            },
            "shop_men": {
                "keywords": ["men", "mens", "male", "guy", "boy", "gentlemen"],
                "action": "navigate", "val": "/shop?category=men", "msg": "Showing Men's collection."
            },
            "shop_women": {
                "keywords": ["women", "woman", "ladies", "girl", "female"],
                "action": "navigate", "val": "/shop?category=women", "msg": "Showing Women's collection."
            },
            "scroll_down": {
                "keywords": ["scroll down", "go down", "move down", "lower", "swipe down"],
                "action": "scroll_window", "val": 600, "msg": ""
            },
            "scroll_up": {
                "keywords": ["scroll up", "go up", "move up", "higher", "swipe up"],
                "action": "scroll_window", "val": -600, "msg": ""
            },
            "scroll_top": {
                "keywords": ["top", "beginning", "header", "up"],
                "action": "scroll_top", "val": 0, "msg": "Back to top."
            },
            "show_deals": {
                "keywords": ["sale", "offer", "deal", "discount", "cheapest", "promo"],
                "action": "scroll", "val": "luxe-zone-trigger", "msg": "Checking latest offers."
            },
            "refresh": {
                "keywords": ["refresh", "reload", "update", "restart"],
                "action": "reload", "val": None, "msg": "Refreshing page."
            }
        }

        # 2. Context-Aware Intention (Add to Cart / Product Info)
        if any(w in command for w in ['add', 'get', 'want', 'buy']) and ('cart' in command or 'bag' in command):
            prod_id = context.get('productId')
            if prod_id:
                # In a real app, we'd trigger a server-side cart update here.
                # For now, we signal the frontend to handle it or give a confirmation msg.
                return Response({
                    "action": "none",
                    "val": None,
                    "message": "I've noted your interest. Please click the 'Add to Cart' button to confirm your size!"
                })
            else:
                return Response({
                    "action": "none",
                    "val": None,
                    "message": "I can only add products when you are on a product page. Try 'show me men's shirts'."
                })

        # 3. Fuzzy Match via Keyword Scoring
        best_intent = None
        max_score = 0
        
        for intent_id, config in INTENTS.items():
            # Exact word match gets higher score
            score = sum(3 if f" {w} " in f" {command} " else (1 if w in command else 0) for w in config['keywords'])
            if score > max_score:
                max_score = score
                best_intent = config

        # Apply threshold to avoid false positives
        if best_intent and max_score >= 1:
            return Response({
                "action": best_intent['action'],
                "val": best_intent['val'],
                "message": best_intent['msg']
            })

        # 4. Explicit Search (Fallback)
        search_triggers = ['search', 'find', 'looking for', 'show me', 'where is', 'query']
        if any(w in command for w in search_triggers):
            query = command
            for w in search_triggers:
                query = query.replace(w, "")
            query = query.strip()
            if query:
                return Response({
                    "action": "navigate",
                    "val": f"/shop?search={query}",
                    "message": f"Searching for {query}."
                })

        # 5. Generic Category Search (e.g. "show me dresses")
        common_categories = ['dress', 'shirt', 'jeans', 'watch', 'bag', 'shoe', 'accessory']
        for cat in common_categories:
            if cat in command:
                return Response({
                    "action": "navigate",
                    "val": f"/shop?search={cat}",
                    "message": f"Looking for {cat}es."
                })

        return Response({
            "action": "none",
            "val": None,
            "message": "I didn't quite catch that. Try saying 'Go to cart' or 'Search for sneakers'."
        })
