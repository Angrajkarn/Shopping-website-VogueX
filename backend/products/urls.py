from django.urls import path
from .views import (
    ProductListView, ProductDetailView, ProductBySlugView, CategoryListView, FilterOptionsView,
    WishlistListCreateView, WishlistDetailView, ReviewListCreateView, ProductScraperView,
    VoiceCommandView
)

urlpatterns = [
    # filters must be BEFORE <slug:slug> to avoid being caught by it
    path('products/filters/', FilterOptionsView.as_view(), name='filter-options'),
    path('products/voice/', VoiceCommandView.as_view(), name='voice-command'),
    path('products/scrape/', ProductScraperView.as_view(), name='product-scrape'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:slug>/', ProductBySlugView.as_view(), name='product-detail-slug'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('wishlist/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('wishlist/<int:product_id>/', WishlistDetailView.as_view(), name='wishlist-detail'),
    path('products/<int:id>/reviews/', ReviewListCreateView.as_view(), name='product-reviews'),
    path('scrape/', ProductScraperView.as_view(), name='product-scraper'),
    path('products/', ProductListView.as_view(), name='product-list'),
]
