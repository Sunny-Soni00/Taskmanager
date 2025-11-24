// src/pages/profile/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { User, Mail, Key, Copy, Check } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfilePictureUpload from '../../components/profile/ProfilePictureUpload';
import AuthApi from '../../api/auth.api';
import { useAuth } from '../../hooks/useAuth';

/**
 * ProfilePage Component
 * User profile and settings
 */

const ProfilePage = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await AuthApi.getProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
      });
      // Update auth context with latest profile data
      await refreshUser();
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(profile.code_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      await AuthApi.updateProfile(formData);
      await loadProfile();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
      setErrors(newErrors);
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      newErrors.new_password = 'Password must be at least 6 characters';
      setErrors(newErrors);
      return;
    }
    
    try {
      await AuthApi.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setIsChangingPassword(false);
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password. Please check your current password.');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" text="Loading profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Picture */}
        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h2>
          </div>
          <ProfilePictureUpload 
            currentPicture={profile.profile_picture}
            userName={profile.name}
            onUpload={async (base64Image) => {
              try {
                await AuthApi.updateProfile({ profile_picture: base64Image });
                await loadProfile();
              } catch (error) {
                throw error;
              }
            }}
          />
        </Card>

        {/* Profile Info */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h2>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                icon={User}
                required
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                icon={Mail}
                disabled
                required
              />
              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: profile.name,
                      email: profile.email,
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </label>
                <p className="text-lg text-gray-900 dark:text-white">{profile.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <p className="text-lg text-gray-900 dark:text-white">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Your Code ID
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-lg font-mono text-gray-900 dark:text-white">
                    {profile.code_id}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Share this code with others to add you to their teams
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Change Password */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
            {!isChangingPassword && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                name="current_password"
                value={passwordData.current_password}
                onChange={handlePasswordChange}
                icon={Key}
                required
              />
              <Input
                label="New Password"
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                error={errors.new_password}
                icon={Key}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                name="confirm_password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                error={errors.confirm_password}
                icon={Key}
                required
              />
              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" variant="primary">
                  Update Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      current_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Keep your account secure by using a strong password
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
