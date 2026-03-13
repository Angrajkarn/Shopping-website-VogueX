import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import re_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

django_asgi_app = get_asgi_application()

from admin_panel import consumers as admin_consumers
from collaboration import consumers as collaboration_consumers

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r'ws/admin/dashboard/$', admin_consumers.AdminDashboardConsumer.as_asgi()),
                re_path(r'ws/collaboration/(?P<session_id>[\w-]+)/$', collaboration_consumers.ShoppingSessionConsumer.as_asgi()),
            ])
        )
    ),
})
