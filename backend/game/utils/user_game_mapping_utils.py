from game.models import GameSession, UserGameMapping


class UserGameMappingUtils:

    def __init__(self, user):
        self.user = user

    def update_user_score(self, game_session: GameSession, is_correct: bool):
        """Update the user's score."""
        try:
            from game.utils.game_session_utils import GameSessionUtils
            user_game_mapping, created = UserGameMapping.objects.get_or_create(
                user=self.user,
                game_session=game_session
            )
            score = None
            if is_correct:
                score = user_game_mapping.score + 1
                user_game_mapping.score += 1
                user_game_mapping.save(update_fields=["score"])

            # check if all the questions have answer (game_session)
            is_marked = GameSessionUtils().is_all_question_answer(game_session)

            # check if it the highest score
            if is_marked and self.user.highest_score < score:
                self.user.highest_score = score
                self.user.save()

        except Exception as e:
            raise e