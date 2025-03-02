from game.models import GameSession, UserGameMapping


class UserGameMappingUtils:

    def __init__(self, user):
        self.user = user

    def update_user_score(self, game_session: GameSession, is_correct: bool):
        """Update the user's score."""
        try:
            user_game_mapping, created = UserGameMapping.objects.get_or_create(
                user=self.user,
                game_session=game_session
            )
            if is_correct:
                user_game_mapping.score += 1
                user_game_mapping.save(update_fields=["score"])

        except Exception as e:
            raise e