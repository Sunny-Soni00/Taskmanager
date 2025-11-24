// src/api/teams.api.js

import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

/**
 * TeamsApi - Repository Pattern
 * Handles all team-related API calls
 */
class TeamsApi {
  /**
   * Create new team
   * @param {object} data - { name }
   * @returns {Promise<object>} Created team
   */
  async createTeam(data) {
    const response = await apiClient.post(API_ENDPOINTS.TEAMS, data);
    return response.data;
  }

  /**
   * Get user's teams
   * @returns {Promise<Array>} List of teams
   */
  async getMyTeams() {
    const response = await apiClient.get(API_ENDPOINTS.MY_TEAMS);
    return response.data;
  }

  /**
   * Add member to team
   * @param {number} teamId - Team ID
   * @param {object} data - { code_id }
   * @returns {Promise<object>} Added member info
   */
  async addMember(teamId, data) {
    const response = await apiClient.post(API_ENDPOINTS.ADD_MEMBER(teamId), data);
    return response.data;
  }

  /**
   * Update team
   * @param {number} teamId - Team ID
   * @param {object} data - Updated fields
   * @returns {Promise<object>} Updated team
   */
  async updateTeam(teamId, data) {
    const response = await apiClient.patch(`/teams/${teamId}`, data);
    return response.data;
  }

  /**
   * Delete team
   * @param {number} teamId - Team ID
   * @returns {Promise<object>} Success message
   */
  async deleteTeam(teamId) {
    const response = await apiClient.delete(`/teams/${teamId}`);
    return response.data;
  }

  /**
   * Leave team
   * @param {number} teamId - Team ID
   * @returns {Promise<object>} Success message
   */
  async leaveTeam(teamId) {
    const response = await apiClient.post(`/teams/${teamId}/leave`);
    return response.data;
  }

  /**
   * Get team members with details
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} List of members with user details
   */
  async getTeamMembers(teamId) {
    const response = await apiClient.get(`/teams/${teamId}/members`);
    return response.data;
  }
}

export default new TeamsApi();