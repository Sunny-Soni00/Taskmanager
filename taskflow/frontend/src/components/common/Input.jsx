// src/components/common/Input.jsx

import { forwardRef } from 'react';

/**
 * Input Component - Single Responsibility
 * Reusable input field with label and error handling
 */

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 
          border rounded-lg 
          text-gray-900 dark:text-gray-100
          bg-white dark:bg-gray-800
          border-gray-300 dark:border-gray-600
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          placeholder-gray-400 dark:placeholder-gray-500
          transition-all duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;