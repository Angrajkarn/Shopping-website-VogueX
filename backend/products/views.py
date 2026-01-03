from rest_framework import generics, filters, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product, ProductVariant, Wishlist, Review
from .serializers import ProductSerializer, WishlistSerializer, ReviewSerializer, CategorySerializer
from django.db.models import Q

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
            
        # Filter by Price Range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        # Note: Price is on Variant, so this is tricky for Product List.
        # We'll rely on the frontend or advanced logic for price filtering later.
        # For now, let's just create a basic connection.
        
        return queryset.order_by('-created_at')

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
            import traceback
            traceback.print_exc()
            raise serializers.ValidationError({"detail": str(e)})
