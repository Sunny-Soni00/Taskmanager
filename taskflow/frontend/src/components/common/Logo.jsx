// src/components/common/Logo.jsx

import { Users } from 'lucide-react';

/**
 * Logo Component
 * Brand logo with text
 */

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-2xl' },
    lg: { icon: 36, text: 'text-3xl' },
    xl: { icon: 48, text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Users 
          size={sizes[size].icon} 
          className="text-primary-600 dark:text-primary-400" 
          strokeWidth={2.5}
        />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      {showText && (
        <span className={`font-bold ${sizes[size].text} text-gray-900 dark:text-white tracking-tight`}>
          Umanager
        </span>
      )}
    </div>
  );
};

export default Logo;