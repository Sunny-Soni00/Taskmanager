// src/pages/profile/PublicProfilePage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authApi from '../../api/auth.api';
import { useToast } from '../../hooks/useToast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { User, Calendar, Mail, ArrowLeft } from 'lucide-react';

/**
 * PublicProfilePage Component
 * Displays public user profile information
 * Used for viewing team members and verifying users before inviting
 * 
 * Single Responsibility: Display public user information
 * Open/Closed: Can be extended with more profile sections
 */
const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);
      const data = await authApi.getPublicProfile(userId);
      setProfile(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      showToast('Failed to load profile', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Card */}
        <Card>
          <div className="text-center">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <Avatar
                name={profile.name}
                src={profile.profile_picture}
                size="2xl"
              />
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.name}
            </h1>

            {/* Code ID */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-mono text-blue-600 dark:text-blue-400">
                ID: {profile.code_id}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
              {/* Joined Date */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* User ID */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      #{profile.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Message */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This is a public profile view. Some information is hidden for privacy.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PublicProfilePage;
