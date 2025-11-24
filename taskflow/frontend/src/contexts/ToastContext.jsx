// src/contexts/ToastContext.jsx

import { createContext, useState, useCallback } from 'react';

/**
 * ToastContext - Observer Pattern
 * Manages global toast notifications with auto-hide
 */

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };
    
    setToasts((prev) => [...prev, toast]);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message) => {
    return addToast(message, 'success');
  }, [addToast]);

  const showError = useCallback((message) => {
    return addToast(message, 'error');
  }, [addToast]);

  const showInfo = useCallback((message) => {
    return addToast(message, 'info');
  }, [addToast]);

  const showWarning = useCallback((message) => {
    return addToast(message, 'warning');
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
