import { createContext, useContext, useState } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export const homePath = { admin: '/admin', doctor: '/doctor', patient: '/patient' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const save = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => save((await api.post('/auth/login', { email, password })).data);
  const register = async (form) => save((await api.post('/auth/register', form)).data);
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
