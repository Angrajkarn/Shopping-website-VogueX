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

