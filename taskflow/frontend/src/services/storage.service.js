// src/services/storage.service.js

import { STORAGE_KEYS } from '../constants';

/**
 * StorageService - Singleton Pattern
 * Handles all localStorage operations with type safety
 * Single Responsibility: Manage browser storage
 */
class StorageService {
  constructor() {
    if (StorageService.instance) {
      return StorageService.instance;
    }
    StorageService.instance = this;
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from storage:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in storage:`, error);
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from storage:`, error);
    }
  }

  /**
   * Clear all items from localStorage
   */
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Specific methods for common operations
  getToken() {
    return this.get(STORAGE_KEYS.TOKEN);
  }

  setToken(token) {
    this.set(STORAGE_KEYS.TOKEN, token);
  }

  removeToken() {
    this.remove(STORAGE_KEYS.TOKEN);
  }

  getUser() {
    return this.get(STORAGE_KEYS.USER);
  }

  setUser(user) {
    this.set(STORAGE_KEYS.USER, user);
  }

  removeUser() {
    this.remove(STORAGE_KEYS.USER);
  }

  getTheme() {
    return this.get(STORAGE_KEYS.THEME);
  }

  setTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
  }
}

// Export singleton instance
export default new StorageService();