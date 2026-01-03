from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import Order
from .models import Wallet, Transaction, PlusMembership
from django.utils import timezone
import math

@receiver(post_save, sender=Order)
def handle_order_loyalty(sender, instance, created, **kwargs):
    user = instance.user
    if not user:
        return

    # 1. Ensure Wallet & PlusMembership exist
    wallet, _ = Wallet.objects.get_or_create(user=user)
    membership, _ = PlusMembership.objects.get_or_create(user=user)
    
    # Calculate SuperCoin Amount (2% of Order Value)
    coin_amount = math.floor(float(instance.total_amount) * 0.02)
    if coin_amount < 1:
        coin_amount = 1 # Min 1 coin

    # 2. Status Transition Logic
    
    # A) Order Placed -> Create PENDING Transaction
    if created:
        Transaction.objects.create(
            user=user,
            wallet=wallet,
            order=instance,
            amount=coin_amount,
            transaction_type='CREDIT',
            status='PENDING',
            description=f'SuperCoins for Order #{instance.id}'
        )

    # B) Order Delivered -> Mark COMPLETED + Update Wallet + Check Plus
    elif instance.status == 'DELIVERED':
        # Find the pending transaction
        txn = Transaction.objects.filter(order=instance, status='PENDING').first()
        if txn:
            txn.status = 'COMPLETED'
            txn.save()
            
            # Credit Wallet
            wallet.balance += txn.amount
            wallet.save()
            
            # Update Plus Progress
            membership.orders_in_cycle += 1
            if membership.orders_in_cycle >= 4:
                membership.is_active = True
                membership.activation_date = timezone.now()
            membership.save()

    # C) Order Cancelled/Returned -> Mark CANCELLED or Revert
    elif instance.status in ['CANCELLED', 'RETURNED']:
        # Find transaction
        txn = Transaction.objects.filter(order=instance).first()
        if txn:
            if txn.status == 'COMPLETED':
                # Already credited? Revert it.
                wallet.balance -= txn.amount
                wallet.save()
                
                # Check if we need to downgrade Plus? (Simplified: No downgrade for now)
                
                # Mark as Cancelled
                txn.status = 'CANCELLED'
                txn.save()
                
            elif txn.status == 'PENDING':
                # Just cancel the pending
                txn.status = 'CANCELLED'
                txn.save()
