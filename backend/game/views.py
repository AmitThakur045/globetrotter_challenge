from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import login, logout
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView

from game.enum import LEADERBOARDENUM
from game.utils.user_utils import UserUtils
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
    

class UserFriendCreationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            follower_id = request.data.get('follower_id')
            # validate  if following user_id and follower_id actually exits in our DB or not.
            is_created = UserUtils.create_friendship(user_id=user_id, follower_id=follower_id)
            return Response("success", 202)
        except BaseException:
            return Response({"error": "Something went wring"}, status=500)


class LeaderBoardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_type):
        
        assert event_type in [1, 2], "Event type is not supported"

        """ 
        if Global
            find all user along with there highed return 
        else:
            find all of the user's friends and then return their score 
        """
        
        if event_type == 1:
            users_list = User.objects.all().order_by('highest_score')
        else:
            follower_list = UserUtils.get_user_by_id(user_id=self.request.user_id)
            users_list = User.objects.filter(id__in=follower_list).order_by('highest_score')
        

        Redis Layer: 
        fetch the globalLeaderboard user sorted set ( key user score )

        """ Serialize the object first """
        return Response({ "user_list": users_list}, 201)


