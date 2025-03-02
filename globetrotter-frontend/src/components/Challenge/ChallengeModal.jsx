import React, { useState, useRef } from 'react';
import { getUserData } from '../../utils/authUtils';
import './ChallengeModal.css';

const ChallengeModal = ({ score, onClose }) => {
    const [copied, setCopied] = useState(false);
    const shareCardRef = useRef(null);
    const user = getUserData();

    // Generate a unique invitation link
    const invitationLink = `${window.location.origin}/invite/${user?.username || 'player'}`;

    const handleGenerateImage = async () => {
        if (!shareCardRef.current) return;

        try {
            const shareText = encodeURIComponent(`I scored ${score.correct} out of ${score.total} in Globetrotter Challenge! Can you beat me? Play here: ${invitationLink}`);
            const whatsappLink = `https://wa.me/?text=${shareText}`;
            window.open(whatsappLink, '_blank');
        } catch (error) {
            console.error('Error generating share image:', error);
        }
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(invitationLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Error copying text: ', err));
    };

    return (
        <div className="challenge-modal-backdrop">
            <div className="challenge-modal">
                <button className="close-button" onClick={onClose}>×</button>

                <h2>Challenge a Friend!</h2>

                <div className="share-card" ref={shareCardRef}>
                    <div className="share-card-header">
                        <span className="app-logo">🧩 Globetrotter Challenge</span>
                    </div>

                    <div className="share-card-content">
                        <h3>{user?.username || 'Player'} challenges you!</h3>
                        <p className="score-display">
                            I scored <span className="score-highlight">{score.correct} out of {score.total}</span>
                        </p>
                        <p className="challenge-text">Think you can beat me?</p>
                    </div>

                    <div className="share-card-footer">
                        <span className="invite-cta">Tap to play!</span>
                    </div>
                </div>

                <div className="invite-options">
                    <div className="invite-link-container">
                        <input
                            type="text"
                            value={invitationLink}
                            readOnly
                            className="invite-link-input"
                        />
                        <button
                            className="copy-link-button"
                            onClick={copyInviteLink}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <button
                        className="whatsapp-share-button"
                        onClick={handleGenerateImage}
                    >
                        Share on WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChallengeModal;