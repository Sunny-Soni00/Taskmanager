// src/pages/teams/TeamsPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users as UsersIcon, MessageCircle, FolderKanban, Trash2, LogOut } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import TeamCard from '../../components/teams/TeamCard';
import CreateTeamModal from '../../components/teams/CreateTeamModal';
import AddMemberModal from '../../components/teams/AddMemberModal';
import EnhancedChatPanel from '../../components/teams/EnhancedChatPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TeamsApi from '../../api/teams.api';
import { useAuth } from '../../hooks/useAuth';

/**
 * TeamsPage Component
 * Manage teams
 */

const TeamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState({ isOpen: false, team: null });
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setIsLoading(true);
      const data = await TeamsApi.getMyTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSuccess = (newTeam) => {
    setTeams([...teams, newTeam]);
  };

  const handleAddMemberSuccess = () => {
    loadTeams();
  };

  const handleViewProjects = (team) => {
    navigate(`/projects?team=${team.id}`);
  };

  const handleDeleteTeam = async (team) => {
    if (!window.confirm(`Are you sure you want to delete "${team.name}"?`)) {
      return;
    }
    
    try {
      await TeamsApi.deleteTeam(team.id);
      setTeams(teams.filter(t => t.id !== team.id));
    } catch (error) {
      console.error('Failed to delete team:', error);
      alert('Failed to delete team. You may not have permission.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading teams..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Teams
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your teams and collaborate with members
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Team
          </Button>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <div className="text-center py-16">
            <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No teams yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first team to start collaborating
            </p>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Create Your First Team
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teams List - WhatsApp Style */}
            <div className="lg:col-span-1 space-y-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  Your Teams
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      onClick={() => setSelectedTeam(team)}
                      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedTeam?.id === team.id 
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500' 
                          : 'border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={team.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {team.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {team.member_count || 0} members
                          </div>
                        </div>
                        {team.owner_id === user?.id && (
                          <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                            Owner
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Panel - WhatsApp Style */}
            <div className="lg:col-span-2">
              {selectedTeam ? (
                <EnhancedChatPanel 
                  team={selectedTeam} 
                  onTeamUpdate={() => {
                    setSelectedTeam(null);
                    loadTeams();
                  }}
                  onAddMember={() => setAddMemberModal({ isOpen: true, team: selectedTeam })}
                  onViewProjects={() => handleViewProjects(selectedTeam)}
                  onDeleteTeam={() => handleDeleteTeam(selectedTeam)}
                  onLeaveTeam={() => {
                    if (window.confirm(`Leave ${selectedTeam.name}?`)) {
                      TeamsApi.leaveTeam(selectedTeam.id).then(() => {
                        setSelectedTeam(null);
                        loadTeams();
                      });
                    }
                  }}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center h-full flex flex-col items-center justify-center">
                  <MessageCircle className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select a team to start chatting
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a team from the list to view messages and collaborate
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <AddMemberModal
        isOpen={addMemberModal.isOpen}
        onClose={() => setAddMemberModal({ isOpen: false, team: null })}
        team={addMemberModal.team}
        onSuccess={handleAddMemberSuccess}
      />
    </DashboardLayout>
  );
};

export default TeamsPage;