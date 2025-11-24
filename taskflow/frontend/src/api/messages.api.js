// src/api/messages.api.js
import apiClient from './client';

const MessagesApi = {
  sendMessage: async (teamId, message) => {
    const response = await apiClient.post('/messages/', {
      team_id: teamId,
      message
    });
    return response.data;
  },

  sendMessageWithFile: async (teamId, message, fileData) => {
    const response = await apiClient.post('/messages/', {
      team_id: teamId,
      message,
      file_data: fileData.file_data,
      file_name: fileData.file_name,
      file_type: fileData.file_type
    });
    return response.data;
  },

  getTeamMessages: async (teamId, limit = 100) => {
    const response = await apiClient.get(`/messages/${teamId}`, {
      params: { limit }
    });
    return response.data;
  }
};

export default MessagesApi;
