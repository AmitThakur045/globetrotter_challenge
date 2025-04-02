from django.contrib.auth.models import AbstractUser
from django.db import models


class Destination(models.Model):
    id = models.AutoField(primary_key=True)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    clues = models.JSONField(null=False, default=dict)
    fun_facts = models.JSONField(null=False, default=dict)
    trivia = models.JSONField(null=False, default=dict)  

    def __str__(self):
        return "Destination: " + " in " + self.city + ", " + self.country
    

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    options = models.JSONField(null=False, default=list)
    correct_city = models.CharField(max_length=100)


class GameSession(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)

    def __str__(self):
        return "Game session for user: " + self.user.username


class GameSessionQuestionMapping(models.Model):
    id = models.AutoField(primary_key=True)
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user_answer = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return "Game session question mapping for game session: " + self.game_session.id + " and question: " + self.question.id


class UserGameMapping(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)

    def __str__(self):
        return "User game mapping for user: " + self.user.username + " and game session: " + self.game_session.id
    

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    highest_score = models.IntegerField(default=0, blank=None, db_column="highest_score")

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_permissions",
        blank=True
    )

    def __str__(self):
        return "User: " + self.username

class UserFriendMapping(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE, related_name="main_user") 
    follower = models.ForeignKey('User', on_delete=models.CASCADE, related_name="user_follower")

    class meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'follower'], name='unique_friend'),
        ]

    def __str__(self):
        return "Friends Table: " + self.user.username + " - " + self.follower.username
    

