// src/utils/helpers.js

/**
 * Utility Helper Functions
 * Pure functions following functional programming principles
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
};

/**
 * Format date with time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return formatDate(date);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate avatar initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Generate random color for avatar
 * @param {string} seed - Seed for color generation
 * @returns {string} CSS color class
 */
export const getAvatarColor = (seed = '') => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  const index = seed.length % colors.length;
  return colors[index];
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get priority label and color
 * @param {string} priority - Priority value
 * @returns {object} Priority config
 */
export const getPriorityConfig = (priority) => {
  const configs = {
    low: { label: 'Low', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    medium: { label: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    high: { label: 'High', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  };
  return configs[priority] || configs.medium;
};

/**
 * Get status label and color
 * @param {string} status - Status value
 * @returns {object} Status config
 */
export const getStatusConfig = (status) => {
  const configs = {
    'todo': { 
      label: 'To Do', 
      variant: 'todo',
      color: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' 
    },
    'in-progress': { 
      label: 'In Progress', 
      variant: 'in-progress',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' 
    },
    'done': { 
      label: 'Done', 
      variant: 'done',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200' 
    },
  };
  return configs[status] || configs.todo;
};

/**
 * Check if date is overdue
 * @param {string|Date} date - Due date
 * @returns {boolean} Is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};