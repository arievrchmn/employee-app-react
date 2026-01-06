// src/components/ImageUploader.tsx

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  currentPhotoUrl?: string;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUploader({
  currentPhotoUrl,
  onFileSelect,
  disabled = false,
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Pass file to parent
    onFileSelect(file);
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Preview */}
      <div className="relative">
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
            JA
          </div>
        )}
      </div>

      {/* Upload Button - Only show when not disabled */}
      {!disabled && (
        <>
          <label
            htmlFor="photo-upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
          >
            <Upload className="w-4 h-4" />
            <span>Ubah Foto</span>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <X className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Info */}
          <p className="text-xs text-gray-500 text-center">Format: JPG, PNG, WEBP. Maksimal 5MB.</p>
        </>
      )}
    </div>
  );
}
