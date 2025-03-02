from rest_framework import serializers
from django.contrib.auth import authenticate

from game.utils.game_session_utils import GameSessionUtils
from .models import Destination, GameSession, Question, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid username or password")
        return user


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'country', 'clues', 'fun_facts', 'trivia']


class QuestionSerializer(serializers.ModelSerializer):
    destination = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = ('id', 'options', 'destination')

    def get_destination(self, obj):
        return DestinationSerializer(obj.destination).data


class GameSessionSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    total_questions = serializers.SerializerMethodField()

    class Meta:
        model = GameSession
        fields = ('id', 'questions', 'total_questions')

    def get_questions(self, obj):
        """Fetch and serialize questions associated with this game session"""
        questions = GameSessionUtils.get_game_associated_questions(obj)
        return QuestionSerializer(questions, many=True).data

    def get_total_questions(self, obj):
        """Return the count of questions for this session"""
        return len(GameSessionUtils.get_game_associated_questions(obj))
