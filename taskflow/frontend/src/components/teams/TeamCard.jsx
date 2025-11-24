// src/components/teams/TeamCard.jsx

import { Users, UserPlus, Settings, Trash2, Crown } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';

/**
 * TeamCard Component
 * Display team information card
 */

const TeamCard = ({ team, onAddMember, onViewProjects, onDelete }) => {
  const { user } = useAuth();
  const isOwner = team.owner_id === user?.id;

  return (
    <Card hover className="animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {team.name}
              </h3>
              {isOwner && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                  <Crown className="h-3 w-3" />
                  Owner
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Team ID: {team.id}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onViewProjects(team)}
          >
            View Projects
          </Button>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddMember(team)}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;