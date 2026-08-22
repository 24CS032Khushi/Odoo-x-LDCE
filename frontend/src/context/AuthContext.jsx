import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('globetrotter_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('globetrotter_token');
      const storedUser = localStorage.getItem('globetrotter_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await api.get('/users/me');
          if (res.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('globetrotter_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session verification failed, logging out:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen to unauthorized events from API client
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      api.setToken(userToken);
      localStorage.setItem('globetrotter_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Login failed');
  };

  const signup = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    if (res.success && res.data) {
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      api.setToken(userToken);
      localStorage.setItem('globetrotter_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Signup failed');
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    api.setToken(null);
    localStorage.removeItem('globetrotter_user');
  }, []);

  const updateProfile = async (data) => {
    const res = await api.put('/users/me', data);
    if (res.success && res.data.user) {
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('globetrotter_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw new Error('Update profile failed');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
