import { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const { accessToken, user } = response;
      
      localStorage.setItem('token', accessToken);
      
      // Decode token to get user roles
      const decoded = jwtDecode(accessToken);
      const roles = decoded.roles || [];
      
      setCurrentUser(user);
      setUserRoles(roles);
      setIsAuthenticated(true);
      setLoading(false);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      setLoading(false);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUserRoles([]);
    setIsAuthenticated(false);
  };

  const checkAuth = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUserRoles([]);
      setLoading(false);
      return false;
    }
    
    try {
      // Check if token is expired
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        logout();
        setLoading(false);
        return false;
      }
      
      // Token is valid
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
      setUserRoles(decoded.roles || []);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
      setLoading(false);
      return false;
    }
  }, []);

  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  const value = {
    currentUser,
    isAuthenticated,
    userRoles,
    loading,
    login,
    register,
    logout,
    checkAuth,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};