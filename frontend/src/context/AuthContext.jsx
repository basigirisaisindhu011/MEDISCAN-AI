import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// 1. Fixed variable name to VITE_API_BASE_URL
// 2. Added fallback URL in case the env variable is missing
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mediscan-backend-lipg.onrender.com';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get('/users/profile')
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    api.defaults.headers.common.Authorization = `Bearer ${res.data.data.token}`;
    setUser(res.data.data.user);
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
