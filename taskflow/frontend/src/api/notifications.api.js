// src/api/notifications.api.js
import apiClient from './client';

const NotificationsApi = {
  getNotifications: async (unreadOnly = false) => {
    const response = await apiClient.get('/notifications/', {
      params: { unread_only: unreadOnly }
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.count;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.post('/notifications/mark-read', {
      notification_id: notificationId
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post('/notifications/mark-all-read');
    return response.data;
  }
};

export default NotificationsApi;
