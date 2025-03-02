import React from 'react';
import './Destination.css';

const Destination = ({ destination }) => {
    return (
        <div className="destination-card">
            <div className="destination-header">
                <h2>{destination.name}</h2>
                <span className="country-tag">{destination.country}</span>
            </div>

            <div className="destination-section">
                <h3>Fun Facts</h3>
                <ul className="fact-list">
                    {destination.fun_facts.map((fact, index) => (
                        <li key={`fun-${index}`} className="fact-item">{fact}</li>
                    ))}
                </ul>
            </div>

            <div className="destination-section">
                <h3>Trivia</h3>
                <ul className="fact-list">
                    {destination.trivia.map((item, index) => (
                        <li key={`trivia-${index}`} className="fact-item">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Destination;