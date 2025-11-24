// src/api/client.js

import axios from 'axios';
import { API_BASE_URL } from '../constants';
import StorageService from '../services/storage.service';

/**
 * ApiClient - Singleton Pattern
 * Centralized HTTP client with interceptors
 * Dependency Injection: Accepts storage service
 */
class ApiClient {
  constructor() {
    if (ApiClient.instance) {
      return ApiClient.instance;
    }

    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    ApiClient.instance = this;
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request Interceptor - Add token to every request
    this.client.interceptors.request.use(
      (config) => {
        const token = StorageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          StorageService.removeToken();
          StorageService.removeUser();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get axios instance
   * @returns {AxiosInstance} Axios instance
   */
  getInstance() {
    return this.client;
  }
}

// Export singleton instance
export default new ApiClient().getInstance();