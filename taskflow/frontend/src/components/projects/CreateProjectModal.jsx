// src/components/projects/CreateProjectModal.jsx

import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import ProjectsApi from '../../api/projects.api';
import TeamsApi from '../../api/teams.api';
import { useToast } from '../../hooks/useToast';

/**
 * CreateProjectModal Component
 * Modal for creating new project
 */

const CreateProjectModal = ({ isOpen, onClose, onSuccess, preselectedTeamId = null }) => {
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    team_id: preselectedTeamId || '',
  });
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTeams();
      if (preselectedTeamId) {
        setFormData((prev) => ({ ...prev, team_id: preselectedTeamId }));
      }
    }
  }, [isOpen, preselectedTeamId]);

  const loadTeams = async () => {
    try {
      const data = await TeamsApi.getMyTeams();
      setTeams(data);
    } catch (err) {
      console.error('Failed to load teams:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Project name is required');
      return;
    }

    try {
      setIsLoading(true);
      const project = await ProjectsApi.createProject({
        name: formData.name,
        description: formData.description || undefined,
        team_id: formData.team_id ? parseInt(formData.team_id) : undefined,
      });
      showSuccess('Project created successfully!');
      onSuccess(project);
      setFormData({ name: '', description: '', team_id: '' });
      onClose();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          label="Project Name"
          name="name"
          placeholder="Enter project name"
          value={formData.name}
          onChange={handleChange}
          autoFocus
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            name="description"
            placeholder="Enter project description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Team (Optional)
          </label>
          <select
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Personal Project (No Team)</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;