import React, { useState } from 'react';
import { submitAnswer } from '../../services/api';
import AnswerFeedback from './AnswerFeedback';
import './GameCard.css';

const GameCard = ({ game, question, onAnswered, currentQuestionIndex, totalQuestions, onNextQuestion }) => {
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSelectAnswer = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleSubmitAnswer = async () => {
        if (!selectedAnswer) return;

        setLoading(true);
        try {
            const response = await submitAnswer(game.id, question.id, selectedAnswer);
            const result = response.data;

            setFeedback({
                isCorrect: result?.is_correct,
                correctAnswer: result?.correct_answer,
                destination: question?.destination
            });

            if (onAnswered) {
                onAnswered(result?.is_correct);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="game-card">
            {feedback ? (
                <AnswerFeedback
                    feedback={feedback}
                    onNext={() => {
                        setFeedback(null);
                        setSelectedAnswer('');
                        onNextQuestion();
                    }}
                />
            ) : (
                <>
                    <div className="progress-indicator">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </div>

                    <div className="clues-container">
                        <h3>Where is this place?</h3>
                        {question.destination.clues.map((clue, index) => (
                            <div key={index} className="clue">
                                <span className="clue-number">{index + 1}</span>
                                <p>{clue}</p>
                            </div>
                        ))}
                    </div>

                    <div className="options-container">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                                onClick={() => handleSelectAnswer(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <button
                        className="submit-answer-button"
                        disabled={!selectedAnswer || loading}
                        onClick={handleSubmitAnswer}
                    >
                        {loading ? 'Submitting...' : 'Submit Answer'}
                    </button>
                </>
            )}
        </div>
    );
};

export default GameCard;