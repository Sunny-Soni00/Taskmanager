// src/contexts/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import AuthApi from '../api/auth.api';
import StorageService from '../services/storage.service';

/**
 * AuthContext - Observer Pattern
 * Manages global authentication state
 * Dependency Inversion: Depends on abstraction (AuthApi)
 */

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = StorageService.getToken();
    const savedUser = StorageService.getUser();
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
      
      // Refresh user profile to get latest data including profile_picture
      refreshUserOnMount();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshUserOnMount = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error('Failed to refresh user on mount:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch and update user profile
   */
  const refreshUser = async () => {
    try {
      const profile = await AuthApi.getProfile();
      setUser(profile);
      StorageService.setUser(profile);
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  };

  /**
   * Login user
   * @param {object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await AuthApi.login(credentials);
      
      setToken(response.access_token);
      StorageService.setToken(response.access_token);
      
      // Fetch full user profile with profile_picture
      try {
        await refreshUser();
      } catch (error) {
        // Fallback to basic user data if profile fetch fails
        const userData = {
          email: credentials.email,
          name: credentials.email.split('@')[0],
        };
        setUser(userData);
        StorageService.setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   * @param {object} userData - { name, email, password, code_id }
   */
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      await AuthApi.signup(userData);
      
      // After signup, automatically login
      await login({ 
        email: userData.email, 
        password: userData.password 
      });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    StorageService.removeToken();
    StorageService.removeUser();
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    signup,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};