
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_html_email(subject, recipient_list, html_content, attachments=None):
    """
    Helper to send HTML emails with plain text fallback and optional attachments.
    attachments: List of dicts {'filename', 'content', 'mimetype'}
    """
    text_content = strip_tags(html_content)
    from_email = settings.DEFAULT_FROM_EMAIL
    
    msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
    msg.attach_alternative(html_content, "text/html")
    
    if attachments:
        for attachment in attachments:
            msg.attach(attachment['filename'], attachment['content'], attachment['mimetype'])

    try:
        msg.send()
        return True
    except Exception as e:
        print(f"EMAIL SENDING ERROR: {str(e)}")
        return False

def get_base_styles():
    return """
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0c0c0c; margin: 0; padding: 0; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #333; }
        .header { background-color: #000000; padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .logo { font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #ffffff; text-decoration: none; text-transform: uppercase; }
        .logo span { color: #D4AF37; }
        .content { padding: 40px 30px; text-align: center; }
        .title { font-size: 24px; font-weight: 300; margin-bottom: 20px; color: #ffffff; letter-spacing: 1px; }
        .message { color: #aaaaaa; line-height: 1.6; font-size: 16px; margin-bottom: 30px; }
        .otp-box { background: #1a1a1a; border: 1px solid #D4AF37; color: #D4AF37; font-size: 36px; font-weight: 700; letter-spacing: 8px; padding: 20px; margin: 30px 0; display: inline-block; border-radius: 4px; }
        .btn { background-color: #D4AF37; color: #000000; padding: 15px 30px; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; display: inline-block; margin-top: 20px; border-radius: 2px; }
        .footer { background-color: #000000; padding: 30px; text-align: center; color: #555555; font-size: 12px; border-top: 1px solid #222; }
        .social-link { color: #777; margin: 0 10px; text-decoration: none; }
    </style>
    """

