from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order
from users.models import Notification
from django.db import transaction

@receiver(pre_save, sender=Order)
def track_order_status_change(sender, instance, **kwargs):
    """
    Track if status is changing to Delivered to avoid multiple coin awards.
    This requires fetching the old instance from DB.
    """
    if instance.pk:
        try:
            old_instance = Order.objects.get(pk=instance.pk)
            instance._old_status = old_instance.status
        except Order.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None

@receiver(post_save, sender=Order)
def award_super_coins(sender, instance, created, **kwargs):
    if created:
        return

    # Check if status changed to Delivered/Completed
    old_status = getattr(instance, '_old_status', None)
    
    # Award Coins
    if instance.status in ['Delivered', 'Completed'] and old_status not in ['Delivered', 'Completed']:
        user = instance.user
        amount = float(instance.total_amount)
        base_coins = int(amount / 5)
        
        if user.is_plus_member:
            coins_earned = min(base_coins * 2, 100)
        else:
            coins_earned = min(base_coins, 50)
            
        if coins_earned > 0:
            user.super_coins += coins_earned
            user.save()
            Notification.objects.create(
                user=user, title="SuperCoins Earned!",
                message=f"You earned {coins_earned} SuperCoins for Order #{instance.id}.", type='coin'
            )
            
            # Check for Plus Upgrade
            if not user.is_plus_member and user.super_coins >= 200:
                user.is_plus_member = True
                user.save()
                Notification.objects.create(
                    user=user, title="Welcome to Plus Zone!",
                    message="Congratulations! You have unlocked Plus Membership.", type='system'
                )

    # Revert Coins (Returns/Cancellations)
    elif instance.status in ['Returned', 'Cancelled'] and old_status in ['Delivered', 'Completed']:
        user = instance.user
        amount = float(instance.total_amount)
        base_coins = int(amount / 5)
        
        # We need to estimate what was given. 
        # For strict accuracy, we should check if they were Plus WHEN they bought it.
        # But for now, using current status or re-calculating is acceptable approximation for this level.
        # If they are currently Plus, we assume they got Plus rate.
        
        if user.is_plus_member:
            coins_to_revert = min(base_coins * 2, 100)
        else:
            coins_to_revert = min(base_coins, 50)
            
        if coins_to_revert > 0:
            user.super_coins = max(0, user.super_coins - coins_to_revert)
            # Revert Plus if below threshold? Usually companies don't downgrade immediately, but let's keep it simple.
            user.save()
            Notification.objects.create(
                user=user, title="SuperCoins Reverted",
                message=f"{coins_to_revert} SuperCoins deducted for returned Order #{instance.id}.", type='coin'
            )
