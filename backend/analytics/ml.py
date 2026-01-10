import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from django.db.models import Count
from products.models import Product
from .models import UserInteraction
import logging

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.svd = TruncatedSVD(n_components=20, random_state=42)
        
    def get_content_recommendations(self, product_id, top_n=5):
        """
        Content-Based Filtering: Recommend similar products based on text features
        """
        # 1. Fetch all active products
        products = list(Product.objects.filter(status='ACTIVE').values('id', 'name', 'description', 'category__name', 'brand'))
        if not products:
            return []
            
        df = pd.DataFrame(products)
        df['details'] = df['name'] + " " + df['description'] + " " + df['category__name'] + " " + df['brand']
        df['details'] = df['details'].fillna('')
        
        # 2. TF-IDF Matrix
        tfidf_matrix = self.vectorizer.fit_transform(df['details'])
        
        # 3. Find target product index
        try:
            # product_id might be int or str, ensure match
            target_idx = df.index[df['id'].astype(str) == str(product_id)].tolist()[0]
        except IndexError:
            return []
            
        # 4. Cosine Similarity
        cosine_sim = cosine_similarity(tfidf_matrix[target_idx], tfidf_matrix).flatten()
        
        # 5. Get Top N (exclude self)
        indices = cosine_sim.argsort()[-top_n-1:-1][::-1]
        
        recommendations = []
        for idx in indices:
            recommendations.append(df.iloc[idx]['id'])
            
        return recommendations

    def get_user_recommendations(self, user_id, top_n=10):
        """
        Collaborative Filtering (Matrix Factorization) + Heuristic Fallback
        """
        # 1. Fetch Interaction Data
        interactions = UserInteraction.objects.filter(
            interaction_type__in=['VIEW', 'CART_ADD', 'PURCHASE']
        ).values('user_id', 'product_id', 'interaction_type')
        
        df = pd.DataFrame(interactions)
        
        if df.empty:
            return self.get_popular_products(top_n)
            
        # 2. Create User-Item Matrix
        # Assign weights: VIEW=1, CART=3, PURCHASE=5
        event_weights = {'VIEW': 1, 'CART_ADD': 3, 'PURCHASE': 5}
        df['weight'] = df['interaction_type'].map(event_weights)
        
        # Group by User-Product to sum weights
        grouped = df.groupby(['user_id', 'product_id'])['weight'].sum().reset_index()
        
        # If user has no history, return popular
        if user_id not in grouped['user_id'].unique():
             return self.get_popular_products(top_n)

        # Pivot
        user_item_matrix = grouped.pivot(index='user_id', columns='product_id', values='weight').fillna(0)
        
        # 3. Matrix Factorization (SVD) if enough data
        if user_item_matrix.shape[0] > 5 and user_item_matrix.shape[1] > 5:
            try:
                matrix_reduced = self.svd.fit_transform(user_item_matrix)
                matrix_reconstructed = self.svd.inverse_transform(matrix_reduced)
                
                # Convert back to DF
                preds_df = pd.DataFrame(matrix_reconstructed, index=user_item_matrix.index, columns=user_item_matrix.columns)
                
                # Get User's Predictions
                if user_id in preds_df.index:
                    user_preds = preds_df.loc[user_id].sort_values(ascending=False)
                    
                    # Filter out items already interacted (optional, but usually good to discover new)
                    # For e-commerce, re-recommending viewed items is okay, but purchased maybe not?
                    # Let's simple return top scores
                    top_ids = user_preds.head(top_n).index.tolist()
                    return top_ids
            except Exception as e:
                logger.error(f"SVD Failed: {e}")
                pass # Fallback
                
        # 4. Fallback: Recently Viewed Categories -> Popular in Category
        return self.get_popular_products(top_n)

    def get_popular_products(self, top_n=10):
        """
        Fallback: Return trending products based on interaction volume
        """
        top = UserInteraction.objects.values('product_id').annotate(
            count=Count('id')
        ).order_by('-count')[:top_n]
        
        return [x['product_id'] for x in top]

