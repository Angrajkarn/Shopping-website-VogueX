from rest_framework import serializers
from .models import Product, ProductImage, ProductVariant, Inventory, WarehouseInventory, ProductServiceability, PricingRule, Review, Wishlist

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_type', 'url', 'display_order']

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['total_stock', 'available_stock', 'stock_status', 'low_stock_threshold']

class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = ['discount_type', 'discount_value', 'valid_from', 'valid_to', 'is_active']

class ProductVariantSerializer(serializers.ModelSerializer):
    inventory = serializers.SerializerMethodField()
    pricing_rules = PricingRuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'attributes', 'price_mrp', 'price_selling', 'currency', 'inventory', 'pricing_rules']

    def get_inventory(self, obj):
        if hasattr(obj, 'inventory'):
            return InventorySerializer(obj.inventory).data
        return None

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.first_name')
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'category', 
            'description_short', 'description_long', 'attributes', 
            'rating_average', 'rating_count', 'status', 
            'images', 'variants', 'reviews'
        ]

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'product_id', 'product_name', 'product_image', 'product_price', 'created_at']

class CategorySerializer(serializers.Serializer):
    # Dummy serializer if views reference it, or remove if not needed.
    # The new model stores category as JSON. This might be used for listing unique categories.
    name = serializers.CharField()
    slug = serializers.CharField() 
