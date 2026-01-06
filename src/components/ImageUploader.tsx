// src/components/ImageUploader.tsx

import { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploaderProps {
  currentPhotoUrl?: string;
  onUploadSuccess: (photoUrl: string, publicId: string) => void;
}

export function ImageUploader({ currentPhotoUrl, onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'employee-photos');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        onUploadSuccess(data.secure_url, data.public_id);
      } else {
        throw new Error('Upload gagal');
      }
    } catch (err) {
      setError('Gagal mengupload foto. Coba lagi.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="relative">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div>
          <label
            htmlFor="photo-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
              uploading
                ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {uploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Ubah Foto</span>
              </>
            )}
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <X className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500">Format: JPG, PNG, WEBP. Maksimal 5MB.</p>
    </div>
  );
}
