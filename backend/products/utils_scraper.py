
import requests
from bs4 import BeautifulSoup
import json
import re

class ScraperService:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
        }

    def scrape_product(self, url):
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return {"error": f"Failed to fetch content (Status: {response.status_code})"}

            soup = BeautifulSoup(response.content, 'html.parser')
            
            data = {
                "title": self._get_title(soup),
                "price": self._get_price(soup),
                "image": self._get_image(soup),
                "description": self._get_description(soup),
                "source_url": url
            }
            
            return data

        except Exception as e:
            return {"error": str(e)}

    def _get_title(self, soup):
        # 1. OpenGraph
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            return og_title["content"]
        
        # 2. H1
        h1 = soup.find("h1")
        if h1:
            return h1.text.strip()
            
        # 3. Title tag
        if soup.title:
            return soup.title.text.strip()
            
        return "Unknown Product"

    def _get_image(self, soup):
        # 1. OpenGraph
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]
            
        # 2. Twitter Card
        twitter_image = soup.find("meta", name="twitter:image")
        if twitter_image and twitter_image.get("content"):
            return twitter_image["content"]
            
        # 3. First large image (heuristic)
        # This is risky, but a fallback.
        return None

    def _get_description(self, soup):
        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            return og_desc["content"]
        
        meta_desc = soup.find("meta", name="description")
        if meta_desc and meta_desc.get("content"):
            return meta_desc["content"]
            
        return ""

    def _get_price(self, soup):
        # 1. Schema.org JSON-LD (Best Standard)
        # Look for <script type="application/ld+json">
        scripts = soup.find_all('script', type='application/ld+json')
        for script in scripts:
            try:
                data = json.loads(script.string)
                # Handle list of schemas or single schema
                if isinstance(data, list):
                    for item in data:
                        price = self._extract_price_from_schema(item)
                        if price: return price
                else:
                    price = self._extract_price_from_schema(data)
                    if price: return price
            except:
                continue
                
        # 2. Heuristic: Look for currency symbols in text near "price" classes
        # Expanded heuristic for Amazon/Myntra/Flipkart specific classes
        price_classes = [
            'a-price-whole', 'a-offscreen', # Amazon
            'pdp-price', # Myntra
            '_30jeq3', '_16Jk6d', # Flipkart
            'price', 'product-price', 'amount' # Generic
        ]
        
        for cls in price_classes:
            tag = soup.find(class_=cls)
            if tag:
                text = tag.get_text(strip=True)
                match = re.search(r'[\d,]+\.?\d*', text)
                if match:
                    try:
                        return float(match.group(0).replace(',', ''))
                    except:
                        continue
        
        # 3. Fallback to regex scan of whole body (Last resort)
        # Avoid this if possible as it's noisy
                    
        return 0.0

    def _extract_price_from_schema(self, data):
        # Check for Product type
        if data.get('@type') in ['Product', 'IndividualProduct']:
            offers = data.get('offers')
            if isinstance(offers, dict):
                return offers.get('price') or offers.get('lowPrice') or offers.get('highPrice')
            elif isinstance(offers, list) and len(offers) > 0:
                return offers[0].get('price') or offers[0].get('lowPrice')
        return None
