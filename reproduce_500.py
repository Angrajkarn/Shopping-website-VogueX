import requests
import sys

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

print("Testing internal reachability with browser-like headers...")
try:
    r = requests.get('http://localhost:8000/api/products/', headers=headers, timeout=10)
    print(f"Status Code: {r.status_code}")
    if r.status_code != 200:
        print("--- RESPONSE START ---")
        print(r.text[:2000])
        print("--- RESPONSE END ---")
    else:
        print("Success! Received 200 OK.")
except Exception as e:
    print(f"ERROR: {e}")
