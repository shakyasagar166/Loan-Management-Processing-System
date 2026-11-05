import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'ROLE_CUSTOMER',
    isOfficer: user?.role === 'ROLE_LOAN_OFFICER',
    isUnderwriter: user?.role === 'ROLE_UNDERWRITER',
    isAdmin: user?.role === 'ROLE_ADMIN',
    isStaff: user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_LOAN_OFFICER' || user?.role === 'ROLE_UNDERWRITER',
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
