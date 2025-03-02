import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authUtils';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import './Home.css';

const Home = () => {
    const [showLogin, setShowLogin] = useState(true);
    const navigate = useNavigate();
    const authenticated = isAuthenticated();

    const handleLoginSuccess = () => {
        navigate('/game');
    };

    const handleRegisterSuccess = () => {
        setShowLogin(true);
    };

    const toggleAuthForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                <div className="hero-content">
                    <h1>🧩 The Globetrotter Challenge</h1>
                    <p className="hero-tagline">The Ultimate Travel Guessing Game!</p>

                    <p className="hero-description">
                        Test your knowledge of famous destinations around the world with cryptic clues.
                        Guess correctly to unlock fun facts and trivia about each location!
                    </p>

                    {authenticated ? (
                        <div className="cta-buttons">
                            <button
                                className="primary-button"
                                onClick={() => navigate('/game')}
                            >
                                Start Playing
                            </button>
                            <button
                                className="secondary-button"
                                onClick={() => navigate('/profile')}
                            >
                                View Profile
                            </button>
                        </div>
                    ) : (
                        <div className="cta-buttons">
                            <button
                                className="primary-button"
                                onClick={() => setShowLogin(true)}
                            >
                                Sign In to Play
                            </button>
                            <button
                                className="secondary-button"
                                onClick={() => setShowLogin(false)}
                            >
                                Register Now
                            </button>
                        </div>
                    )}
                </div>

                <div className="hero-image">
                    <div className="globe-illustration">🌍</div>
                </div>
            </div>

            {!authenticated && (
                <div className="auth-section">
                    {showLogin ? (
                        <>
                            <Login onLoginSuccess={handleLoginSuccess} />
                            <p className="auth-toggle">
                                Don't have an account? <button onClick={toggleAuthForm}>Register</button>
                            </p>
                        </>
                    ) : (
                        <>
                            <Register onRegisterSuccess={handleRegisterSuccess} />
                            <p className="auth-toggle">
                                Already have an account? <button onClick={toggleAuthForm}>Login</button>
                            </p>
                        </>
                    )}
                </div>
            )}

            <div className="features-section">
                <h2>How to Play</h2>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Solve Clues</h3>
                        <p>Read cryptic clues about world-famous destinations and guess where they lead.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🏆</div>
                        <h3>Earn Points</h3>
                        <p>Build your score with each correct answer and become a Globetrotter champion.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📚</div>
                        <h3>Learn Facts</h3>
                        <p>Discover interesting facts and trivia about each destination you encounter.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Challenge Friends</h3>
                        <p>Share your score and invite friends to see if they can beat your travel knowledge.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;