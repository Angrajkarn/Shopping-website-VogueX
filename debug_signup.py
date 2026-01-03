import requests
import json

url = "http://localhost:8000/api/auth/signup/"
data = {
    "email": "debug_user@example.com",
    "password": "password123",
    "first_name": "Debug",
    "last_name": "User"
}

print(f"Sending POST to {url}")
try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Headers:", response.headers)
    print("Raw Response Content:")
    print(response.text)
    
    try:
        print("JSON Content:")
        print(json.dumps(response.json(), indent=2))
    except:
        print("Response is not JSON")
        
except Exception as e:
    print(f"Error: {e}")
