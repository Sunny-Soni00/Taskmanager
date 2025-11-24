// src/components/common/Card.jsx

/**
 * Card Component - Single Responsibility
 * Reusable card container
 */

const Card = ({ children, className = '', padding = 'md', hover = false }) => {
  const paddingSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl 
        shadow-lg dark:shadow-gray-900/50
        border border-gray-200 dark:border-gray-700
        transition-all duration-200
        ${hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''}
        ${paddingSizes[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;