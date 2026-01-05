import pandas as pd
from django.db.models import F
from .models import UserInteraction
from products.models import Product
import logging

logger = logging.getLogger(__name__)

class UserAffinityEngine:
    """
    Advanced Machine Learning Engine to calculate User Interaction Affinity.
    Uses Weighted Scoring:
    - View: 1 Point
    - Hover: 0.5 Points
    - Add to Cart: 3 Points
    - Purchase: 5 Points
    """
    
    weights = {
        'VIEW': 1.0,
        'HOVER': 0.5,
        'CART_ADD': 3.0,
        'PURCHASE': 5.0,
        'SEARCH': 1.0,
        'EXIT': 0.0 # Calculated dynamically
    }

    @staticmethod
    def get_user_affinity(user=None, session_id=None):
        """
        Returns a dictionary of Category Affinity Scores.
        Example: {'Sarees': 15.0, 'Watches': 5.0}
        """
        if not user and not session_id:
            return {}

        # 1. Fetch Interactions
        queryset = UserInteraction.objects.all()
        if user:
            queryset = queryset.filter(user=user)
        else:
            queryset = queryset.filter(session_id=session_id)
            
        # Optimize: Only fetch needed fields
        interactions = list(queryset.values('interaction_type', 'metadata'))
        
        if not interactions:
            return {}

        # 2. DataFrame Creation
        df = pd.DataFrame(interactions)
        
        # 3. Extract Category from Metadata
        # (Assuming metadata={'category': 'Sarees', ...})
        def extract_category(meta):
            if isinstance(meta, dict):
                return meta.get('category') or meta.get('level2') # Fallback to detailed category
            return None

        df['category'] = df['metadata'].apply(extract_category)
        
        # Filter out empty categories
        df = df[df['category'].notna()]
        
        if df.empty:
            return {}
            
        # 4. Apply Weights
        def calculate_score(row):
            base_score = UserAffinityEngine.weights.get(row['interaction_type'], 0.5)
            
            # Dynamic Scoring for Time Spent
            if row['interaction_type'] == 'EXIT':
                meta = row.get('metadata', {})
                if isinstance(meta, dict):
                    duration = meta.get('duration_seconds', 0)
                    # 1 point per 10 seconds, capped at 5 points (50s)
                    time_score = min(float(duration) / 10.0, 5.0)
                    return time_score
            
            return base_score

        df['score'] = df.apply(calculate_score, axis=1)
        
        # 5. Aggregate Scores by Category
        affinity = df.groupby('category')['score'].sum().sort_values(ascending=False).to_dict()
        
        # Calculate Brand Affinity as well
        def extract_brand(meta):
            if isinstance(meta, dict):
                return meta.get('brand')
            return None
            
        df['brand'] = df['metadata'].apply(extract_brand)
        brand_affinity = df[df['brand'].notna()].groupby('brand')['score'].sum().sort_values(ascending=False).to_dict()

        return {
            "categories": affinity,
            "brands": brand_affinity
        }

    @staticmethod
    def get_personalized_feed(queryset, affinity_profile):
        """
        Re-ranks a Product QuerySet based on user affinity.
        """
        if not affinity_profile or not affinity_profile.get('categories'):
            return queryset
            
        top_categories = list(affinity_profile['categories'].keys())[:3] # Focus on top 3
        
        # Boost products in top categories
        # Note: True personalization needs Vector Search or extensive CASE/WHEN in SQL.
        # For MVP: We will filter for top categories and append others, or use specific ordering.
        
        # Approach: Fetch personalized first, then standard.
        from django.db.models import Case, When, Value, IntegerField
        
        # Assign score 100 to top cat, 50 to 2nd, etc.
        whens = []
        for i, cat in enumerate(top_categories):
            score = 100 - (i * 20)
            # Create exact match or partial match condition
            whens.append(When(category__icontains=cat, then=Value(score)))
            
        # Apply Annotation
        qs = queryset.annotate(
            affinity_score=Case(
                *whens,
                default=Value(0),
                output_field=IntegerField()
            )
        ).order_by('-affinity_score', '-created_at') # Primary sort by Affinity, Secondary by recency
        
        return qs

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class CollaborativeFilteringEngine:
    """
    Item-Item Collaborative Filtering using Cosine Similarity.
    "People who liked this also liked..."
    """
    
    _similarity_matrix = None
    _product_index_map = None
    _last_trained = None

    @classmethod
    def train_model(cls):
        """
        Builds the User-Item Matrix and computes Cosine Similarity.
        Should be run periodically (e.g., Celery task), running on demand for MVP.
        """
        # 1. Fetch all interactions
        interactions = list(UserInteraction.objects.filter(product_id__isnull=False).values(
            'session_id', 'user_id', 'product_id', 'interaction_type', 'metadata'
        ))
        
        if not interactions:
            logger.warning("Collaborative Filtering: No interactions found")
            return
            
        df = pd.DataFrame(interactions)
        
        # Consolidate user identity (User ID > Session ID)
        df['user_identity'] = df['user_id'].combine_first(df['session_id'])
        
        # Calculate Weighted Scores
        def get_score(row):
            base = UserAffinityEngine.weights.get(row['interaction_type'], 1.0)
            return base
            
        df['score'] = df.apply(get_score, axis=1)
        
        # 2. Create User-Item Matrix (Pivot Table)
        # Rows: Users, Cols: Products, Values: Sum of Scores
        matrix = df.pivot_table(index='user_identity', columns='product_id', values='score', aggfunc='sum').fillna(0)
        
        if matrix.empty:
            return

        # 3. Compute Item-Item Similarity
        # Transpose so rows are Products
        item_matrix = matrix.T 
        
        # cosine_similarity returns matrix [n_products, n_products]
        try:
            cls._similarity_matrix = cosine_similarity(item_matrix)
            
            # Map Product IDs to Matrix Indices
            cls._product_index_map = {str(pid): i for i, pid in enumerate(item_matrix.index)}
            cls._index_product_map = {i: str(pid) for i, pid in enumerate(item_matrix.index)}
            
            logger.info(f"Collaborative Filtering Model Trained. Matrix Shape: {cls._similarity_matrix.shape}")
        except Exception as e:
            logger.error(f"Collaborative Filtering Training Failed: {e}")

    @classmethod
    def get_recommendations(cls, product_id, n=5):
        """
        Returns list of similar Product IDs based on interaction patterns.
        """
        if cls._similarity_matrix is None:
            cls.train_model()
            
        if cls._similarity_matrix is None or cls._product_index_map is None:
            return []
            
        # Ensure product_id is string/int consistent
        pid_str = str(product_id)
        
        # Check if product exists in our matrix
        idx = cls._product_index_map.get(pid_str)
            
        if idx is None:
            return [] # Cold Start problem -> Use Content Based
            
        # Get similarity scores for this product
        try:
            sim_scores = list(enumerate(cls._similarity_matrix[idx]))
            
            # Sort by score (descending)
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            
            # Get top N (skipping index 0 which is self)
            top_indices = [i[0] for i in sim_scores[1:n+1]]
            
            # Convert indices back to Product IDs
            recommendations = [cls._index_product_map[i] for i in top_indices]
            
            return recommendations
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            return []
