import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChallengeModal from '../components/Challenge/ChallengeModal';
import './Profile.css';

function Profile({ user, token }) {
    const [stats, setStats] = useState({
        gamesPlayed: 0,
        correctAnswers: 0,
        totalAnswers: 0
    });
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && token) {
            fetchUserStats();
        }
    }, [user, token]);

    const fetchUserStats = async () => {
        try {
            setIsLoading(true);
            const statsData = {
                gamesPlayed: 12,
                correctAnswers: 32,
                totalAnswers: 60
            };

            setStats(statsData);
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateAccuracy = () => {
        if (stats.totalAnswers === 0) return 0;
        return Math.round((stats.correctAnswers / stats.totalAnswers) * 100);
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1 className="profile-title">
                    {user?.first_name ? `${user.first_name}'s Profile` : `${user?.username}'s Profile`}
                </h1>

                {isLoading ? (
                    <div className="loading-section">
                        <p>Loading stats...</p>
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card games-played">
                                <h3 className="stat-label">Games Played</h3>
                                <p className="stat-value">{stats.gamesPlayed}</p>
                            </div>
                            <div className="stat-card correct-answers">
                                <h3 className="stat-label">Correct Answers</h3>
                                <p className="stat-value">{stats.correctAnswers}</p>
                            </div>
                            <div className="stat-card accuracy">
                                <h3 className="stat-label">Accuracy</h3>
                                <p className="stat-value">{calculateAccuracy()}%</p>
                            </div>
                        </div>

                        <div className="actions-container">
                            <button
                                onClick={() => setShowChallengeModal(true)}
                                className="challenge-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                Challenge a Friend
                            </button>

                            <Link to="/game" className="play-button">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                Play New Game
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <div className="history-card">
                <h2 className="history-title">Recent Games</h2>

                <div className="table-container">
                    <table className="games-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Score</th>
                                <th>Accuracy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mar 1, 2025</td>
                                <td>8/10</td>
                                <td>80%</td>
                            </tr>
                            <tr>
                                <td>Feb 28, 2025</td>
                                <td>7/10</td>
                                <td>70%</td>
                            </tr>
                            <tr>
                                <td>Feb 25, 2025</td>
                                <td>9/10</td>
                                <td>90%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {showChallengeModal && (
                <ChallengeModal
                    onClose={() => setShowChallengeModal(false)}
                    user={user}
                    stats={stats}
                />
            )}
        </div>
    );
}

export default Profile;