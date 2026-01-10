import sys
try:
    import dns
    print(f"dnspython version: {dns.version.version}")
except ImportError:
    print("dnspython NOT installed")

try:
    import pymongo
    print(f"pymongo version: {pymongo.version}")
    from pymongo.uri_parser import parse_uri
    # Test a dummy srv URI to trigger the check
    try:
        parse_uri("mongodb+srv://test:test@cluster0.mongodb.net/test")
        print("SRV URI parsing works")
    except Exception as e:
        print(f"SRV URI parsing failed: {e}")
except ImportError:
    print("pymongo NOT installed")
