from game.models import User


class UserUtils:

    @staticmethod
    def get_user_by_id(user_id):
        """Retrieve user instance by ID."""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
