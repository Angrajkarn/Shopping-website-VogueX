from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, viewsets
from django.contrib.auth import get_user_model
from sellers.models import SellerProfile, SellerDashboard
from orders.models import Order
from .serializers import UserAdminSerializer, AdminSellerSerializer
from .models import SystemAdmin, AccessLog
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
import jwt
import datetime
from django.conf import settings

User = get_user_model()

# --- ISOLATED ADMIN PERMISSIONS ---
class IsSystemAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return False
        
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            if payload.get('type') != 'system_admin':
                 return False
            # Verify admin still exists in Admin DB
            admin = SystemAdmin.objects.using('admin_db').get(id=payload['id'])
            request.admin_user = admin # Attach to request
            return True
        except Exception:
            return False

# --- ADMIN AUTH VIEWS ---
class AdminLoginView(APIView):
    permission_classes = [] # Public

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Get Client IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
            
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        try:
            admin = SystemAdmin.objects.using('admin_db').get(email=email)
            
            # 1. Check Lockout
            if admin.locked_until and admin.locked_until > timezone.now():
                lock_delta = (admin.locked_until - timezone.now()).seconds // 60
                AccessLog.objects.using('admin_db').create(
                    admin=admin, ip_address=ip, user_agent=user_agent, status='FAILURE'
                )
                return Response({'error': f'Account locked. Try again in {lock_delta} minutes.'}, status=403)

            if admin.check_password(password):
                if not admin.is_active:
                     return Response({'error': 'Account is disabled'}, status=403)
                
                # 2. SUCCESS: Reset Counters & Log
                admin.failed_attempts = 0
                admin.locked_until = None
                admin.last_login = timezone.now()
                admin.save(using='admin_db')
                
                AccessLog.objects.using('admin_db').create(
                    admin=admin, ip_address=ip, user_agent=user_agent, status='SUCCESS'
                )
                
                # Generate Custom JWT
                payload = {
                    'id': admin.id,
                    'email': admin.email,
                    'role': admin.role,
                    'type': 'system_admin',
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
                
                return Response({
                    'token': token,
                    'admin': {
                        'id': admin.id,
                        'email': admin.email,
                        'full_name': admin.full_name,
                        'role': admin.role
                    }
                })
            else:
                # 3. FAILURE: Increment & Lock Logic
                admin.failed_attempts += 1
                if admin.failed_attempts >= 5:
                    admin.locked_until = timezone.now() + datetime.timedelta(minutes=15)
                    admin.failed_attempts = 0 # Optional: Reset or keep until lock expires
                
                admin.save(using='admin_db')
                
                AccessLog.objects.using('admin_db').create(
                    admin=admin, ip_address=ip, user_agent=user_agent, status='FAILURE'
                )
                
                return Response({'error': 'Invalid credentials'}, status=401)
                
        except SystemAdmin.DoesNotExist:
             # Log attempt for unknown email
             # AccessLog(ip_address=ip, status='FAILURE') - careful with database routing here if no admin object
             return Response({'error': 'Invalid credentials'}, status=401)

class AdminSignupView(APIView):
    permission_classes = [] 

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('full_name')
        secret_code = request.data.get('secret_code') # Simple protection

        # In production, remove this or use env var
        if secret_code != "VOGUEX_MASTER_KEY_2026":
             return Response({'error': 'Invalid secret code'}, status=403)
        
        if SystemAdmin.objects.using('admin_db').filter(email=email).exists():
             return Response({'error': 'Admin already exists'}, status=400)
        
        admin = SystemAdmin(
            email=email,
            full_name=full_name,
            role='SUPERADMIN'
        )
        admin.set_password(password)
        admin.save(using='admin_db')
        
        return Response({'message': 'Admin created successfully'}, status=201)

# --- DASHBOARD STATS ---
class AdminDashboardStatsView(APIView):
    permission_classes = [] # Public for demo

    def get(self, request):
        # 1. User Stats (Read from Default DB)
        total_users = User.objects.count()
        new_users_today = User.objects.filter(date_joined__gte=timezone.now().date()).count()
        
        # 2. Seller Stats
        total_sellers = SellerProfile.objects.count()
        pending_sellers = SellerProfile.objects.filter(verification_status='PENDING').count()
        
        # 3. Order/Revenue Stats (Global)
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        return Response({
            "users": {
                "total": total_users,
                "new_today": new_users_today
            },
            "sellers": {
                "total": total_sellers,
                "pending": pending_sellers
            },
            "financials": {
                "revenue": total_revenue,
                "orders": total_orders
            }
        })

class AdminActivityView(APIView):
    permission_classes = [] # Public for demo

    def get(self, request):
        # 1. Recent Orders
        recent_orders = Order.objects.all().order_by('-created_at')[:5]
        orders_data = [{
            'type': 'order',
            'user': f"{o.user.first_name} {o.user.last_name}" if o.user.first_name else o.user.email,
            'action': 'placed an order',
            'amount': f"₹{o.total_amount}",
            'time': o.created_at
        } for o in recent_orders]

        # 2. Recent Users
        recent_users = User.objects.all().order_by('-date_joined')[:5]
        users_data = [{
            'type': 'user',
            'user': f"{u.first_name} {u.last_name}" if u.first_name else u.email,
            'action': 'joined the platform',
            'amount': None,
            'time': u.date_joined
        } for u in recent_users]

        # 3. Recent Sellers
        recent_sellers = SellerProfile.objects.all().order_by('-created_at')[:5]
        sellers_data = [{
            'type': 'seller',
            'user': s.store_name,
            'action': 'registered as seller',
            'amount': None,
            'time': s.created_at
        } for s in recent_sellers]

        # Combine and Sort
        all_activity = orders_data + users_data + sellers_data
        all_activity.sort(key=lambda x: x['time'], reverse=True)

        return Response(all_activity[:10])

from rest_framework.decorators import action

class UserManagementViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSystemAdmin]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserAdminSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            from .serializers import UserDetailAdminSerializer
            return UserDetailAdminSerializer
        return UserAdminSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Search (Name or Email)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(email__icontains=search_query) | 
                Q(first_name__icontains=search_query) | 
                Q(last_name__icontains=search_query)
            )
            
        # Filter by Status
        status_param = self.request.query_params.get('status', 'ALL')
        if status_param == 'ACTIVE':
            queryset = queryset.filter(is_active=True)
        elif status_param == 'BANNED':
            queryset = queryset.filter(is_active=False)

        # Filter by Role
        role_param = self.request.query_params.get('role', 'ALL')
        if role_param == 'ADMIN':
            queryset = queryset.filter(is_staff=True)
        elif role_param == 'SELLER':
            queryset = queryset.filter(is_seller=True)
            
        return queryset

    @action(detail=True, methods=['post'])
    def ban_user(self, request, pk=None):
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'status': 'User account suspended'})

    @action(detail=True, methods=['post'])
    def activate_user(self, request, pk=None):
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'User account activated'})

    @action(detail=True, methods=['post'])
    def manage_wallet(self, request, pk=None):
        user = self.get_object()
        amount = int(request.data.get('amount', 0))
        action_type = request.data.get('type', 'CREDIT') # CREDIT or DEBIT
        
        if action_type == 'CREDIT':
            user.super_coins += amount
        elif action_type == 'DEBIT':
             user.super_coins = max(0, user.super_coins - amount)
        
        user.save()
        # Log notification logic here
        return Response({
            'status': 'Wallet updated', 
            'new_balance': user.super_coins
        })
    
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

