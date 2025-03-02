from game.utils.user_game_mapping_utils import UserGameMappingUtils
from game.models import Destination, GameSession, GameSessionQuestionMapping, Question


class QuestionUtils:

    @staticmethod
    def create_question(destination: Destination, options: list, correct_city: str) -> Question:
        """Create a new question instance."""

        assert correct_city in options, "Correct city must be one of the options"
        assert len(options) == 4, "There must be 4 options"
        assert destination.city == correct_city, "Correct city must be the same as the destination city"

        return Question.objects.create(
            destination=destination,
            options=options,
            correct_city=destination.city
        )

    @staticmethod
    def check_answer(game_session, question_id, user_answer) -> dict:
        """Check if the user's answer is correct and update the session."""
        try:
            try:
                mapping = GameSessionQuestionMapping.objects.get(game_session=game_session, question_id=question_id)
            except GameSessionQuestionMapping.DoesNotExist:
                return {"error": "Invalid question for this session"}
            
            assert mapping.user_answer == "", "User has already answered this question"

            is_correct = mapping.question.correct_city == user_answer
            mapping.user_answer = user_answer
            mapping.is_correct = is_correct
            mapping.save(update_fields=["user_answer", "is_correct"])

            UserGameMappingUtils(user=game_session.user).update_user_score(game_session, is_correct)
            
            return {"is_correct": is_correct, "correct_answer": mapping.question.correct_city}
        except AssertionError as e:
            return {"message": str(e)}
        except Exception as e:
            raise e
        
    @staticmethod
    def get_questions_by_game_session(game_instance: GameSession) -> list:
        """Retrieve game session associated questions."""
        mappings = GameSessionQuestionMapping.objects.filter(game_session=game_instance)
        return [mapping.question for mapping in mappings] if mappings.exists() else []
