from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Wallet, Transaction, PlusMembership
from django.db import transaction

class LoyaltyDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get or Create Wallet/Membership
        wallet, _ = Wallet.objects.get_or_create(user=user)
        membership, _ = PlusMembership.objects.get_or_create(user=user)
        
        # Get Recent Transactions
        transactions = Transaction.objects.filter(user=user).order_by('-created_at')[:10]
        
        tx_data = [{
            'id': t.id,
            'amount': t.amount,
            'type': t.transaction_type,
            'status': t.status,
            'desc': t.description,
            'date': t.created_at
        } for t in transactions]

        return Response({
            'coins': wallet.balance,
            'plus_status': membership.is_active,
            'orders_to_plus': max(0, 4 - membership.orders_in_cycle),
            'history': tx_data
        })

class AwardCoinsView(APIView):
    """
    API view to award coins for specific engagement actions.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user
        action = request.data.get('action')
        amount = int(request.data.get('amount', 0))
        description = request.data.get('description', 'Engagement Reward')

        if not action or amount <= 0:
            return Response({"error": "Invalid action or amount"}, status=400)

        # If guest, just return success (frontend handles localStorage)
        if not user.is_authenticated:
            return Response({"status": "guest_tracked", "amount": amount})

        # For authenticated users, save to DB
        with transaction.atomic():
            wallet, _ = Wallet.objects.get_or_create(user=user)
            
            # Simple check to prevent rapid fire abuse (1 reward per action type per hour)
            from django.utils import timezone
            from datetime import timedelta
            recent_reward = Transaction.objects.filter(
                user=user, 
                description=description,
                created_at__gt=timezone.now() - timedelta(hours=1)
            ).exists()

            if recent_reward:
                return Response({"status": "already_claimed", "coins": wallet.balance})

            # Create transaction
            Transaction.objects.create(
                user=user,
                wallet=wallet,
                amount=amount,
                description=description,
                transaction_type='CREDIT',
                status='COMPLETED'
            )

            # Update balance
            wallet.balance += amount
            wallet.save()

        return Response({
            "status": "success",
            "earned": amount,
            "coins": wallet.balance
        })
