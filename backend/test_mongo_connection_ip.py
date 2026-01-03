import pymongo
import sys

try:
    print("Attempting to connect to MongoDB at 127.0.0.1...")
    client = pymongo.MongoClient("mongodb://127.0.0.1:27017/", serverSelectionTimeoutMS=5000)
    print("Client created. Checking server info...")
    info = client.server_info()
    print("Connected to MongoDB version:", info.get('version'))
except Exception as e:
    print("Failed to connect to MongoDB:", e)
    sys.exit(1)
