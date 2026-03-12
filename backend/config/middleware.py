import traceback
import sys

class TracebackMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        print("!!! ENTERPRISE DIAGNOSTIC: EXCEPTION DETECTED !!!", file=sys.stderr)
        print(f"Path: {request.path}", file=sys.stderr)
        print(f"Method: {request.method}", file=sys.stderr)
        print(f"Headers: {request.headers}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return None
