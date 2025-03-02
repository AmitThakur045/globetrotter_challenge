export const setUserData = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
};

export const getUserData = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const removeUserData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

export const isAuthenticated = () => {
    return !!getToken();
};