import React, { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import API from '../../api/axios';
import { toast } from 'sonner';

export function ImageUpload({ value, onChange, label = "Upload Image" }) {
    const [preview, setPreview] = useState(value || '');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB');
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            // Use relative path via Vite proxy for uploading
            const res = await API.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onChange(res.data.imageUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview('');
        onChange('');
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                {preview ? (
                    <div className="relative w-full aspect-video max-h-48 overflow-hidden rounded-md">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center cursor-pointer w-full h-32">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 2MB)</p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                )}
                {uploading && (
                    <div className="mt-2 text-sm text-blue-500 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        Uploading...
                    </div>
                )}
            </div>
        </div>
    );
}
