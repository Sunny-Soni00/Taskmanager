// src/components/dashboard/QuickActions.jsx

import { Plus, Users, FolderPlus, ListPlus } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * QuickActions Component
 * Quick action buttons on dashboard
 */

const QuickActions = ({ onCreateTeam, onCreateProject, onCreateTask }) => {
  const actions = [
    {
      title: 'Create Team',
      description: 'Start a new team',
      icon: Users,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      onClick: onCreateTeam,
    },
    {
      title: 'New Project',
      description: 'Add a project',
      icon: FolderPlus,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      onClick: onCreateProject,
    },
    {
      title: 'Add Task',
      description: 'Create a task',
      icon: ListPlus,
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      onClick: onCreateTask,
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all group"
          >
            <div className={`inline-flex p-3 rounded-lg ${action.color} mb-3`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {action.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;