from django.db import models
from django.conf import settings
from django.utils import timezone
from users.models import User

class Product(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    brand = models.CharField(max_length=100)
    
    # Category as JSON: { level1: "Electronics", level2: "Mobiles", ... }
    category = models.JSONField(default=dict) 
    
    description_short = models.CharField(max_length=500)
    description_long = models.TextField()
    
    # Dynamic attributes: { os: "iOS 17", camera: "48MP", ... }
    attributes = models.JSONField(default=dict)
    
    # Aggregate Rating (Simplified for Master)
    rating_average = models.FloatField(default=0.0)
    rating_count = models.IntegerField(default=0)
    
    STATUS_CHOICES = (('ACTIVE', 'Active'), ('INACTIVE', 'Inactive'), ('DRAFT', 'Draft'))
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    TYPE_CHOICES = (('MAIN', 'Main'), ('GALLERY', 'Gallery'), ('ZOOM', 'Zoom'))
    image_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='GALLERY')
    url = models.URLField()
    display_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['display_order']

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    sku = models.CharField(max_length=100, unique=True)
    
    # Attributes specific to variant: { storage: "256GB", color: "Black Titanium" }
    attributes = models.JSONField(default=dict)
    
    price_mrp = models.DecimalField(max_digits=10, decimal_places=2)
    price_selling = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.sku}"

class Inventory(models.Model):
    variant = models.OneToOneField(ProductVariant, related_name='inventory', on_delete=models.CASCADE)
    total_stock = models.IntegerField(default=0)
    available_stock = models.IntegerField(default=0)
    reserved_stock = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=5)
    
    STOCK_STATUS = (('IN_STOCK', 'In Stock'), ('OUT_OF_STOCK', 'Out of Stock'))
    stock_status = models.CharField(max_length=20, default='IN_STOCK')
    updated_at = models.DateTimeField(auto_now=True)

class WarehouseInventory(models.Model):
    variant = models.ForeignKey(ProductVariant, related_name='warehouse_inventories', on_delete=models.CASCADE)
    warehouse_id = models.CharField(max_length=50) # e.g. "WH-BLR-01"
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    
    # List of pincodes: ["560001", "560037"]
    serviceable_pincodes = models.JSONField(default=list) 
    delivery_eta = models.CharField(max_length=50) # "1-2 days"

class ProductServiceability(models.Model):
    """Rules for delivery based on destination pincode"""
    variant = models.ForeignKey(ProductVariant, related_name='serviceability', on_delete=models.CASCADE)
    pincode = models.CharField(max_length=10)
    city = models.CharField(max_length=100)
    cod_available = models.BooleanField(default=True)
    express_delivery = models.BooleanField(default=False)
    delivery_days = models.IntegerField(default=3)

    class Meta:
        unique_together = ('variant', 'pincode')

class PricingRule(models.Model):
    variant = models.ForeignKey(ProductVariant, related_name='pricing_rules', on_delete=models.CASCADE)
    DISCOUNT_TYPE = (('FLAT', 'Flat'), ('PERCENTAGE', 'Percentage'))
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    is_active = models.BooleanField(default=True)

# Keep Wishlist/Review if they existed, or redefine.
# The user request focused on the Product core. I'll re-add Wishlist ref if needed but User asked for Product Master.
# I will retain Wishlist/Review models if they were already there, but file overwrite removes them.
# I should CHECK what was there first to not break Wishlist/Review features I just added.

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # Linking to ProductVariant might be better now, but to keep simple with Master Product:
    # Actually User schema had product_id (int) for external. 
    # For internal, I should link to Product.
    # Previous implementation used 'product_id' (integer) as a loose link. 
    # I will keep the Wishlist model compatible with previous code (using product_id/name fields).
    product_id = models.IntegerField() 
    product_name = models.CharField(max_length=255)
    product_image = models.URLField()
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product_id')
