from django.urls import path
from .views import (
    ProductListView, ProductDetailView, ProductBySlugView, CategoryListView,
    WishlistListCreateView, WishlistDetailView, ReviewListCreateView
)

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<slug:slug>/', ProductBySlugView.as_view(), name='product-detail-slug'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('wishlist/', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('wishlist/<int:product_id>/', WishlistDetailView.as_view(), name='wishlist-detail'),
    path('products/<int:id>/reviews/', ReviewListCreateView.as_view(), name='product-reviews'),
]
