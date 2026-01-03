from django.contrib import admin
from .models import UserInteraction

@admin.register(UserInteraction)
class UserInteractionAdmin(admin.ModelAdmin):
    list_display = ('user', 'session_id', 'interaction_type', 'product_id', 'timestamp')
    list_filter = ('interaction_type', 'timestamp')
    search_fields = ('user__email', 'session_id', 'product_id')
    readonly_fields = ('timestamp',)
