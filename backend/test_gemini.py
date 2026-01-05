import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key present: {bool(api_key)}")

if api_key:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    prompt = {
        "contents": [{
            "parts": [{
                "text": "Hello, are you working?"
            }]
        }]
    }
    try:
        response = requests.post(url, json=prompt, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No API Key found in environment.")
