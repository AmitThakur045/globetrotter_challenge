from game.models import GameSession, GameSessionQuestionMapping, Question


class GameSessionQuestionMappingUtils:
    """Utility class for creating game session question mappings."""

    @staticmethod
    def create_game_session_question_mapping(game_session: GameSession, question: Question) -> GameSessionQuestionMapping:
        """Create a new game session question mapping."""
        try:
            return GameSessionQuestionMapping.objects.create(
                game_session=game_session,
                question=question
            )
        except Exception as e:
            raise e
