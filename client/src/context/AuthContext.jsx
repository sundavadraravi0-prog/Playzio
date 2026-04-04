import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await authAPI.refresh();
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data);
      } catch (err) {
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Listen for forced logout (from API interceptor)
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('accessToken');
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data);
    toast.success('Account created successfully');
    return data;
  };

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data);
    toast.success('Logged in successfully');
    return data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('accessToken');
    toast.success('Logged out');
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
