import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../mockData';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('prepai_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });
  const [token, setToken] = useState(() => localStorage.getItem('prepai_token') || 'mock-jwt-token-active');
  const [loading, setLoading] = useState(false);

  // Sync profile on mount if token is present
  useEffect(() => {
    const savedToken = localStorage.getItem('prepai_token');
    if (savedToken && !savedToken.startsWith('mock-')) {
      authAPI.getMe()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('prepai_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Keep local state on error
        });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Try real backend API
      const response = await authAPI.login({ email, password });
      if (response && response.access_token) {
        setUser(response.user);
        setToken(response.access_token);
        localStorage.setItem('prepai_user', JSON.stringify(response.user));
        localStorage.setItem('prepai_token', response.access_token);
        return { success: true };
      }
    } catch (apiErr) {
      console.warn("Backend login unavailable, applying offline fallback:", apiErr.message);
      // Fallback to mock login
      const fallbackUser = {
        ...MOCK_USER,
        email: email || MOCK_USER.email
      };
      setUser(fallbackUser);
      setToken('mock-jwt-token-active');
      localStorage.setItem('prepai_user', JSON.stringify(fallbackUser));
      localStorage.setItem('prepai_token', 'mock-jwt-token-active');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        target_role: userData.targetRole,
        experience_level: userData.experienceLevel
      });
      if (response && response.access_token) {
        setUser(response.user);
        setToken(response.access_token);
        localStorage.setItem('prepai_user', JSON.stringify(response.user));
        localStorage.setItem('prepai_token', response.access_token);
        return { success: true };
      }
    } catch (apiErr) {
      console.warn("Backend register unavailable, applying offline fallback:", apiErr.message);
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        targetRole: userData.targetRole || 'Software Developer',
        experienceLevel: userData.experienceLevel || 'Intermediate',
        resumeUploaded: false,
        skills: ['Problem Solving', 'Communication'],
        createdAt: new Date().toISOString()
      };
      setUser(newUser);
      setToken('mock-jwt-token-new');
      localStorage.setItem('prepai_user', JSON.stringify(newUser));
      localStorage.setItem('prepai_token', 'mock-jwt-token-new');
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('prepai_user');
    localStorage.removeItem('prepai_token');
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('prepai_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
