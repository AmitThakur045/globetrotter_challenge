import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (userData) => {
  return api.post('/register/', userData);
};

export const login = (credentials) => {
  return api.post('/login/', credentials);
};

export const startGame = () => {
  return api.get('/game/start/');
};

export const submitAnswer = (gameId, questionId, answer) => {
  return api.post(`/game/${gameId}/submit/`, {
    question_id: questionId,
    answer: answer
  });
};

export const getUserProfile = (username) => {
  return api.get(`/users/${username}/`);
};

export default api;