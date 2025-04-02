from game.models import User, UserFriendMapping
from django.db import transaction

class UserUtils:

    @staticmethod
    def get_user_by_id(user_id):
        """Retrieve user instance by ID."""
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

    @staticmethod
    def create_friendship(user_id, follower_id):
        """ create a friendshipt between two user """
        try:
            user_frinedship_mapping = UserFriendMapping.objects.filter(
                user_id=user_id,
                follower_id=follower_id
            )
            assert not len(user_frinedship_mapping), "They are already friends"

            with transaction.atomic():
                first_mapping = UserFriendMapping.objects.create(
                    user_id=user_id,
                    follower_id=follower_id
                )
                second_mapping = UserFriendMapping.objects.create(
                    user_id=follower_id,
                    follower_id=user_id,
                )
            return True
        except AssertionError as e:
            return True
        except BaseException as e:
            print("Error while creating Frintend", e)
            return False
        
    def find_all_friends(user_id):
        try:
            return UserFriendMapping.objects.filter(
                user_id=user_id
            ).only('follower_id')
        except BaseException as e:
            return []