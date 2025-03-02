from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import login, logout
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from game.utils.game_session_utils import GameSessionUtils
from game.utils.question_utils import QuestionUtils
from .models import User
from .serializers import GameSessionSerializer, UserSerializer, RegisterSerializer, LoginSerializer

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})

      
class LogoutView(APIView):
    def post(self, request):
        try:
            request.user.auth_token.delete()
            logout(request)
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class StartGameView(APIView):
    """Start a new game session."""
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id=None):
        user = request.user

        game_session = (
            GameSessionUtils.get_game_session(session_id) 
            if session_id else GameSessionUtils.create_game_session(user)
        )

        assert game_session, "Failed to create / get game session"
        serialized_game = GameSessionSerializer(game_session)
        return Response(serialized_game.data)


class SubmitAnswerView(APIView):
    """Submit an answer and check correctness."""
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        user = request.user
        question_id = request.data.get("question_id")
        user_answer = request.data.get("answer")

        game_session = GameSessionUtils.get_game_session(session_id)

        assert game_session and game_session.user == user, "Invalid session ID"

        if not game_session:
            return Response({"error": "Invalid session ID"}, status=400)

        result = QuestionUtils.check_answer(game_session, question_id, user_answer)
        return Response(result)