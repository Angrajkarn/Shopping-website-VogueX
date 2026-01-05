
def get_welcome_email_html(email):
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
            body {{
                font-family: 'Plus Jakarta Sans', sans-serif;
                background-color: #f4f4f5;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            }}
            .header {{
                background-color: #111111;
                padding: 40px;
                text-align: center;
                background-image: radial-gradient(circle at center, #2a2a2a 1px, transparent 1px);
                background-size: 20px 20px;
            }}
            .logo {{
                color: #ffffff;
                font-family: 'Playfair Display', serif;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: -1px;
                margin: 0;
            }}
            .logo span {{
                color: #8b5cf6;
            }}
            .content {{
                padding: 40px;
                color: #333333;
            }}
            .heading {{
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                font-weight: 700;
                color: #111111;
                margin-bottom: 20px;
                text-align: center;
            }}
            .hero-image {{
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 12px;
                margin-bottom: 30px;
            }}
            .text {{
                font-size: 16px;
                line-height: 1.6;
                color: #555555;
                margin-bottom: 20px;
            }}
            .feature-grid {{
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 30px 0;
            }}
            .feature {{
                background: #f9fafb;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
            }}
            .feature-icon {{
                font-size: 24px;
                margin-bottom: 10px;
                display: block;
            }}
            .feature-title {{
                font-weight: 600;
                font-size: 14px;
                color: #111111;
            }}
            .button {{
                display: block;
                width: 200px;
                margin: 30px auto;
                background-color: #111111;
                color: #ffffff;
                text-decoration: none;
                text-align: center;
                padding: 16px 0;
                border-radius: 30px;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 0.5px;
                transition: background-color 0.3s;
            }}
            .button:hover {{
                background-color: #333333;
            }}
            .footer {{
                background-color: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #eeeeee;
                font-size: 12px;
                color: #888888;
            }}
            .social-links {{
                margin-bottom: 20px;
            }}
            .social-links a {{
                color: #111111;
                margin: 0 10px;
                text-decoration: none;
                font-weight: 600;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="logo">VOGUE<span>X</span></h1>
            </div>
            <div class="content">
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" alt="Fashion" class="hero-image">
                
                <h2 class="heading">Welcome to the Revolution</h2>
                
                <p class="text">
                    Hello fashionista ({email}),
                </p>
                <p class="text">
                    You've just unlocked exclusive access to the world's most cutting-edge fashion platform. 
                    Get ready for daily curated drops, AI-driven style recommendations, and insider-only flash sales.
                </p>

                <div class="feature-grid">
                    <div class="feature">
                        <span class="feature-icon">✨</span>
                        <div class="feature-title">Early Access</div>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🤖</span>
                        <div class="feature-title">AI Styling</div>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">💎</span>
                        <div class="feature-title">Premium Drops</div>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🚀</span>
                        <div class="feature-title">Express Delivery</div>
                    </div>
                </div>

                <a href="http://localhost:3000/shop" class="button">EXPLORE COLLECTION</a>
                
                <p class="text" style="text-align: center; font-size: 14px; margin-top: 30px;">
                    <em>"Style is a way to say who you are without having to speak."</em>
                </p>
            </div>
            <div class="footer">
                <div class="social-links">
                    <a href="#">Instagram</a> • <a href="#">Twitter</a> • <a href="#">TikTok</a>
                </div>
                <p>
                    You received this email because you subscribed to the VogueX newsletter.<br>
                    © 2024 VogueX Fashion. All rights reserved.
                </p>
                <p>123 Fashion Ave, Design District, NY 10001</p>
            </div>
        </div>
    </body>
    </html>
    """