# --- USER INSIGHTS (ADVANCED ALGORITHM) ---
from django.db.models import Max, F

class UserAnalyticsView(APIView):
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        # RFM Analysis (Recency, Frequency, Monetary)
        # 1. Get Summary for each user
        user_metrics = Order.objects.values('user').annotate(
            total_spent=Sum('total_amount'),
            order_count=Count('id'),
            last_order_date=Max('created_at')
        )
        
        # 2. Score Users
        # (Simplified Scoring for MVP: High Spenders, Frequent Buyers)
        segments = {
            "Champions": 0,    # High spend, Recent
            "Loyal": 0,        # Frequent
            "New": 0,          # Recent join, low spend
            "At Risk": 0       # Old last order, High past spend
        }
        
        now = timezone.now()
        
        for u in user_metrics:
            spent = float(u['total_spent'])
            freq = u['order_count']
            last_order = u['last_order_date']
            days_since_last = (now - last_order).days if last_order else 999
            
            if spent > 10000 and days_since_last < 30:
                segments["Champions"] += 1
            elif freq > 5:
                segments["Loyal"] += 1
            elif days_since_last < 30 and freq == 1:
                segments["New"] += 1
            elif spent > 5000 and days_since_last > 60:
                segments["At Risk"] += 1

        return Response({
            "segments": segments,
            "total_analyzed": len(user_metrics)
        })



