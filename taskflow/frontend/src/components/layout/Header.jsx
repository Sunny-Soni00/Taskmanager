// src/components/layout/Header.jsx

import { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, User, Bell, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import InvitationsApi from '../../api/invitations.api';
import NotificationsApi from '../../api/notifications.api';

/**
 * Header Component
 * Dashboard header with user info and actions
 */

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [invitationCount, setInvitationCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    loadCounts();
    // Check for new notifications every 10 seconds
    const interval = setInterval(loadCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadCounts = async () => {
    try {
      const [invitations, notifCount] = await Promise.all([
        InvitationsApi.getReceivedInvitations('pending'),
        NotificationsApi.getUnreadCount()
      ]);
      setInvitationCount(invitations.length);
      setNotificationCount(notifCount);
    } catch (error) {
      console.error('Failed to load counts:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Page title will be added by pages */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Invitations Bell */}
            <button
              onClick={() => navigate('/invitations')}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all group"
              aria-label="Team Invitations"
              title="Team Invitations"
            >
              <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {invitationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                  {invitationCount > 9 ? '9+' : invitationCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Team Invitations
              </span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all group"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Notifications
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* User Menu */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
              onClick={() => navigate('/profile')}
            >
              <Avatar name={user?.name || user?.email} size="md" src={user?.profile_picture} />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;