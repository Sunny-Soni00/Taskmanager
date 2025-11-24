// src/components/tasks/TaskList.jsx

import { Clock } from 'lucide-react';
import Badge from '../common/Badge';
import { getStatusConfig, getPriorityConfig, formatDate } from '../../utils/helpers';

/**
 * TaskList Component
 * List view for tasks
 */

const TaskList = ({ tasks, onTaskClick }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {tasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            const priorityConfig = getPriorityConfig(task.priority);

            return (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge size="sm" className={priorityConfig.bg}>
                    <span className={priorityConfig.color}>{priorityConfig.label}</span>
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge size="sm" variant={statusConfig.variant}>
                    {statusConfig.label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {task.due_date ? (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {formatDate(task.due_date)}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No due date</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;