# --- SELLER ADVANCED ALGORITHM ---
class SellerPerformanceView(APIView):
    permission_classes = [IsSystemAdmin]

    def get(self, request, pk=None):
        try:
            seller = SellerProfile.objects.get(pk=pk)
            
            # --- THE ALGORITHM: "VogueX Seller Health Score" ---
            # 1. Rating Score (Max 50 points)
            # 4.5+ stars = 50 pts, 4.0+ = 40 pts...
            rating_score = (seller.rating / 5.0) * 50
            
            # 2. Volume Score (Max 30 points)
            # Logarithmic scale to favor growth but cap specifically
            # Simple linear for MVP: 100+ sales = 30pts
            volume_score = min(seller.total_sales * 0.3, 30)
            
            # 3. Reliability Score (Max 20 points)
            # Deduct points for high return rate
            # Return Rate 0% = 20pts, 10% = 10pts, 20%+ = 0pts
            reliability_score = max(0, 20 - (seller.return_rate * 100))
            
            # Total Score
            health_score = int(rating_score + volume_score + reliability_score)
            
            # Gamification Badge Upgrade
            new_badge = seller.badge
            if health_score >= 90: new_badge = 'Platinum'
            elif health_score >= 75: new_badge = 'Gold'
            elif health_score >= 50: new_badge = 'Silver'
            else: new_badge = 'Bronze'
            
            if new_badge != seller.badge:
                seller.badge = new_badge
                seller.seller_score = health_score
                seller.save()

            return Response({
                "seller_id": seller.id,
                "health_score": health_score, # 0-100
                "breakdown": {
                    "rating_contribution": round(rating_score, 1),
                    "volume_contribution": round(volume_score, 1),
                    "reliability_contribution": round(reliability_score, 1)
                },
                "badge": new_badge,
                "analysis": "Excellent performance" if health_score > 80 else "Needs Improvement"
            })
            
        except SellerProfile.DoesNotExist:
             return Response({"error": "Seller not found"}, status=404)

class SellerVerificationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSystemAdmin]
    queryset = SellerProfile.objects.all().order_by('-created_at')
    serializer_class = AdminSellerSerializer
    
    def get_queryset(self):
        status_param = self.request.query_params.get('status')
        if status_param:
            return self.queryset.filter(verification_status=status_param.upper())
        return self.queryset

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        seller = self.get_object()
        seller.verification_status = 'VERIFIED'
        seller.save()
        
        # Trigger Notification (Mock)
        # send_mail(subject="Welcome to VogueX!", ...)
        
        return Response({'status': 'Seller approved', 'badge': seller.badge})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        seller = self.get_object()
        reason = request.data.get('reason', 'Document verification failed')
        
        seller.verification_status = 'REJECTED'
        # Log reason in a separate audit model in real app
        seller.save()
        
        return Response({'status': 'Seller rejected'})

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        seller = self.get_object()
        seller.verification_status = 'SUSPENDED'
        seller.save()
        return Response({'status': 'Seller suspended'})

# --- ADVANCED ANALYTICS (ML) ---
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import timedelta

class RevenueForecastView(APIView):
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        # 1. Fetch Historical Data (Last 30 Days)
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        daily_revenue = Order.objects.filter(
            created_at__date__range=[start_date, end_date]
        ).values('created_at__date').annotate(total=Sum('total_amount')).order_by('created_at__date')

        # Prepare Data for Regression
        # X = Days since start, y = Revenue
        data = list(daily_revenue)
        if len(data) < 2:
             return Response({"error": "Not enough data for prediction"}, status=400)

        X = []
        y = []
        dates = []
        
        for i, entry in enumerate(data):
            X.append([i])
            y.append(float(entry['total']))
            dates.append(entry['created_at__date'])

        # 2. Train Model
        model = LinearRegression()
        model.fit(X, y)

        # 3. Predict Next 7 Days
        last_day_index = len(X) - 1
        future_X = [[last_day_index + i] for i in range(1, 8)]
        predictions = model.predict(future_X)

        formatted_predictions = []
        for i, val in enumerate(predictions):
            pred_date = end_date + timedelta(days=i+1)
            formatted_predictions.append({
                "date": pred_date.isoformat(),
                "predicted_revenue": max(0, round(val, 2)) # No negative revenue
            })

        return Response({
            "forecast": formatted_predictions,
            "trend_slope": round(model.coef_[0], 2), # Positive = Growing, Negative = Declining
            "r_squared": round(model.score(X, y), 2) # Accuracy confidence
        })
