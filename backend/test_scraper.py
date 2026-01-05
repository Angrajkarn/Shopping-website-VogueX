
import requests

def test_scraper():
    url = "http://localhost:8080/api/products/scrape/"
    
    # Test with a known product page (e.g., a dummy one or a real one if accessible)
    # Using a generic example. Since we can't easily access live external sites from here reliably without specific URLs, 
    # we will rely on the unit test structure.
    # But let's try a simple example.
    target_url = "https://www.example.com" # Just to check connectivity
    
    try:
        response = requests.post(url, json={"url": target_url})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_scraper()
