from decimal import Decimal
import random

def calculate_seller_score(seller_profile):
    """
    Advanced Algorithm to calculate Seller Score (0-100).
    Factors:
    - Rating (40%)
    - Return Rate (30%)
    - Sales Volume (20%)
    - Account Age/Reliability (10%)
    """
    
    # 1. Rating Score (Max 40)
    # 5 stars = 40 pts, 1 star = 8 pts
    rating_score = (seller_profile.rating / 5.0) * 40
    
    # 2. Return Rate Score (Max 30)
    # 0% returns = 30 pts, 10% returns = 0 pts (linear penalty)
    return_rate = seller_profile.return_rate # 0.0 to 100.0
    return_score = max(0, 30 - (return_rate * 3))
    
    # 3. Sales Volume Score (Max 20)
    # Logarithmic-ish scale or simple threshold
    # < 10 sales = 5, 10-100 = 10, 100-1000 = 15, >1000 = 20
    sales = seller_profile.total_sales
    if sales > 1000:
        sales_score = 20
    elif sales > 100:
        sales_score = 15
    elif sales > 10:
        sales_score = 10
    else:
        sales_score = 5
        
    # 4. Reliability (Base 10)
    base_score = 10
    
    total_score = int(rating_score + return_score + sales_score + base_score)
    total_score = min(100, max(0, total_score))
    
    return total_score

def predict_inventory_demand(product_id, current_stock, daily_sales_avg):
    """
    Predicts if stock will run out in next 7 days using simple linear projection.
    """
    predicted_sales_next_7_days = daily_sales_avg * 7
    
    status = "HEALTHY"
    confidence = 0.95
    
    if current_stock == 0:
        status = "OUT_OF_STOCK"
    elif current_stock < predicted_sales_next_7_days:
        status = "CRITICAL_LOW"
        confidence = 0.98
    elif current_stock < (predicted_sales_next_7_days * 1.5):
        status = "LOW_RISK"
        confidence = 0.85
        
    return {
        "product_id": product_id,
        "current_stock": current_stock,
        "predicted_demand_7d": predicted_sales_next_7_days,
        "status": status,
        "restock_suggested": status in ["OUT_OF_STOCK", "CRITICAL_LOW", "LOW_RISK"]
    }

def fraud_order_check(order_amount, user_history_score):
    """
    Heuristic check for fraud.
    """
    risk_level = "LOW"
    
    if order_amount > 50000: # High value
        risk_level = "MEDIUM"
        if user_history_score < 10: # New/Bad user
            risk_level = "HIGH"
            
    return risk_level
