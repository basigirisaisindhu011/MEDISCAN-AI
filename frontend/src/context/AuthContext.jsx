import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/users/profile')
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.data.token);
    setUser(res.data.data.user);
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    if (res.data.data?.token) {
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data.user);
    }
    return res.data;
  };

  const googleLogin = async (email, name) => {
    const res = await api.post('/auth/google', { email, name });
    if (res.data.data?.token) {
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data.user);
    }
    return res.data;
  };

  const updateProfile = async (payload) => {
    const res = await api.put('/users/profile', payload);
    if (res.data.data) {
      setUser(res.data.data);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, googleLogin, updateProfile, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
