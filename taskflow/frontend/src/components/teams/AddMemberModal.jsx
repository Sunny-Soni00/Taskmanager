// src/components/teams/AddMemberModal.jsx

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import InvitationsApi from '../../api/invitations.api';
import { useToast } from '../../hooks/useToast';

/**
 * AddMemberModal Component
 * Modal for searching and inviting users to team
 */

const AddMemberModal = ({ isOpen, onClose, team, onSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const results = await InvitationsApi.searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleInvite = async (user) => {
    try {
      setIsLoading(true);
      await InvitationsApi.sendInvitation(user.id, team.id);
      showSuccess(`Invitation sent to ${user.name}!`);
      setSearchQuery('');
      setSearchResults([]);
      onSuccess();
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Invite Member to ${team?.name}`} 
      size="md"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search User
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or code ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Type at least 2 characters to search
          </p>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Searching...
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} size="sm" src={user.profile_picture} />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email} • {user.code_id}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleInvite(user)}
                  disabled={isLoading}
                >
                  Invite
                </Button>
              </div>
            ))}
          </div>
        )}

        {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No users found matching "{searchQuery}"
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemberModal;