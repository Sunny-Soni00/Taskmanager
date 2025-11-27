// src/api/auth.api.js

import apiClient from './client';
import { API_ENDPOINTS } from '../constants';

/**
 * AuthApi - Repository Pattern
 * Handles all authentication-related API calls
 * Single Responsibility: Authentication HTTP operations
 */
class AuthApi {
  /**
   * Login user
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} Auth response with token
   */
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  }

  /**
   * Register new user
   * @param {object} userData - { name, email, password }
   * @returns {Promise<object>} Signup response
   */
  async signup(userData) {
    const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);
    return response.data;
  }

  /**
   * Get current user profile
   * @returns {Promise<object>} User profile data
   */
  async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  /**
   * Update user profile
   * @param {object} data - { name, email }
   * @returns {Promise<object>} Updated profile
   */
  async updateProfile(data) {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  }

  /**
   * Update password
   * @param {object} data - { current_password, new_password }
   * @returns {Promise<object>} Success message
   */
  async updatePassword(data) {
    const response = await apiClient.patch('/auth/password', data);
    return response.data;
  }

  /**
   * Get public user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<object>} Public user profile data
   */
  async getPublicProfile(userId) {
    const response = await apiClient.get(`/auth/user/${userId}`);
    return response.data;
  }
}

export default new AuthApi();