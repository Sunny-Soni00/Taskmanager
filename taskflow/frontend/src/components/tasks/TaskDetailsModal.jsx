// src/components/tasks/TaskDetailsModal.jsx

import { useState } from 'react';
import { Clock, AlertCircle, Trash2, Edit2, X, Save } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import { getStatusConfig, getPriorityConfig, formatDateTime, isOverdue } from '../../utils/helpers';
import TasksApi from '../../api/tasks.api';

/**
 * TaskDetailsModal Component
 * Display and edit task details
 */

const TaskDetailsModal = ({ isOpen, onClose, task, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: '',
    due_date: '',
    estimate_minutes: '',
    tags: ''
  });

  if (!task) return null;

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const overdue = task.due_date && isOverdue(task.due_date) && task.status !== 'done';

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      await TasksApi.changeTaskStatus(task.id, newStatus);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
      estimate_minutes: task.estimate_minutes || '',
      tags: task.tags || ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: '',
      description: '',
      priority: '',
      due_date: '',
      estimate_minutes: '',
      tags: ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      setIsUpdating(true);
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        priority: editForm.priority,
        due_date: editForm.due_date || null,
        estimate_minutes: editForm.estimate_minutes ? parseInt(editForm.estimate_minutes) : null,
        tags: editForm.tags || null
      };
      await TasksApi.updateTask(task.id, updateData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Task" : "Task Details"} size="lg">
      <div className="space-y-6">
        {isEditing ? (
          /* Edit Mode */
          <>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Title *
              </label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Enter task description"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={editForm.due_date}
                  onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Estimate and Tags */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimate (minutes)
                </label>
                <Input
                  type="number"
                  value={editForm.estimate_minutes}
                  onChange={(e) => setEditForm({ ...editForm, estimate_minutes: e.target.value })}
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                  placeholder="frontend, urgent"
                />
              </div>
            </div>
          </>
        ) : (
          /* View Mode */
          <>
            {/* Task Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h2>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Priority</p>
                <Badge className={priorityConfig.bg}>
                  <span className={priorityConfig.color}>{priorityConfig.label}</span>
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
              </div>
            </div>

            {/* Additional Info */}
            {(task.estimate_minutes || task.tags) && (
              <div className="grid grid-cols-2 gap-4">
                {task.estimate_minutes && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Estimate</p>
                    <p className="text-gray-900 dark:text-white">{task.estimate_minutes} minutes</p>
                  </div>
                )}
                {task.tags && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tags</p>
                    <p className="text-gray-900 dark:text-white">{task.tags}</p>
                  </div>
                )}
              </div>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                  <p className={`font-medium ${overdue ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                    {formatDateTime(task.due_date)}
                    {overdue && (
                      <span className="ml-2 text-sm">(Overdue)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {!isEditing && (
          <>
            {/* Created/Updated Info */}
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>Created: {formatDateTime(task.created_at)}</p>
              {task.updated_at && task.updated_at !== task.created_at && (
                <p>Updated: {formatDateTime(task.updated_at)}</p>
              )}
            </div>

            {/* Status Change Buttons */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Change Status:
              </p>
              <div className="flex flex-wrap gap-2">
                {['todo', 'in-progress', 'done'].map((status) => (
                  <Button
                    key={status}
                    variant={task.status === status ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdating || task.status === status}
                  >
                    {getStatusConfig(status).label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Task
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isUpdating || !editForm.title.trim()}
                  isLoading={isUpdating}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Task
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;