def send_otp_email(email, otp_code, subject="Verify Your Account - VogueX"):
    # ... (same as before)
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>{subject}</title>
        {get_base_styles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VOGUE<span>X</span></div>
            </div>
            <div class="content">
                <h1 class="title">{subject}</h1>
                <p class="message">To secure your account, please use the verification code below.</p>
                
                <div class="otp-box">{otp_code}</div>
                
                <p class="message" style="font-size: 14px; color: #666;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
            </div>
            <div class="footer">
                <p>&copy; 2026 VogueX. All Rights Reserved.</p>
                <p>Elevating Style, Redefining Luxury.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_html_email(subject, [email], html_content)


def send_password_reset_success_email(email, first_name="Valued Customer"):
    # ... (same as before)
    subject = "Password Reset Successful - VogueX"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Password Changed</title>
        {get_base_styles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VOGUE<span>X</span></div>
            </div>
            <div class="content">
                <h1 class="title" style="color: #4ADE80;">Success!</h1>
                <p class="message">Your password has been successfully reset.</p>
                <p class="message">You can now access your account with your new credentials. If you did not make this change, please contact support immediately.</p>
                
                <a href="http://localhost:3000/login" class="btn">Login Now</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 VogueX. All Rights Reserved.</p>
                <p>Security Alert • <a href="#" style="color: #777;">Support</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_html_email(subject, [email], html_content)


def send_welcome_email(email, first_name="Fashionista"):
    # ... (same as before)
    subject = "Welcome to VogueX - Elevate Your Style"
    name = first_name.title() if first_name else "Fashionista"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to VogueX</title>
        {get_base_styles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VOGUE<span>X</span></div>
            </div>
            <div class="content">
                <h1 class="title">Welcome, {name}.</h1>
                <p class="message">Your journey into the avant-garde world of high fashion begins now. We are thrilled to have you join our exclusive community of trendsetters.</p>
                <p class="message">Discover curated collections, exclusive runway pieces, and personalized style recommendations tailored just for you.</p>
                
                <a href="http://localhost:3000" class="btn">Start Shopping</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 VogueX. All Rights Reserved.</p>
                <p>New York • Paris • Milan • London</p>
                <div style="margin-top: 15px;">
                    <a href="#" class="social-link">Instagram</a>
                    <a href="#" class="social-link">Twitter</a>
                    <a href="#" class="social-link">Pinterest</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return send_html_email(subject, [email], html_content)


def send_order_confirmation_email(order, user_email, user_name, invoice_pdf=None):
    subject = f"Order Confirmed - VogueX #{order.order_id}"
    
    # Build Items HTML
    items_html = ""
    for item in order.items.all():
        img_html = f'<img src="{item.product_image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">' if item.product_image else ''
        items_html += f"""
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                {img_html}
                <span style="font-weight: 500; color: #333;">{item.product_name}</span>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: center; color: #666;">{item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 500; color: #333;">₹{item.price}</td>
        </tr>
        """

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Order Confirmed</title>
        {get_base_styles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VOGUE<span>X</span></div>
            </div>
            <div class="content">
                <h1 class="title" style="color: #4ADE80;">Order Confirmed!</h1>
                <p class="message">Hi {user_name},</p>
                <p class="message">Thank you for your purchase. We are getting your order ready to be shipped.</p>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 24px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="color: #666;">Order ID:</span>
                        <span style="font-weight: bold; color: #000;">#{order.order_id}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #666;">Date:</span>
                        <span style="font-weight: bold; color: #000;">{order.created_at.strftime('%b %d, %Y')}</span>
                    </div>
                </div>

                <h3 style="margin-bottom: 15px; font-weight: 600; font-size: 16px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                    <thead>
                        <tr style="text-align: left; color: #888; font-size: 12px; text-transform: uppercase;">
                            <th style="padding-bottom: 10px;">Item</th>
                            <th style="padding-bottom: 10px; text-align: center;">Qty</th>
                            <th style="padding-bottom: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding-top: 15px; text-align: right; color: #666;">Total Amount:</td>
                            <td style="padding-top: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #000;">₹{order.total_amount}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-top: 24px;">
                    <h4 style="margin-bottom: 10px; font-size: 14px; text-transform: uppercase; color: #888;">Shipping Address</h4>
                    <p style="color: #444; line-height: 1.5; background: #fff; border: 1px solid #eee; padding: 12px; border-radius: 6px;">
                        {order.shipping_address}
                    </p>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:3000/orders/{order.order_id}" class="btn">View Order Details</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 VogueX. All Rights Reserved.</p>
                <p><a href="#">Track Order</a> • <a href="#">Returns</a> • <a href="#">Support</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    
    attachments = []
    if invoice_pdf:
        attachments.append({
            'filename': f'Invoice_{order.order_id}.pdf',
            'content': invoice_pdf,
            'mimetype': 'application/pdf'
        })
        
    return send_html_email(subject, [user_email], html_content, attachments)


def send_order_cancellation_email(order, user_email, user_name):
    subject = f"Order Cancelled - VogueX #{order.order_id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Order Cancelled</title>
        {get_base_styles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VOGUE<span>X</span></div>
            </div>
            <div class="content">
                <h1 class="title" style="color: #EF4444;">Order Cancelled</h1>
                <p class="message">Hi {user_name},</p>
                <p class="message">Your order <strong>#{order.order_id}</strong> has been cancelled as per your request.</p>
                
                <div style="background: #FFF1F2; color: #BE123C; padding: 16px; border-radius: 8px; margin: 20px 0; font-size: 14px;">
                    If you have already paid for this order, the refund process has been initiated and will be reflected in your source account within 5-7 business days.
                </div>

                <a href="http://localhost:3000/shop" class="btn">Continue Shopping</a>
            </div>
            <div class="footer">
                <p>&copy; 2026 VogueX. All Rights Reserved.</p>
                <p>Need help? <a href="#">Contact Support</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_html_email(subject, [user_email], html_content)


def send_payment_failed_email(order, user_email, user_name):
    subject = f"Payment Failed - VogueX #{order.order_id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Failed</title>
        {get_base_styles()}
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VOGUE<span>X</span></div>
            </div>
            <div class="content">
                <h1 class="title" style="color: #F59E0B;">Payment Unsuccessful</h1>
                <p class="message">Hi {user_name},</p>
                <p class="message">We noticed a payment failure for your order <strong>#{order.order_id}</strong>.</p>
                <p class="message">Don't worry, your items are safe. You can retry the payment to complete your purchase.</p>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:3000/checkout?retry={order.order_id}" class="btn">Retry Payment</a>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 VogueX. All Rights Reserved.</p>
                <p>Having trouble? <a href="#">Chat with us</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return send_html_email(subject, [user_email], html_content)
