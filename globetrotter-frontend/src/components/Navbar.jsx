import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeUserData, getUserData, isAuthenticated } from '../utils/authUtils';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const user = getUserData();

    const handleLogout = () => {
        removeUserData();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/" className="navbar-logo">
                    🧩 Globetrotter
                </Link>
            </div>

            <div className="navbar-menu">
                {authenticated ? (
                    <>
                        <Link to="/game" className="nav-link">Play Game</Link>
                        <Link to="/profile" className="nav-link">My Profile</Link>
                        <div className="user-menu">
                            <span className="username">{user?.username}</span>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link register-link">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;