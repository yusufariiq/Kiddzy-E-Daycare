import { useState } from "react"
import toast from "react-hot-toast";

export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!file) return null;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return null;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return null;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
      
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
      
            if (!response.ok) {
              throw new Error('Upload failed');
            }
      
            const data = await response.json();
            
            if (!data.success) {
              throw new Error(data.error || 'Upload failed');
            }
      
            return data.data.url;
        } catch (error: any) {
            console.error('Image upload error:', error);
            toast.error(error.message || 'Failed to upload image');
            return null;
        } finally {
            setUploading(false);
        }
    }

    const uploadMultipleImages = async (files: FileList): Promise<string[]> => {
        const uploadPromises = Array.from(files).map(file => uploadImage(file));
        const results = await Promise.all(uploadPromises);
        return results.filter((url): url is string => url !== null);
    };

    return {
        uploadImage,
        uploadMultipleImages,
        uploading
    }
}