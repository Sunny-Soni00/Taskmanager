// src/api/tasks.api.js

import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

/**
 * TasksApi - Repository Pattern
 * Handles all task-related API calls
 */
class TasksApi {
  /**
   * Create new task
   * @param {object} data - Task data
   * @returns {Promise<object>} Created task
   */
  async createTask(data) {
    const response = await apiClient.post(API_ENDPOINTS.TASKS, data);
    return response.data;
  }

  /**
   * Get tasks for a project
   * @param {number} projectId - Project ID
   * @returns {Promise<Array>} List of tasks
   */
  async getProjectTasks(projectId) {
    const response = await apiClient.get(API_ENDPOINTS.PROJECT_TASKS(projectId));
    return response.data;
  }

  /**
   * Update task
   * @param {number} taskId - Task ID
   * @param {object} data - Updated fields
   * @returns {Promise<object>} Updated task
   */
  async updateTask(taskId, data) {
    const response = await apiClient.patch(API_ENDPOINTS.UPDATE_TASK(taskId), data);
    return response.data;
  }

  /**
   * Change task status
   * @param {number} taskId - Task ID
   * @param {string} status - New status
   * @returns {Promise<object>} Updated task
   */
  async changeTaskStatus(taskId, status) {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CHANGE_TASK_STATUS(taskId)}?status=${status}`
    );
    return response.data;
  }

  /**
   * Delete task
   * @param {number} taskId - Task ID
   * @returns {Promise<object>} Success message
   */
  async deleteTask(taskId) {
    const response = await apiClient.delete(API_ENDPOINTS.DELETE_TASK(taskId));
    return response.data;
  }

  /**
   * Get all tasks for current user (including tasks without projects)
   * @returns {Promise<Array>} List of all user tasks
   */
  async getAllUserTasks() {
    const response = await apiClient.get('/tasks/user/all');
    return response.data;
  }
}

export default new TasksApi();