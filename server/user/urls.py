from django.urls import path
from rest_framework.routers import DefaultRouter
from user.views import CustomAuthToken, UserCreateAPIView
from user.models import Lugar
from server.utils.generic import genericViewSet

router = DefaultRouter()

router.register('places', genericViewSet(Lugar))

urlpatterns = [
    path('auth', CustomAuthToken.as_view()),
    path('register', UserCreateAPIView.as_view())
]

urlpatterns += router.urls