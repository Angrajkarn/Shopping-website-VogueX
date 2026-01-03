from django.core.mail import send_mail
from django.conf import settings
from .models import GiftCard

def send_gift_card_email(gift_card, recipient_email):
    subject = f"Your VogueX Gift Card: ₹{gift_card.initial_balance}"
    message = f"""
    Here is your VogueX Gift Card!
    
    Amount: ₹{gift_card.initial_balance}
    Code: {gift_card.code}
    Expiry: {gift_card.expiry_date or 'No Expiry'}
    
    Redeem it at checkout!
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [recipient_email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send Gift Card email: {e}")

def fulfill_order_gift_cards(order):
    """
    Scans order items and creates Gift Cards for items appearing to be Gift Cards.
    """
    for item in order.items.all():
        # Check by name convention
        if "Gift Card" in item.product_name:
            # Determine amount per unit
            # Create one card per quantity unit? Or one card with total?
            # Standard: One card per unit usually.
            
            for _ in range(item.quantity):
                gc = GiftCard.objects.create(
                    initial_balance=item.price,
                    current_balance=item.price,
                    created_by=order.user,
                    # expiry?
                )
                send_gift_card_email(gc, order.user.email)
                print(f"Generated Gift Card {gc.code} for Order {order.id}")
