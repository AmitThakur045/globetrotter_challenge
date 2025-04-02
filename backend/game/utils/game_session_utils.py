import random
from game.utils.game_session_question_mapping_utils import GameSessionQuestionMappingUtils
from game.utils.question_utils import QuestionUtils
from game.models import GameSession, Destination, GameSessionQuestionMapping
from game.constants import CITIS


class GameSessionUtils:

    @staticmethod
    def create_game_session(user) -> GameSession:
        """Create a new game session for the user and generate 5 questions."""
        try:
            session = GameSession.objects.create(user=user)

            destinations = list(Destination.objects.all())
            selected_destinations = random.sample(destinations, 5)

            for destination in selected_destinations:
                options = random.sample([city for city in CITIS if city != destination.city], 3)
                options.append(destination.city)
                random.shuffle(options)

                question = QuestionUtils.create_question(destination, options, destination.city)
                GameSessionQuestionMappingUtils.create_game_session_question_mapping(session, question)

            return session
        except Exception as e:
            raise e

    @staticmethod
    def get_game_session(session_id: int) -> GameSession:
        """Retrieve game session by ID."""
        try:
            return GameSession.objects.get(id=session_id)
        except GameSession.DoesNotExist:
            return None
    
    @staticmethod
    def get_game_associated_questions(game_instance: GameSession) -> list:
        """Retrieve game session associated questions."""
        try:
            return QuestionUtils.get_questions_by_game_session(game_instance)
        except GameSessionQuestionMapping.DoesNotExist:
            return None
        
    @staticmethod
    def is_all_question_answer(game_instance: GameSession) -> bool:
        """ return True if marked all question else False """
        try:
            is_marked = GameSessionQuestionMapping.objects.filter(
                game_session=game_instance,
                user_answer__isnull=True
            )
            return not len(is_marked) 
        except BaseException:
            return False