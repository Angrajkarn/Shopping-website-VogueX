from django.db import transaction
import secrets
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from users.utils import send_order_confirmation_email, send_order_cancellation_email, send_payment_failed_email
from .utils import generate_invoice_pdf
from giftcards.models import GiftCard, GiftCardUsage
from giftcards.utils import fulfill_order_gift_cards
import sys

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        # Expecting: { "shipping_address": "...", "items": [ { "product_id": 1, "product_name": "...", "price": 10, "quantity": 1 } ] }
        data = request.data
        items_data = data.get('items', [])
        
        if not items_data:
             return Response({"error": "No items provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate Total
        total_amount = sum(float(item['price']) * int(item['quantity']) for item in items_data)

        try:
            with transaction.atomic():
                # Create Order
                order = Order.objects.create(
                    user=self.request.user,
                    total_amount=total_amount,
                    shipping_address=data.get('shipping_address', 'N/A')
                )

                # Create Items
                for item in items_data:
                    OrderItem.objects.create(
                        order=order,
                        product_id=item['product_id'],
                        product_name=item['product_name'],
                        product_image=item.get('image'), # frontend sends 'image', model has 'product_image'
                        price=item['price'],
                        quantity=item['quantity']
                    )
                
                serializer = self.get_serializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'order_id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

import razorpay
from django.conf import settings


class RazorpayOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("DEBUG: RazorpayOrderView Hit") 
        sys.stdout.flush()
        
        order_amt = 0 # Initialize safely
        amount_in_rupees = request.data.get('amount')
        items_data = request.data.get('items', [])
        shipping_address = request.data.get('shipping_address', 'N/A')

        if not amount_in_rupees:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Initialize Razorpay Client
        KEY_ID = 'rzp_test_RxAgOJqtxNUD2g'
        KEY_SECRET = 'M1fUgr5QrPzuBaNF814V0ti0'
        client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))

        try:
            amount_in_paise = int(float(amount_in_rupees) * 100)
            order_amt = float(amount_in_rupees)
            
            # --- Gift Card Logic ---
            gift_card_code = request.data.get('gift_card_code')
            print(f"DEBUG: Received Gift Card Code: {gift_card_code}")
            sys.stdout.flush()

            gift_card_discount = 0
            gift_card_obj = None

            if gift_card_code:
                try:
                    gc = GiftCard.objects.get(code=gift_card_code)
                    print(f"DEBUG: Found Gift Card: {gc.code}, Balance: {gc.current_balance}")
                    sys.stdout.flush()
                    
                    if gc.is_valid():
                        print("DEBUG: Gift Card is Valid")
                        sys.stdout.flush()
                        # Determine discount amount
                        # Logic:
                        balance = float(gc.current_balance)
                        order_amt = float(amount_in_rupees)
                        
                        if balance >= order_amt:
                            gift_card_discount = order_amt
                        else:
                            gift_card_discount = balance
                            
                        amount_in_rupees = order_amt - gift_card_discount
                        amount_in_paise = int(amount_in_rupees * 100)
                        
                        print(f"DEBUG: New Amount in Rupees: {amount_in_rupees}, Paise: {amount_in_paise}")
                        sys.stdout.flush()
                        
                        gift_card_obj = gc
                    else:
                        print("DEBUG: Gift Card is NOT Valid")
                        sys.stdout.flush()
                except GiftCard.DoesNotExist:
                    print(f"DEBUG: Gift Card {gift_card_code} NOT FOUND")
                    sys.stdout.flush()
                    pass
            
            print(f"DEBUG: Order Amt: {order_amt}, GC Discount: {gift_card_discount}, Final Amt: {amount_in_rupees}")
            sys.stdout.flush()
            
            # 2. Create Razorpay Order (Only if amount > 0)
            razorpay_order_id = ''
            if amount_in_paise > 0:
                data = {
                    "amount": amount_in_paise,
                    "currency": "INR",
                    "payment_capture": 1 
                }
                razorpay_order = client.order.create(data=data)
                razorpay_order_id = razorpay_order['id']
            else:
                 # Fully covered by Gift Card
                 razorpay_order = {
                     'id': 'mo_' + secrets.token_hex(10), # Mock ID
                     'entity': 'order',
                     'amount': 0,
                     'currency': 'INR'
                 }
                 razorpay_order_id = razorpay_order['id']
            # -----------------------
            
            # 2. Create Local Order (Pending)
            with transaction.atomic():
                print(f"DEBUG: Creating Order with total_amount={amount_in_rupees}")
                order = Order.objects.create(
                    user=request.user,
                    total_amount=amount_in_rupees,
                    shipping_address=shipping_address,
                    razorpay_order_id=razorpay_order_id,
                    status='Pending' if amount_in_paise > 0 else 'Confirmed', # if 0, confirmed immediately? Maybe stick to Pending until verify? If 0, no verify needed.
                    gift_card_discount=gift_card_discount
                )
                
                # If fully paid by GC, create Mock Payment ID if needed or handle logic
                if amount_in_paise == 0:
                     order.razorpay_payment_id = 'GC_' + secrets.token_hex(8)
                     order.status = 'Paid'
                     order.save()

                # Deduct Gift Card Balance
                if gift_card_obj and gift_card_discount > 0:
                    GiftCardUsage.objects.create(
                        gift_card=gift_card_obj,
                        order=order,
                        amount_used=gift_card_discount
                    )
                    gift_card_obj.current_balance -= Decimal(str(gift_card_discount))
                    gift_card_obj.save()

                # Create Order Items

                # Create Order Items
                for item in items_data:
                    OrderItem.objects.create(
                        order=order,
                        product_id=item['product_id'],
                        product_name=item['product_name'],
                        product_image=item.get('image'),
                        price=item['price'],
                        quantity=item['quantity']
                    )

            # Return both IDs
            response_data = {
                "id": razorpay_order['id'],
                "entity": razorpay_order['entity'],
                "amount": razorpay_order['amount'],
                "currency": razorpay_order['currency'],
                "local_order_id": order.order_id 
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        KEY_ID = 'rzp_test_RxAgOJqtxNUD2g'
        KEY_SECRET = 'M1fUgr5QrPzuBaNF814V0ti0'
        client = razorpay.Client(auth=(KEY_ID, KEY_SECRET))

        try:
            # Debug Logs
            print(f"VERIFY Payment ID: {razorpay_payment_id}")
            print(f"VERIFY Order ID: {razorpay_order_id}")
            print(f"VERIFY Signature: {razorpay_signature}")

            # Verify Signature
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            client.utility.verify_payment_signature(params_dict)

            # Update Order Status
            order = Order.objects.get(razorpay_order_id=razorpay_order_id)
            print(f"VERIFY SUCCESS: Updating Order {order.id} status to Confirmed")
            order.status = 'Confirmed'
            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.save()

            # Fulfill Gift Cards if any
            fulfill_order_gift_cards(order)

            # Send Confirmation Email (Async/Webhook)
            pdf_content = None
            try:
                pdf_buffer = generate_invoice_pdf(order)
                pdf_content = pdf_buffer.getvalue()
            except Exception:
                pass # Continue without PDF if generation fails

            try:
                send_order_confirmation_email(order, request.user.email, request.user.first_name, invoice_pdf=pdf_content)
                # print(f"EMAIL SENT: Order Confirmation for {order.order_id}")
            except Exception:
                pass # Silently fail email sending to avoid blocking response

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except Exception as e:
            # print(f"VERIFY ERROR: {str(e)}") 
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RazorpayWebhookView(APIView):
    def post(self, request):
        # Verify Signature
        webhook_secret = "your_webhook_secret_here" # Replace with actual secret or env var
        webhook_signature = request.headers.get('X-Razorpay-Signature')
        
        # Taking payload from request body
        payload = request.body.decode('utf-8')

        # Verify logic (optional for this demo, focusing on funcionality)
        # client.utility.verify_webhook_signature(payload, webhook_signature, webhook_secret)
        
        data = request.data
        event = data.get('event')
        
        print(f"Webhook Received: {event}")

        if event == 'payment.captured':
            payment_entity = data['payload']['payment']['entity']
            order_id = payment_entity['order_id']
            payment_id = payment_entity['id']
            
            try:
                order = Order.objects.get(razorpay_order_id=order_id)
                order.status = 'Paid'
                order.razorpay_payment_id = payment_id
                order.save()
                print(f"Order {order.id} marked as Paid")
                
                # Fulfill Gift Cards if any
                fulfill_order_gift_cards(order)

                # Send Confirmation Email (Async/Webhook)
                pdf_content = None
                try:
                    pdf_buffer = generate_invoice_pdf(order)
                    pdf_content = pdf_buffer.getvalue()
                except Exception:
                    pass

                try:
                    send_order_confirmation_email(order, order.user.email, order.user.first_name, invoice_pdf=pdf_content)
                except Exception as e:
                    print(f"WEBHOOK EMAIL ERROR: {e}")
            except Order.DoesNotExist:
                print(f"Order with Razorpay ID {order_id} not found")

        elif event == 'payment.failed':
             payment_entity = data['payload']['payment']['entity']
             order_id = payment_entity['order_id']
             try:
                order = Order.objects.get(razorpay_order_id=order_id)
                order.status = 'Failed'
                order.save()
                
                # Send Payment Failure Email
                try:
                    send_payment_failed_email(order, order.user.email, order.user.first_name)
                except Exception as e:
                    print(f"WEBHOOK FAIL EMAIL ERROR: {e}")

             except:
                 pass

        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
            
            if order.status in ['Delivered', 'Cancelled']:
                 return Response({"error": "Cannot cancel this order"}, status=status.HTTP_400_BAD_REQUEST)

            order.status = 'Cancelled'
            order.save()
            
            # Send Cancellation Email
            try:
                send_order_cancellation_email(order, request.user.email, request.user.first_name)
            except Exception as e:
                print(f"EMAIL ERROR (Cancellation): {e}")

            return Response({"status": "success", "message": "Order cancelled successfully"}, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

from django.http import FileResponse
from .utils import generate_invoice_pdf

class InvoiceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
            pdf_buffer = generate_invoice_pdf(order)
            
            return FileResponse(
                pdf_buffer, 
                as_attachment=True, 
                filename=f"invoice_{order.order_id}.pdf"
            )
        except Order.DoesNotExist:
             return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SyncCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Expecting: { "items": [ { "id": 1, "product_id": 1, "quantity": 1 }, ... ] }
        # Note: frontend cart item might have 'id' as string or local ID, but 'product_id' is what matters for backend.
        # Actually proper mapping: frontend 'id' might be product_id if not distinct.
        # Let's assume frontend sends { product_id: number, quantity: number } list.
        
        guest_items = request.data.get('items', [])
        user = request.user

        try:
            with transaction.atomic():
                # 1. Get or Create Pending Order (Serving as Cart)
                order, created = Order.objects.get_or_create(
                    user=user, 
                    status='Pending',
                    defaults={'total_amount': 0}
                )

                # 2. Merge Items
                for item_data in guest_items:
                    product_id = item_data.get('product_id') or item_data.get('id') # Handle both formats
                    quantity = item_data.get('quantity', 1)
                    
                    if not product_id:
                        continue

                    # Check if item exists in order
                    order_item, item_created = OrderItem.objects.get_or_create(
                        order=order,
                        product_id=product_id,
                        defaults={
                            'quantity': quantity,
                            'price': item_data.get('price', 0), # Fallback, ideally fetch from DB
                            'product_name': item_data.get('name', 'Unknown')
                        }
                    )

                    if not item_created:
                        # If exists, update quantity (strategy: add guest qty to existing)
                        order_item.quantity += quantity
                        order_item.save()
                
                # 3. Recalculate Total
                # We need accurate prices. Let's rely on what's in DB or update if needed.
                # Ideally we should fetch latest price from Product model but for now using stored/sent price.
                # A better approach for production: Fetch Product objects.
                
                # Re-fetch items to get all
                all_items = order.items.all()
                total = sum(item.price * item.quantity for item in all_items)
                order.total_amount = total
                order.save()

                # 4. Return Updated Cart
                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

