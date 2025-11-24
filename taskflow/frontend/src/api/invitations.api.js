// src/api/invitations.api.js
import apiClient from './client';

const InvitationsApi = {
  sendInvitation: async (receiverId, teamId) => {
    const response = await apiClient.post('/invitations/', {
      receiver_id: receiverId,
      team_id: teamId
    });
    return response.data;
  },

  getReceivedInvitations: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/invitations/received', { params });
    return response.data;
  },

  getSentInvitations: async () => {
    const response = await apiClient.get('/invitations/sent');
    return response.data;
  },

  acceptInvitation: async (invitationId) => {
    const response = await apiClient.post('/invitations/accept', {
      invitation_id: invitationId
    });
    return response.data;
  },

  rejectInvitation: async (invitationId) => {
    const response = await apiClient.post('/invitations/reject', {
      invitation_id: invitationId
    });
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await apiClient.get('/invitations/search-users', {
      params: { q: query }
    });
    return response.data;
  }
};

export default InvitationsApi;
