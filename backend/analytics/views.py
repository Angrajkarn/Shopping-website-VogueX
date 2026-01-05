from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .models import UserInteraction
from .serializers import UserInteractionSerializer
import logging

logger = logging.getLogger(__name__)

class TrackEventView(APIView):
    """
    API endpoint to track user interactions (View, Hover, Add to Cart, etc.)
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        
        # If user is logged in, attach user
        if request.user.is_authenticated:
            # We don't save 'user' via serializer directly if it's read-only or not in fields easily, 
            # but standard is to pass it in save()
            pass
        
        serializer = UserInteractionSerializer(data=data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                serializer.save(user=request.user)
            else:
                serializer.save()
                
            return Response({"status": "tracked"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HistoryView(APIView):
    """
    Fetch user's recently viewed products based on tracking history
    """
    permission_classes = [AllowAny]

    def get(self, request):
        session_id = request.query_params.get('session_id')
        user = request.user
        
        # Filter interactions
        interactions = UserInteraction.objects.filter(interaction_type='VIEW').order_by('-timestamp')
        
        if user.is_authenticated:
            # If logged in, prioritize user history (could merge with session if needed)
            interactions = interactions.filter(user=user)
        elif session_id:
            interactions = interactions.filter(session_id=session_id)
        else:
            # No context
            return Response([])

        # Deduplicate
        seen = set()
        history = []
        # Fetch a bit more to handle dupes
        for i in interactions[:50]:
            pid = str(i.product_id)
            if pid not in seen:
                seen.add(pid)
                
                # Extract details from metadata (Snapshot of product at time of view)
                meta = i.metadata or {}
                
                # Only add if we have at least a title (valid view)
                if meta.get('title'):
                    history.append({
                        'id': i.product_id,
                        'name': meta.get('title'),
                        'price': meta.get('price', 0),
                        'image': meta.get('image', ''),
                        'category': meta.get('category', ''),
                        'viewed_at': i.timestamp
                    })

        return Response(history[:10])


from django.db.models import Q
from products.models import Product

class InspiredBySearchView(APIView):
    """
    Fetch products based on user's last search query
    """
    permission_classes = [AllowAny]

    def get(self, request):
        session_id = request.query_params.get('session_id')
        user = request.user
        
        # Find last search
        interactions = UserInteraction.objects.filter(interaction_type='SEARCH').order_by('-timestamp')
        
        if user.is_authenticated:
            last_search = interactions.filter(user=user).first()
        elif session_id:
            last_search = interactions.filter(session_id=session_id).first()
        else:
            return Response({}) 
            
        if not last_search:
            return Response({})
            
        # Get query from metadata
        query = last_search.metadata.get('query')
        if not query:
            return Response({})
            
        # Search for products (Simple Q lookup for now, can be upgraded to Vector later)
        products = Product.objects.filter(
            Q(name__icontains=query) | 
            Q(brand__icontains=query) |
            Q(category__icontains=query)
        ).filter(status='ACTIVE')[:10]
        
        # Serialize simple list
        results = []
        for p in products:
            # Get main image
            img = p.images.filter(image_type='MAIN').first()
            img_url = img.url if img else (p.images.first().url if p.images.exists() else "")
            
            # Get price from first variant (fallback to 0)
            try:
                variant = p.variants.first()
                price = float(variant.price_selling) if variant else 0
            except:
                price = 0
            
            results.append({
                'id': p.id,
                'name': p.name,
                'price': price,
                'image': img_url,
                'category': query # Tag it with the search term
            })
            
        return Response({
            "term": query,
            "products": results
        })



# Top level imports for StylistView (added here for clarity in replacement)
import requests
import os
import re

class StylistView(APIView):
    """
    AI Chatbot Logic for 'Fashion Stylist'
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            message = request.data.get('message', '').lower()
            if not message:
                return Response({"response": "I didn't catch that. Could you say it again?", "type": "text"})

            # D. FALLBACK BROAD SEARCH (If no specific keyword matched)
            # Treat the entire message as a search query
            broad_search_term = message.strip()
            # Remove common stop words to clean up
            stop_words = ['i', 'want', 'a', 'an', 'the', 'show', 'me', 'looking', 'for', 'need', 'recommend']
            for w in stop_words:
                broad_search_term = broad_search_term.replace(f" {w} ", " ").replace(f"{w} ", "")
            
            broad_search_term = broad_search_term.strip()

            found_results = []
            if len(broad_search_term) > 2: # Avoid searching for single letters
                query = Q(status='ACTIVE') & (
                    Q(name__icontains=broad_search_term) | 
                    Q(category__icontains=broad_search_term) | 
                    Q(description_short__icontains=broad_search_term) |
                    Q(brand__icontains=broad_search_term)
                )
                
                fallback_products = Product.objects.filter(query)[:5]
                
                for p in fallback_products:
                    # Get main image
                    img = p.images.filter(image_type='MAIN').first()
                    img_url = img.url if img else (p.images.first().url if p.images.exists() else "")
                    try:
                        variant = p.variants.first()
                        price = float(variant.price_selling) if variant else 0
                    except:
                        price = 0
                        
                    found_results.append({
                        'id': p.id,
                        'name': p.name,
                        'price': price,
                        'image': img_url
                    })

            # --- GEMINI AI INTEGRATION ---
            api_key = os.getenv("GEMINI_API_KEY")
            ai_response_text = ""
            suggestions = ["See More", "Filter by Price"]

            if api_key:
                try:
                    # Prepare Context for AI
                    context_str = ""
                    if found_results:
                        context_str = "I found these products in our catalog related to the query:\n"
                        for p in found_results:
                            context_str += f"- {p['name']} (Price: {p['price']})\n"
                    else:
                        context_str = "I couldn't find any specific individual products in the catalog matching this query directly."

                    # Prompt Engineering
                    prompt = {
                        "contents": [{
                            "parts": [{
                                "text": f"""
                                You are VogueBot, a high-fashion AI stylist for an elite fashion store.
                                User Query: "{message}"
                                
                                Context (Database Results):
                                {context_str}
                                
                                Your Goal:
                                1. Be helpful, chic, and enthusiastic. Use emojis.
                                2. If products were found, recommend them based on the user's vibe.
                                3. If NO products were found, politely suggest broad categories like "Sarees", "Dresses", or "Jackets" that might fit the theme (e.g. for 'Wedding', suggest 'Silk Sarees').
                                4. Keep it short (max 2-3 sentences).
                                5. Do NOT mention "database" or "catalog". Say "our collection".
                                """
                            }]
                        }]
                    }

                    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
                    response = requests.post(url, json=prompt, timeout=5)
                    
                    if response.status_code == 200:
                        data = response.json()
                        candidates = data.get('candidates', [])
                        if candidates and 'content' in candidates[0]:
                            ai_response_text = candidates[0]['content']['parts'][0]['text']
                        else:
                             logger.error(f"Gemini No Candidates: {data}")
                    else:
                        logger.error(f"Gemini API Error: {response.text}")
                        
                except Exception as e:
                    logger.error(f"Gemini Exception: {e}")
            
            # Fallback if AI fails or apiKey missing
            if not ai_response_text:
                if found_results:
                    ai_response_text = f"I found these stunning picks for '{broad_search_term}'! Which one matches your vibe? ✨"
                else:
                     ai_response_text = "I couldn't find EXACT matches, but I'm sure our Summer Collection has something for you! ☀️"
                     suggestions = ["Summer Collection", "New Arrivals"]

            return Response({
                "response": ai_response_text,
                "type": "products" if found_results else "text",
                "data": found_results,
                "suggestions": suggestions
            })
            
        except Exception as e:
            logger.error(f"StylistView Error: {str(e)}")
            return Response({
                "response": "I'm having a little trouble connecting to my fashion brain right now. 🧠\n\nTry asking again in a moment!",
                "type": "text"
            })


