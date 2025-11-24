// src/components/tasks/TaskCard.jsx

import { Clock, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';
import { getStatusConfig, getPriorityConfig, formatDate, isOverdue } from '../../utils/helpers';

/**
 * TaskCard Component
 * Display task card in kanban board
 */

const TaskCard = ({ task, onClick }) => {
  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = task.due_date && isOverdue(task.due_date) && task.status !== 'done';

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-2">
        <Badge size="sm" className={priorityConfig.bg}>
          <span className={priorityConfig.color}>{priorityConfig.label}</span>
        </Badge>
        {overdue && (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
        {task.title}
      </h4>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        {task.due_date && (
          <div className={`flex items-center gap-1 ${overdue ? 'text-red-500' : ''}`}>
            <Clock className="h-3 w-3" />
            {formatDate(task.due_date)}
          </div>
        )}
        <div className="text-gray-400">
          #{task.id}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;