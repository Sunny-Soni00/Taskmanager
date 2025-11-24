// src/components/dashboard/RecentTasks.jsx

import { Clock, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { getStatusConfig, getPriorityConfig, formatDate } from '../../utils/helpers';

/**
 * RecentTasks Component
 * Display recent tasks on dashboard
 */

const RecentTasks = ({ tasks = [] }) => {
  if (tasks.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Tasks
        </h3>
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No tasks yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Create your first task to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Tasks
      </h3>
      <div className="space-y-3">
        {tasks.slice(0, 5).map((task) => {
          const statusConfig = getStatusConfig(task.status);
          const priorityConfig = getPriorityConfig(task.priority);

          return (
            <div
              key={task.id}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h4>
                <Badge size="sm" variant={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className={`${priorityConfig.color} font-medium`}>
                  {priorityConfig.label} Priority
                </span>
                {task.due_date && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(task.due_date)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentTasks;