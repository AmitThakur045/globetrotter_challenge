import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Game from './pages/Game';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { getUserData, getToken } from './utils/authUtils';
import './App.css';

function App() {
  const [user, setUser] = useState(getUserData());
  const [token, setToken] = useState(getToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUserData();
    const storedToken = getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (isLoading) return <div className="loading-container">Loading...</div>;
    return user && token ? children : <Navigate to="/login" />;
  };

  return (
    <div className="app">
      <Navbar user={user} setUser={setUser} setToken={setToken} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home user={user} token={token} />} />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game user={user} token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <Game user={user} token={token} />
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile user={user} token={token} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" /> : <Login setUser={setUser} setToken={setToken} />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register setUser={setUser} setToken={setToken} />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;