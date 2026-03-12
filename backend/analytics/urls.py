from django.urls import path
from .views import (
    TrackEventView, 
    PulseTrackView,
    AffinityProfileView,
    DynamicLayoutView,
    HistoryView, 
    InspiredBySearchView, 
    StylistView, 
    CollaborativeRecommendationsView, 
    PersonalizedRecommendationsView
)

urlpatterns = [
    path('track/', TrackEventView.as_view(), name='track_event'),
    path('pulse/', PulseTrackView.as_view(), name='pulse_track'),
    path('affinity/', AffinityProfileView.as_view(), name='affinity_profile'),
    path('layout/', DynamicLayoutView.as_view(), name='dynamic_layout'),
    path('history/', HistoryView.as_view(), name='history_view'),
    path('inspired/', InspiredBySearchView.as_view(), name='inspired_view'),
    path('stylist/', StylistView.as_view(), name='stylist_view'),
    path('recommendations/collaborative/', CollaborativeRecommendationsView.as_view(), name='collab_recs'),
    path('recommendations/personalized/', PersonalizedRecommendationsView.as_view(), name='personalized_recs'),
]
