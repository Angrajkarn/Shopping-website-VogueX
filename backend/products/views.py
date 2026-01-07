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
        
        # Filter by Category (Level 1) -> Men, Women, Electronics
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__level1__iexact=category)
            
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
    Production-Grade Intent Engine.
    Processes natural language commands on the server for security and extensibility.
    """
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        command = request.data.get('command', '').lower().strip()
        
        response = {
            "action": "none",
            "val": None,
            "message": "I didn't quite catch that."
        }

        # 1. Navigation Intention
        if any(w in command for w in ['home', 'main page', 'start']):
            response = { "action": "navigate", "val": "/", "message": "Taking you home." }
        
        elif any(w in command for w in ['cart', 'bag', 'checkout', 'basket']):
            response = { "action": "navigate", "val": "/cart", "message": "Opening your cart." }

        # 2. Product Categories
        elif 'men' in command and 'women' not in command:
             response = { "action": "navigate", "val": "/shop?category=men", "message": "Showing Men's collection." }
        
        elif any(w in command for w in ['women', 'woman', 'ladies', 'girl']):
             response = { "action": "navigate", "val": "/shop?category=women", "message": "Showing Women's collection." }
             
        elif any(w in command for w in ['sale', 'offer', 'deal', 'discount']):
             response = { "action": "scroll", "val": "luxe-zone-trigger", "message": "Checking latest offers." }

        # 3. Search Intention (highest priority if explicit)
        elif any(w in command for w in ['search', 'find', 'looking for', 'show me']):
            # Extract query
            remove_words = ['search', 'find', 'looking for', 'show me', 'for']
            query = command
            for w in remove_words:
                query = query.replace(w, "")
            query = query.strip()
            
            if query:
                response = { "action": "navigate", "val": f"/shop?search={query}", "message": f"Searching for {query}." }
            else:
                response = { "action": "none", "val": None, "message": "What should I search for?" }

        # 4. Scroll Control
        elif 'scroll' in command or 'go down' in command or 'move' in command:
            if 'down' in command:
                response = { "action": "scroll_window", "val": 600, "message": "" }
            elif 'up' in command:
                response = { "action": "scroll_window", "val": -600, "message": "" }
            elif 'top' in command:
                response = { "action": "scroll_top", "val": 0, "message": "Back to top." }

        return Response(response)
