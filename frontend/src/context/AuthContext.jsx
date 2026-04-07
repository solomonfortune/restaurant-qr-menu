import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('qr-menu-token'));
  const [loading, setLoading] = useState(true);

  const persistAuth = (nextToken, nextUser) => {
    localStorage.setItem('qr-menu-token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearAuth = () => {
    localStorage.removeItem('qr-menu-token');
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persistAuth(data.token, data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data.token, data.user);
    return data;
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    register,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
