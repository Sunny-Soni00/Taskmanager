// src/components/profile/ProfilePictureUpload.jsx

import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

/**
 * ProfilePictureUpload Component
 * Upload and manage profile picture
 */

const ProfilePictureUpload = ({ currentPicture, userName, onUpload }) => {
  const { showSuccess, showError } = useToast();
  const [preview, setPreview] = useState(currentPicture);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await onUpload(reader.result);
          showSuccess('Profile picture updated successfully!');
          setSelectedFile(null);
        } catch (error) {
          showError('Failed to upload profile picture');
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      showError('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
            />
            {selectedFile && (
              <button
                onClick={handleRemove}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="relative">
            <Avatar name={userName} size="2xl" />
          </div>
        )}
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        >
          <Camera className="h-5 w-5" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {selectedFile && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleUpload}
            disabled={isUploading}
            isLoading={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Picture
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Click the camera icon to upload a profile picture<br />
        (Max 5MB, JPG/PNG)
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
