import React, { useEffect, useRef } from 'react';
import './AnswerFeedback.css';
import confetti from 'canvas-confetti';

const AnswerFeedback = ({ feedback, onNext }) => {
    const { isCorrect, correctAnswer, destination } = feedback;
    const confettiRef = useRef(null);

    useEffect(() => {
        if (isCorrect && confettiRef.current) {
            const canvas = confettiRef.current;
            const myConfetti = confetti.create(canvas, {
                resize: true,
                useWorker: true
            });

            myConfetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [isCorrect]);

    const getRandomFact = () => {
        const facts = [...destination.fun_facts, ...destination.trivia];
        const randomIndex = Math.floor(Math.random() * facts.length);
        return facts[randomIndex];
    };

    return (
        <div className={`feedback-container ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
                <canvas
                    ref={confettiRef}
                    className="confetti-canvas"
                ></canvas>
            ) : null}

            <div className="feedback-content">
                <div className="feedback-icon">
                    {isCorrect ? (
                        <span className="correct-icon">✓</span>
                    ) : (
                        <span className="incorrect-icon">✗</span>
                    )}
                </div>

                <h2 className="feedback-title">
                    {isCorrect ? 'Correct!' : 'Not quite right...'}
                </h2>

                <p className="feedback-message">
                    {isCorrect
                        ? `Great job! You correctly identified ${correctAnswer}.`
                        : `The correct answer was ${correctAnswer}.`}
                </p>

                <div className="fact-box">
                    <h3>Did you know?</h3>
                    <p>{getRandomFact()}</p>
                </div>

                <button className="next-button" onClick={onNext}>
                    Next Question
                </button>
            </div>
        </div>
    );
};

export default AnswerFeedback;