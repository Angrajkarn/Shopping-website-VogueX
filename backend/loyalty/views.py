from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Wallet, Transaction, PlusMembership

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
