from django.urls import path
from .views import TrackEventView, HistoryView, InspiredBySearchView, StylistView

urlpatterns = [
    path('track/', TrackEventView.as_view(), name='track_event'),
    path('history/', HistoryView.as_view(), name='history_view'),
    path('inspired/', InspiredBySearchView.as_view(), name='inspired_view'),
    path('stylist/', StylistView.as_view(), name='stylist_view'),
]
