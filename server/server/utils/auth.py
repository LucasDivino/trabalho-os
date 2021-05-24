from rest_framework.authtoken.models import Token
from rest_framework.authentication import BaseAuthentication


class TokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.GET.get('t')
        if not token:
            return None

        try:
            token = Token.objects.get(key=request.GET["t"])
        except Token.DoesNotExist:
            return None

        return (token.user, None)
