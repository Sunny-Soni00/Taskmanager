// src/pages/invitations/InvitationsPage.jsx

import { useState, useEffect } from 'react';
import { Check, X, Clock, Mail } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import InvitationsApi from '../../api/invitations.api';
import { useToast } from '../../hooks/useToast';

/**
 * InvitationsPage Component
 * View and manage team invitations
 */

const InvitationsPage = () => {
  const { showSuccess, showError } = useToast();
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, accepted, rejected, all

  useEffect(() => {
    loadInvitations();
  }, [filter]);

  const loadInvitations = async () => {
    try {
      setIsLoading(true);
      const status = filter === 'all' ? null : filter;
      const data = await InvitationsApi.getReceivedInvitations(status);
      setInvitations(data);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await InvitationsApi.acceptInvitation(invitationId);
      showSuccess('Invitation accepted successfully!');
      await loadInvitations();
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      showError(error.response?.data?.detail || 'Failed to accept invitation');
    }
  };

  const handleReject = async (invitationId) => {
    try {
      await InvitationsApi.rejectInvitation(invitationId);
      showSuccess('Invitation rejected');
      await loadInvitations();
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      showError(error.response?.data?.detail || 'Failed to reject invitation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'rejected':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading invitations..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Team Invitations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your team invitation requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {['pending', 'accepted', 'rejected', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                filter === tab
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Invitations List */}
        {invitations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No {filter !== 'all' ? filter : ''} invitations found
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar name={invitation.sender.name} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {invitation.team.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(invitation.status)}`}>
                          {getStatusIcon(invitation.status)}
                          {invitation.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span className="font-medium">{invitation.sender.name}</span> invited you to join <span className="font-medium text-primary-600 dark:text-primary-400">{invitation.team.name}</span>
                      </p>
                      {invitation.team.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                          "{invitation.team.description}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        From: {invitation.sender.email} • Sent: {new Date(invitation.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                      </p>
                    </div>
                  </div>

                  {/* Actions for pending invitations */}
                  {invitation.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAccept(invitation.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(invitation.id)}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvitationsPage;
