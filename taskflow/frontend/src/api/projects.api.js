// src/api/projects.api.js

import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

/**
 * ProjectsApi - Repository Pattern
 * Handles all project-related API calls
 */
class ProjectsApi {
  /**
   * Create new project
   * @param {object} data - { name, description, team_id }
   * @returns {Promise<object>} Created project
   */
  async createProject(data) {
    const response = await apiClient.post(API_ENDPOINTS.PROJECTS, data);
    return response.data;
  }

  /**
   * Get projects for a team
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} List of projects
   */
  async getTeamProjects(teamId) {
    const response = await apiClient.get(API_ENDPOINTS.TEAM_PROJECTS(teamId));
    return response.data;
  }

  /**
   * Update project
   * @param {number} projectId - Project ID
   * @param {object} data - Updated fields
   * @returns {Promise<object>} Updated project
   */
  async updateProject(projectId, data) {
    const response = await apiClient.patch(`/projects/${projectId}`, data);
    return response.data;
  }

  /**
   * Delete project
   * @param {number} projectId - Project ID
   * @returns {Promise<object>} Success message
   */
  async deleteProject(projectId) {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  }
}

export default new ProjectsApi();