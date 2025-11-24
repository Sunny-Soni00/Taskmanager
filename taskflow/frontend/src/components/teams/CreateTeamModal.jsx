// src/components/teams/CreateTeamModal.jsx

import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import TeamsApi from '../../api/teams.api';

/**
 * CreateTeamModal Component
 * Modal for creating new team
 */

const CreateTeamModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      setIsLoading(true);
      const team = await TeamsApi.createTeam(formData);
      onSuccess(team);
      setFormData({ name: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Team" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Input
          label="Team Name"
          placeholder="Enter team name"
          value={formData.name}
          onChange={(e) => setFormData({ name: e.target.value })}
          autoFocus
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamModal;