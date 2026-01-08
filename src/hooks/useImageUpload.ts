import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface CloudinaryResponse {
  secure_url: string;
  [key: string]: unknown;
}

interface UploadImageOptions {
  folder?: string;
}

/**
 * Custom hook for uploading images to Cloudinary
 */

export function useImageUpload(options: UploadImageOptions = {}) {
  const { folder = 'employee-photos' } = options;

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration is missing');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryResponse = await response.json();

      if (!data.secure_url) {
        throw new Error('No URL returned from upload');
      }

      return data.secure_url;
    },
    onError: (error: Error) => {
      toast(error.message || 'Gagal mengupload foto.');
      console.error('Upload error:', error);
    },
  });

  return {
    uploadImage: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
    reset: uploadMutation.reset,
  };
}