from pymongo import MongoClient
import sys

uri = "mongodb://localhost:27017/"
print(f"Attempting to connect to {uri}...")

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    # Force a connection verification
    client.admin.command('ping')
    print("SUCCESS: Connected to MongoDB!")
    print(f"Server info: {client.server_info()}")
except Exception as e:
    print(f"FAILURE: Could not connect to MongoDB.")
    print(f"Error: {e}")
    sys.exit(1)
