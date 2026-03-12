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
    Now supports browser context and duration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        
        # Capture Browser/OS Context if provided
        context = data.get('context', {})
        if not context:
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            context = {'user_agent': user_agent}

        serializer = UserInteractionSerializer(data=data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                serializer.save(user=request.user, context=context)
            else:
                serializer.save(context=context)
                
            return Response({"status": "tracked"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PulseTrackView(APIView):
    """
    Heartbeat endpoint to increment duration for an existing interaction.
    Used for tracking exact time spent on a product or page.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        product_id = request.data.get('product_id')
        session_id = request.data.get('session_id')
        increment = int(request.data.get('increment', 10)) # Default 10s heartbeat
        user = request.user

        # Find the latest view/hover interaction for this product/session
        # We update the most recent one to keep it simple
        query = UserInteraction.objects.filter(
            product_id=product_id,
            interaction_type__in=['VIEW', 'HOVER']
        ).order_by('-timestamp')

        if user.is_authenticated:
            interaction = query.filter(user=user).first()
        elif session_id:
            interaction = query.filter(session_id=session_id).first()
        else:
            return Response({"error": "No context"}, status=400)

        if interaction:
            interaction.duration += increment
            interaction.save()
            return Response({"duration": interaction.duration})
        
        return Response({"status": "no_interaction_found"}, status=200)

class AffinityProfileView(APIView):
    """
    Calculates the user's category affinity scores in real-time.
    Aggregates weights from views, clicks, and dwell time.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        session_id = request.query_params.get('session_id')

        interactions = UserInteraction.objects.all()
        if user.is_authenticated:
            interactions = interactions.filter(user=user)
        elif session_id:
            interactions = interactions.filter(session_id=session_id)
        else:
            return Response({"scores": {}})

        # Weighting logic
        # VIEW=1, HOVER=2, CLICK=5, TIME_SPENT=0.5 per sec, CART=20
        scores = {}
        
        for i in interactions[:200]: # Look back at last 200 signals
            category = i.metadata.get('category')
            if not category: continue

            weight = 0
            if i.interaction_type == 'VIEW': weight = 1
            elif i.interaction_type == 'HOVER': weight = 2
            elif i.interaction_type == 'SEARCH': weight = 5
            elif i.interaction_type == 'CART_ADD': weight = 20
            
            # Engagement Duration Weight (0.1 points per second)
            if i.duration > 0:
                weight += (i.duration * 0.1)

            scores[category] = scores.get(category, 0) + weight

        # Sort and return
        sorted_scores = dict(sorted(scores.items(), key=lambda x: x[1], reverse=True))
        return Response({"scores": sorted_scores})

class DynamicLayoutView(APIView):
    """
    Returns the personalized homepage section order based on affinity.
    Enterprise-level dynamic layout engine.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        session_id = request.query_params.get('session_id')

        # 1. Get Top Category from Affinity View (internal call logic)
        affinity_view = AffinityProfileView()
        affinity_res = affinity_view.get(request)
        scores = affinity_res.data.get('scores', {})
        
        top_category = list(scores.keys())[0] if scores else None

        # 2. Defaut Order
        default_order = [
            "hero", "new-arrivals", "personalized-feed", "recently-viewed",
            "bank-offers", "seasonal", "lightning-deals", "hourly-deals",
            "electronics", "beauty", "home", "luxury", "rest"
        ]

        if not top_category:
            return Response({"order": default_order, "is_personalized": False})

        # 3. Neural Reordering
        # If user is into 'electronics', move 'electronics' to position 1 (after hero)
        new_order = default_order.copy()
        
        # Mapping frontend categories to layout keys
        mappings = {
            'smartphones': 'electronics',
            'laptops': 'electronics',
            'fragrances': 'beauty',
            'skincare': 'beauty',
            'home-decoration': 'home',
            'furniture': 'home',
            'mens-shirts': 'new-arrivals', # or we could add a dedicated 'men' section
            'womens-dresses': 'new-arrivals'
        }

        target_section = mappings.get(top_category)
        if target_section and target_section in new_order:
            new_order.remove(target_section)
            new_order.insert(1, target_section) # Insert right after Hero

        return Response({
            "order": new_order,
            "top_category": top_category,
            "is_personalized": True
        })

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


class StylistView(APIView):
    """
    AI Chatbot Logic for 'Fashion Stylist'
    """
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get('message', '').lower()
        if not message:
            return Response({"response": "I didn't catch that. Could you say it again?", "type": "text"})

        # 1. Product Search Intent
        # Simple keyword matching for MVP
        keywords = ['saree', 'kurta', 'lehenga', 'shirt', 'dress', 'gown', 'jacket', 'shoe', 'watch']
        found_keyword = next((k for k in keywords if k in message), None)

        if found_keyword or "recommend" in message or "looking for" in message:
            # Search DB
            search_term = found_keyword if found_keyword else message.replace("looking for", "").strip()
            
            products = Product.objects.filter(
                Q(name__icontains=search_term) | 
                Q(category__icontains=search_term)
            ).filter(status='ACTIVE')[:5]
            
            if products.exists():
                results = []
                for p in products:
                     # Get main image
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
                        'image': img_url
                    })
                
                return Response({
                    "response": f"I found some stunning {search_term}s for you! ✨", 
                    "type": "products",
                    "data": results
                })
        
        # 2. Support Intent
        if "return" in message or "refund" in message:
            return Response({
                "response": "We offer a hassle-free 7-day return policy. You can initiate a return from your Orders page.",
                "type": "text"
            })
            
        if "shipping" in message or "delivery" in message:
             return Response({
                "response": "Standard delivery takes 3-5 business days. Express delivery is available for select pincodes.",
                "type": "text"
            })

        # 3. Small Talk / Default
        greetings = ["hi", "hello", "hey"]
        if any(x in message for x in greetings):
             return Response({
                "response": "Hello! I'm your personal AI stylist. I can help you find the perfect outfit or answer questions. What are you looking for today?",
                "type": "text"
            })

        return Response({
            "response": "I'm currently training my fashion senses! Try asking for 'Red Sarees' or 'Summer Dresses'.",
            "type": "text"
        })


from django.db.models import Count

class CollaborativeRecommendationsView(APIView):
    """
    User-User Collaborative Filtering (People who viewed this also viewed...)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        product_id = request.query_params.get('product_id')
        if not product_id:
            return Response({"error": "Product ID required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Find users/sessions who interacted with this product
        # Considering VIEW, CART_ADD, PURCHASE as positive signals
        positive_interactions = ['VIEW', 'CART_ADD', 'PURCHASE', 'TIME_30S']
        
        relevant_interactions = UserInteraction.objects.filter(
            product_id=product_id,
            interaction_type__in=positive_interactions
        )

        user_ids = relevant_interactions.exclude(user__isnull=True).values_list('user', flat=True).distinct()
        session_ids = relevant_interactions.filter(user__isnull=True).values_list('session_id', flat=True).distinct()

        # 2. Find other products these users interacted with
        # Exclude the current product
        recommendations = UserInteraction.objects.filter(
            interaction_type__in=positive_interactions
        ).exclude(product_id=product_id)

        # Filter by the identified cohort
        recommendations = recommendations.filter(
            Q(user__in=user_ids) | Q(session_id__in=session_ids)
        )

        # 3. Aggregation & Ranking
        # Group by product_id and count freq
        # We need to manually aggregate since product_id is CharField in analytics (loose link)
        # Ideally we join with Product table but for loose analytics it's safer to count first
        
        top_ids = recommendations.values('product_id').annotate(
            count=Count('id')
        ).order_by('-count')[:6]

        if not top_ids:
            return Response([])

        # 4. Fetch Product Details
        product_ids = [item['product_id'] for item in top_ids]
        
        # Convert to int if needed (assuming product model uses Int ID)
        # Analytics might store '123' string
        valid_ids = []
        for pid in product_ids:
            if pid and pid.isdigit():
                valid_ids.append(int(pid))

        products = Product.objects.filter(id__in=valid_ids)
        
        # Preserve order (roughly) - O(N^2) but N is small (6)
        results = []
        for item in top_ids:
            pid = int(item['product_id']) if item['product_id'].isdigit() else 0
            product = next((p for p in products if p.id == pid), None)
            if product:
                img = product.images.filter(image_type='MAIN').first()
                img_url = img.url if img else (product.images.first().url if product.images.exists() else "")
                
                try:
                    variant = product.variants.first()
                    price = float(variant.price_selling) if variant else 0
                except:
                    price = 0

                results.append({
                    'id': product.id,
                    'name': product.name,
                    'price': price,
                    'image': img_url,
                    'category': product.category.name if product.category else ""
                })

        return Response(results)


from .ml import RecommendationEngine

class PersonalizedRecommendationsView(APIView):
    """
    Hybrid AI Recommendations
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        user = request.user
        limit = int(request.query_params.get('limit', 8))
        
        engine = RecommendationEngine()
        
        product_ids = []
        if user.is_authenticated:
            # Collaborative Filtering
            product_ids = engine.get_user_recommendations(user.id, top_n=limit)
        else:
            # Popular / Trending
            product_ids = engine.get_popular_products(top_n=limit)
            
        # Fetch Product Objects
        # Convert IDs to appropriate type (int)
        valid_ids = [int(pid) for pid in product_ids if str(pid).isdigit()]
        
        products = Product.objects.filter(id__in=valid_ids)
        
        # Serialize
        results = []
        # Preserve order from recommendation engine
        for pid in valid_ids:
            product = next((p for p in products if p.id == pid), None)
            if product:
                img = product.images.filter(image_type='MAIN').first()
                img_url = img.url if img else (product.images.first().url if product.images.exists() else "")
                
                try:
                    variant = product.variants.first()
                    price = float(variant.price_selling) if variant else 0
                except:
                    price = 0

                # Safely get category name from JSONField
                category_name = ""
                if isinstance(product.category, dict):
                    category_name = product.category.get('name') or product.category.get('level3') or product.category.get('level2') or ""
                elif isinstance(product.category, str):
                    category_name = product.category
                
                results.append({
                    'id': product.id,
                    'name': product.name,
                    'price': price,
                    'image': img_url,
                    'category': category_name,
                    'brand': product.brand
                })
                
        return Response(results)
