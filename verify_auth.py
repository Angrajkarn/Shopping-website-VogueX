import requests
import json

BASE_URL = "http://localhost:8000/api/users"

def test_send_otp():
    print("Testing Send OTP...")
    url = f"{BASE_URL}/auth/otp/send/"
    data = {"email": "test@example.com"}
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("[SUCCESS] Send OTP Success")
            return response.json().get("debug_otp")
        else:
            print(f"[FAILED] Send OTP Failed: {response.text}")
    except Exception as e:
        print(f"[ERROR] Send OTP Error: {e}")
    return None

def test_verify_otp(otp):
    print(f"Testing Verify OTP with code {otp}...")
    url = f"{BASE_URL}/auth/otp/verify/"
    data = {"email": "test@example.com", "otp": otp}
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("[SUCCESS] Verify OTP Success")
            print(f"Token: {response.json().get('access')[:20]}...")
        else:
            print(f"[FAILED] Verify OTP Failed: {response.text}")
    except Exception as e:
        print(f"[ERROR] Verify OTP Error: {e}")

def test_forgot_password():
    print("Testing Forgot Password...")
    url = f"{BASE_URL}/auth/forgot-password/"
    data = {"email": "test@example.com"}
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            print("[SUCCESS] Forgot Password Success")
            return response.json().get("debug_otp")
        else:
            print(f"[FAILED] Forgot Password Failed: {response.text}")
    except Exception as e:
        print(f"[ERROR] Forgot Password Error: {e}")
    return None

if __name__ == "__main__":
    print("--- Starting Backend Verification ---")
    otp = test_send_otp()
    if otp:
        test_verify_otp(otp)
    
    reset_otp = test_forgot_password()
    print("--- Verification Complete ---")