from .ml import UserAffinityEngine

class PersonalizedFeedView(APIView):
    """
    Returns a personalized feed of products based on Machine Learning Affinity Scores.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        session_id = request.query_params.get('session_id')
        user = request.user
        
        # 1. Calculate Affinity
        affinity = UserAffinityEngine.get_user_affinity(
            user=user if user.is_authenticated else None,
            session_id=session_id
        )
        
        # 2. Get Base Queryset
        queryset = Product.objects.filter(status='ACTIVE')
        
        # 3. Re-Rank using ML Engine
        personalized_qs = UserAffinityEngine.get_personalized_feed(queryset, affinity)
        
        # Limit to 10 for the feed
        products = personalized_qs[:10]
        
        results = []
        for p in products:
            img = p.images.filter(image_type='MAIN').first()
            img_url = img.url if img else (p.images.first().url if p.images.exists() else "")
            try:
                variant = p.variants.first()
                price = float(variant.price_selling) if variant else 0
            except:
                price = 0
                
            results.append({
                'id': p.id,
                'name': p.name,
                'price': price,
                'image': img_url,
                'category': p.category, # Include for debugging
                'affinity_score': getattr(p, 'affinity_score', 0)
            })
            
        return Response({
            "user_affinity": affinity, # Debug info to show user "We think you like..."
            "feed": results
        })

from .ml import CollaborativeFilteringEngine

class RecommendationView(APIView):
    """
    Returns collaborative filtering recommendations ("People who viewed X...").
    """
    permission_classes = [AllowAny]

    def get(self, request, product_id):
        # 1. Get Recommendations from ML Engine
        similar_ids = CollaborativeFilteringEngine.get_recommendations(product_id)
        
        # 2. Fetch Product Objects
        products = Product.objects.filter(id__in=similar_ids, status='ACTIVE')
        
        # 3. Serialize (Basic)
        results = []
        for p in products:
            img = p.images.filter(image_type='MAIN').first()
            img_url = img.url if img else (p.images.first().url if p.images.exists() else "")
            try:
                variant = p.variants.first()
                price = float(variant.price_selling) if variant else 0
            except:
                price = 0
                
            results.append({
                'id': p.id,
                'name': p.name,
                'price': price,
                'image': img_url,
                'category': p.category
            })
            
        return Response(results)
