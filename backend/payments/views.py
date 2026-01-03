import stripe
from django.conf import settings
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

stripe.api_key = "sk_test_placeholder" # Replace with env var in production

class CreatePaymentIntentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # In a real app, calculate amount from order ID passed in request
            amount = request.data.get('amount') 
            currency = 'usd'

            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                metadata={'user_id': request.user.id}
            )

            return Response({
                'clientSecret': intent.client_secret
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class StripeWebhookView(views.APIView):
    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']
        event = None

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, "whsec_placeholder" # Replace with env var
            )
        except ValueError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.SignatureVerificationError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            # Fulfill the order logic here
            print('Payment succeeded!')

        return Response(status=status.HTTP_200_OK)
