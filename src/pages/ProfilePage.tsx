// src/pages/ProfilePage.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiError, staffApi } from '../lib/api';
import toast from 'react-hot-toast';
import { ImageUploader } from '../components/ImageUploader';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => staffApi.getProfile(),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { phone?: string; password?: string; photo_url?: string }) =>
      staffApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      setPassword('');
      setSelectedFile(null);
      toast('Profil berhasil diperbarui!');
    },
    onError: (error: ApiError) => {
      toast(error.message || 'Gagal memperbarui profil');
    },
  });

  const handleSave = async () => {
    const updates: { phone?: string; password?: string; photo_url?: string } = {};

    // Check phone
    if (phone && phone !== profile?.data.phone) {
      updates.phone = phone;
    }

    // Check password
    if (password) {
      updates.password = password;
    }

    // Check and upload photo if selected
    if (selectedFile) {
      try {
        const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'employee-photos');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.secure_url) {
          updates.photo_url = data.secure_url;
        } else {
          throw new Error('Upload gagal');
        }
      } catch (err) {
        toast('Gagal mengupload foto.');
        console.error('Upload error:', err);
        return;
      }
    }

    // If no updates, return
    if (Object.keys(updates).length === 0) {
      return;
    }

    // Save all updates
    updateMutation.mutate(updates);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword('');
    setSelectedFile(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const profileData = profile?.data;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profil Karyawan</h2>
        {!isEditing ? (
          <button
            onClick={() => {
              setIsEditing(true);
              setPhone(profileData?.phone || '');
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Batal
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Uploader Section */}
        <div className="flex flex-col items-center">
          <ImageUploader
            currentPhotoUrl={
              profileData?.photo_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profileData?.name || 'User'
              )}&size=200&background=4F46E5&color=fff`
            }
            onFileSelect={setSelectedFile}
            disabled={!isEditing}
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Nama Lengkap
            </label>
            <input
              type="text"
              value={profileData?.name || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Perusahaan
            </label>
            <input
              type="email"
              value={profileData?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Posisi
            </label>
            <input
              type="text"
              value={profileData?.position || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Nomor Handphone
            </label>
            <input
              type="tel"
              value={isEditing ? phone : profileData?.phone || '-'}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-lg ${
                isEditing
                  ? 'bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-500'
                  : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>

          {isEditing && (
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                Password Baru (Opsional)
              </label>
              <input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
