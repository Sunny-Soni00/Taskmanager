// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

/**
 * NotFoundPage Component
 * Displays when user navigates to invalid URL
 * Provides navigation options back to app
 */

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-24 h-24 text-blue-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            It might have been moved or deleted, or you may have mistyped the URL.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Button>
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard">
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </Button>
            </Link>
          )}

          {!isAuthenticated && (
            <Link to="/login">
              <Button
                variant="secondary"
                size="lg"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Here are some helpful links instead:
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Link to="/teams" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Teams
                </Link>
                <Link to="/projects" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Projects
                </Link>
                <Link to="/tasks" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Tasks
                </Link>
                <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/#features" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Features
                </Link>
                <Link to="/#pricing" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Pricing
                </Link>
                <Link to="/signup" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
