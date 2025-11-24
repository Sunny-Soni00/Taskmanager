// src/hooks/useToast.js

import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

/**
 * Custom hook to use toast notifications
 * @returns {Object} Toast context value
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
