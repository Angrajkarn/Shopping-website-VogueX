
import requests
from bs4 import BeautifulSoup
import re
import json

class ScraperService:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def scrape_product(self, url):
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            data = {
                'title': self._extract_title(soup),
                'price': self._extract_price(soup),
                'image': self._extract_image(soup),
                'description': self._extract_description(soup),
                'source_url': url
            }
            
            # Additional Heuristic: Check for JSON-LD (Schema.org)
            json_ld = soup.find('script', type='application/ld+json')
            if json_ld:
                try:
                    schema_data = json.loads(json_ld.string)
                    # Helper to find specific schema type if list
                    if isinstance(schema_data, list):
                        for item in schema_data:
                            if item.get('@type') in ['Product', 'IndividualProduct']:
                                schema_data = item
                                break
                    
                    if schema_data.get('@type') in ['Product', 'IndividualProduct']:
                        data['title'] = schema_data.get('name') or data['title']
                        data['image'] = schema_data.get('image') or data['image']
                        if isinstance(data['image'], list): data['image'] = data['image'][0]
                        data['description'] = schema_data.get('description') or data['description']
                        
                        price = self._extract_price_from_schema(schema_data)
                        if price: data['price'] = price
                except:
                    pass
                    
            return data
        except Exception as e:
            return {'error': str(e)}

    def _extract_title(self, soup):
        og_title = soup.find('meta', property='og:title')
        if og_title: return og_title.get('content')
        h1 = soup.find('h1')
        if h1: return h1.get_text(strip=True)
        return "Unknown Product"

    def _extract_image(self, soup):
        og_image = soup.find('meta', property='og:image')
        if og_image: return og_image.get('content')
        # Try generic product image class
        img = soup.find('img', id='landingImage') # Amazon
        if img: return img.get('src')
        return ""

    def _extract_description(self, soup):
        og_desc = soup.find('meta', property='og:description')
        if og_desc: return og_desc.get('content')
        desc = soup.find('meta', attrs={'name': 'description'})
        if desc: return desc.get('content')
        return ""

    def _extract_price(self, soup):
        # 1. Look for specific IDs/Classes for major sites
        selectors = [
            '#priceblock_ourprice', '#priceblock_dealprice', # Amazon Old
            '.a-price-whole', # Amazon New
            '.pdp-price', # Myntra
            '._30jeq3', # Flipkart
        ]
        
        for sel in selectors:
            tag = soup.select_one(sel)
            if tag:
                text = tag.get_text(strip=True)
                # Cleanup currency symbols
                match = re.search(r'[\d,]+\.?\d*', text)
                if match:
                    try:
                        return float(match.group(0).replace(',', ''))
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
