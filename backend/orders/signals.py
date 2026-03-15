from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Order
from users.models import Notification
from django.db import transaction

@receiver(post_save, sender=Order)
def notify_order_update(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.user, title="Order Placed!",
            message=f"Your order #{instance.id} has been placed successfully.", type='system'
        )
    else:
        Notification.objects.create(
            user=instance.user, title="Order Updated",
            message=f"Your order #{instance.id} status is now {instance.status}.", type='system'
        )
