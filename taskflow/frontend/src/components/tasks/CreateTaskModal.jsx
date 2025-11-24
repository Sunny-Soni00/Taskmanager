// src/components/tasks/CreateTaskModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import TasksApi from '../../api/tasks.api';
import ProjectsApi from '../../api/projects.api';
import TeamsApi from '../../api/teams.api';

/**
 * CreateTaskModal Component
 * Modal for creating new task
 */

const CreateTaskModal = ({ isOpen, onClose, onSuccess, preselectedProjectId = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: preselectedProjectId || '',
    priority: 'medium',
    due_date: '',
  });
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
      if (preselectedProjectId) {
        setFormData((prev) => ({ ...prev, project_id: preselectedProjectId }));
      }
    }
  }, [isOpen, preselectedProjectId]);

  const loadProjects = async () => {
    try {
      const teams = await TeamsApi.getMyTeams();
      const allProjects = [];
      for (const team of teams) {
        try {
          const teamProjects = await ProjectsApi.getTeamProjects(team.id);
          allProjects.push(...teamProjects);
        } catch (err) {
          console.error('Failed to load projects:', err);
        }
      }
      setProjects(allProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsLoading(true);
      const task = await TasksApi.createTask({
        title: formData.title,
        description: formData.description || undefined,
        project_id: formData.project_id ? parseInt(formData.project_id) : undefined,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
      });
      onSuccess(task);
      setFormData({
        title: '',
        description: '',
        project_id: '',
        priority: 'medium',
        due_date: '',
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Input
          label="Task Title"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            name="description"
            placeholder="Enter task description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project (Optional)
          </label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">No Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input
            label="Due Date (Optional)"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;