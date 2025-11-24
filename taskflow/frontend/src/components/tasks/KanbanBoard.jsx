// src/components/tasks/KanbanBoard.jsx

import { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { TASK_STATUSES } from '../../constants';
import TaskCard from './TaskCard';
import Button from '../common/Button';

/**
 * KanbanBoard Component
 * Kanban board view for tasks with zoom controls
 */

const KanbanBoard = ({ tasks, onTaskClick }) => {
  const [zoomLevel, setZoomLevel] = useState(100); // 100 = normal, 75 = compact, 125 = large

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  // Calculate scale based on zoom level
  const scale = zoomLevel / 100;

  return (
    <div className="space-y-4">
      {/* Zoom Controls */}
      <div className="flex items-center justify-end gap-2">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="p-2"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Reset Zoom"
          >
            {zoomLevel}%
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 150}
            className="p-2"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="p-2"
            title="Reset to Default"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Kanban Board with zoom applied */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 origin-top-left transition-transform duration-200"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
      >
        {TASK_STATUSES.map((status) => {
          const statusTasks = getTasksByStatus(status.value);
          
          return (
            <div key={status.value} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {status.label}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({statusTasks.length})
                  </span>
                </h3>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {statusTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                    No tasks
                  </div>
                ) : (
                  statusTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTaskClick(task)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;