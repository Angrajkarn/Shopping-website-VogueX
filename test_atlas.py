import pymongo
from urllib.parse import quote_plus
import sys

# New credentials
username = "karnkumar5522_db_user"
password = "BiOz7wS6cZikymZS"
uri = "mongodb+srv://karnkumar5522_db_user:BiOz7wS6cZikymZS@deo1.wptvfoy.mongodb.net/?appName=deo1"

print(f"Testing with provided URI...")

try:
    client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=10000)
    info = client.server_info()
    print("SUCCESS!")
    print(f"MongoDB version: {info.get('version')}")
except Exception as e:
    print(f"FAILED: {e}")
    sys.exit(1)
