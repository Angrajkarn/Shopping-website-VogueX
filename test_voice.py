import requests
import json

url = "http://localhost:8000/api/products/voice/"
tests = [
    {"command": "go to the cart please", "context": {"path": "/"}},
    {"command": "show me some men shirts", "context": {"path": "/shop"}},
    {"command": "add this to my bag", "context": {"productId": "123", "path": "/product/test"}}
]

for test in tests:
    print(f"Testing: {test['command']}")
    r = requests.post(url, json=test)
    print(f"Status: {r.status_code}")
    print(f"Response: {json.dumps(r.json(), indent=2)}")
    print("-" * 20)
