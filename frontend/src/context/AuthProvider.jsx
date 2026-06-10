import { useState } from 'react';
import { usePost } from '../hooks/usePost';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const { post } = usePost();

  const login = async (email, password) => {
    const data = await post('/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, password, role) => {
    const data = await post('/auth/register', { name, email, password, role });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
