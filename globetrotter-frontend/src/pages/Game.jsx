import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from '../services/api';
import { isAuthenticated } from '../utils/authUtils';
import GameCard from '../components/Game/GameCard';
import ChallengeModal from '../components/Challenge/ChallengeModal';
import './Game.css';

const Game = () => {
    const [game, setGame] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/');
            return;
        }

        const fetchGame = async () => {
            setLoading(true);
            try {
                const response = await startGame();
                setGame(response.data);
                setScore({ correct: 0, total: response.data.total_questions });
            } catch (err) {
                console.error('Error starting game:', err);
                setError('Failed to start game. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [navigate]);

    const handleAnswered = (isCorrect) => {
        if (isCorrect) {
            setScore(prevScore => ({
                ...prevScore,
                correct: prevScore.correct + 1
            }));
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < game.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowChallengeModal(true);
        }
    };

    const startNewGame = async () => {
        setLoading(true);
        try {
            const response = await startGame();
            setGame(response.data);
            setCurrentQuestionIndex(0);
            setScore({ correct: 0, total: response.data.total_questions });
            setShowChallengeModal(false);
        } catch (err) {
            setError('Failed to start a new game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="game-container loading">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="game-container error">
                <div className="error-message">{error}</div>
                <button onClick={startNewGame} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    if (!game) {
        return null;
    }

    const currentQuestion = game.questions[currentQuestionIndex];

    return (
        <div className="game-container">
            <div className="game-header">
                <h1>Globetrotter Challenge</h1>
                <div className="score-display">
                    Score: <span className="score-value">{score.correct}</span> / {score.total}
                </div>
            </div>

            <GameCard
                game={game}
                question={currentQuestion}
                onAnswered={handleAnswered}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={game.total_questions}
                onNextQuestion={handleNextQuestion}
            />

            <div className="game-actions">
                <button
                    className="challenge-button"
                    onClick={() => setShowChallengeModal(true)}
                >
                    Challenge a Friend
                </button>
            </div>

            {showChallengeModal && (
                <ChallengeModal
                    score={score}
                    onClose={() => setShowChallengeModal(false)}
                />
            )}
        </div>
    );
};

export default Game;