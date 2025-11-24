// src/contexts/ThemeContext.jsx

import { createContext, useState, useEffect } from 'react';
import StorageService from '../services/storage.service';

/**
 * ThemeContext - Observer Pattern
 * Manages global theme state (light/dark mode)
 */

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = StorageService.getTheme();
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      StorageService.setTheme('dark');
    } else {
      root.classList.remove('dark');
      StorageService.setTheme('light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};