from django.urls import path
from .views import RegisterView, LoginView, LogoutView, StartGameView, SubmitAnswerView, UserFriendCreationView, LeaderBoardView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('game/start/', StartGameView.as_view(), name='start_game'),
    path('game/<int:session_id>/', StartGameView.as_view(), name='game'),
    path('game/<int:session_id>/submit/', SubmitAnswerView.as_view(), name='submit_game'),
    path('user/<int:user_id>/friend/', UserFriendCreationView.as_view(), name="user-friend"),
    path('leaderboard/<int:event_type>/', LeaderBoardView.as_view(), name="leaderboard")
]
