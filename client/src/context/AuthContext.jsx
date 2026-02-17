import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('access_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const response = await api.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const { access_token, ...userData } = response.data;
        localStorage.setItem('access_token', access_token);
        // We can fetch full user details or use what's returned
        setUser(userData);
        return response.data;
    };

    const register = async (name, email, password, phone, language) => {
        const response = await api.post('/auth/register', { name, email, password, phone, language }, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Auto-login logic
        const { access_token, ...userData } = response.data;
        localStorage.setItem('access_token', access_token);
        setUser(userData);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        window.location.href = '/auth';
    };

    const loginWithFirebase = async (idToken) => {
        const response = await api.post('/auth/firebase-login', { idToken }, {
            headers: { 'Content-Type': 'application/json' }
        });
        const { access_token, ...userData } = response.data;
        localStorage.setItem('access_token', access_token);
        setUser(userData);
        return response.data;
    };

    const updateProfile = async (userData) => {
        const response = await api.put('/users/me', userData);
        setUser(prev => ({ ...prev, ...response.data }));
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loginWithFirebase, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
