// src/components/dashboard/StatsCard.jsx

import Card from '../common/Card';

/**
 * StatsCard Component
 * Display statistics on dashboard
 */

const StatsCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <Card hover className="animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;