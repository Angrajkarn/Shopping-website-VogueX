# MongoDB Setup Guide

It seems MongoDB is not running or not installed on your system. The backend requires MongoDB to function.

## 1. If you HAVE MongoDB installed:
1. Open a terminal or Command Prompt.
2. Run the following command to start the database server:
   ```cmd
   mongod --dbpath="C:\data\db"
   ```
   *(Note: You might need to create `C:\data\db` first or specify a different path).*
3. If `mongod` is not found, you need to find where you installed it (usually `C:\Program Files\MongoDB\Server\X.X\bin`) and run `mongod.exe` from there.

## 2. If you do NOT have MongoDB installed:
1. Download MongoDB Community Server from: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install it. **Make sure to check "Install MongoDB as a Service"** during installation.
3. Once installed, it should run automatically on `localhost:27017` or `127.0.0.1:27017`.

## 3. Verifying Connection
After starting MongoDB, you can use the `test_mongo_connection_ip.py` script I created to verify it:
```cmd
python backend/test_mongo_connection_ip.py
```
