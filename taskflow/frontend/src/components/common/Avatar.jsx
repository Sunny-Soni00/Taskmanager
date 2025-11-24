// src/components/common/Avatar.jsx

import { getInitials, getAvatarColor } from '../../utils/helpers';

/**
 * Avatar Component
 * User avatar with initials
 */

const Avatar = ({ name = 'User', size = 'md', src = null, className = '' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-32 w-32 text-3xl',
  };

  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          ${sizes[size]}
          rounded-full
          object-cover
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]}
        ${colorClass}
        rounded-full
        flex items-center justify-center
        font-semibold text-white
        ${className}
      `}
    >
      {initials}
    </div>
  );
};

export default Avatar;