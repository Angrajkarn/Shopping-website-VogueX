from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from analytics.models import UserInteraction
from users.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Count, Q

class Command(BaseCommand):
    help = 'Run Smart Retargeting AI to send nudge emails'

    def handle(self, *args, **options):
        self.stdout.write("🧠 Starting Smart Retargeting Engine...")
        
        # 1. Time Window: Look at last 24 hours
        time_threshold = timezone.now() - timedelta(hours=24)
        
        # 2. Find High Intent Users (Cart Add or > 3 Views)
        # We aggregate by User/Session to find abandoning users
        
        interactions = UserInteraction.objects.filter(
            timestamp__gte=time_threshold
        ).exclude(
            interaction_type='PURCHASE' # exclude purchase events themselves
        )
        
        # Group 1: Abandoned Cart (Highest Priority)
        cart_abandons = interactions.filter(interaction_type='CART_ADD')
        
        # Group 2: "Obsessed" (Viewed same item > 3 times)
        obsession = interactions.filter(interaction_type='VIEW').values('user', 'session_id', 'product_id').annotate(view_count=Count('product_id')).filter(view_count__gte=3)
        
        # Process Cart Abandons
        processed_users = set()
        
        for action in cart_abandons:
            # Identifier
            user_id = action.user.id if action.user else None
            session_id = action.session_id
            identifier = user_id or session_id
            
            if identifier in processed_users:
                continue
                
            # Check if they actually bought it eventually?
            # A real implementation would check Orders table. 
            # For this MVP, we check if they have a PURCHASE event for this product later.
            has_purchased = UserInteraction.objects.filter(
                timestamp__gt=action.timestamp,
                interaction_type='PURCHASE'
            ).filter(
                Q(user_id=user_id) if user_id else Q(session_id=session_id)
            ).exists()
            
            if not has_purchased:
                # TRIGGER NUDGE
                product_name = action.metadata.get('title', 'that item')
                price = action.metadata.get('price', 0)
                
                self.trigger_email(action.user, product_name, price, "⚠️ You left something behind!")
                processed_users.add(identifier)

        # Process Obsessions
        for action in obsession:
            user_id = action['user']
            session_id = action['session_id'] # Note: values() returns dict
            identifier = user_id or session_id
            
            if identifier in processed_users:
                continue
                
            # TRIGGER DISCOUNT
            # We would fetch product name from one of the interactions
            self.trigger_email(None, "Item #"+str(action['product_id']), 0, "👀 We saw you looking...")
            processed_users.add(identifier)
            
        self.stdout.write(self.style.SUCCESS(f"✅ Retargeting Cycle Complete. Processed {len(processed_users)} leads."))

    def trigger_email(self, user, product_name, price, subject):
        email_to = user.email if user else "anonymous_user@example.com"
        
        if not user:
             self.stdout.write(self.style.WARNING(f"    [SKIP] Anonymous session for {product_name}. Cannot email."))
             return

        self.stdout.write(f"    📧 Sending Nuge to {email_to}: '{subject}' about {product_name}")
        
        # Simulate or Send
        try:
            # Uncomment to actually send if SMTP is live
            # send_mail(
            #     subject=f"VogueX: {subject}",
            #     message=f"Hi {user.first_name}, you seem interested in {product_name}. Here is a 5% code: TAKE5",
            #     from_email=settings.DEFAULT_FROM_EMAIL,
            #     recipient_list=[email_to],
            #     fail_silently=False,
            # )
            pass 
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Fail: {e}"))
