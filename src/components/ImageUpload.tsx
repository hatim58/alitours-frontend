import React, { useState, useRef } from 'react';
import { Upload, X, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { handleImageUpload, formatFileSize, UploadedImage } from '../utils/imageUpload';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  label = "Upload Image",
  required = false,
  className = ""
}) => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await handleImageUpload(file);
      
      if (result.success && result.data) {
        const uploadedImageData: UploadedImage = {
          file,
          preview: result.data,
          name: file.name,
          size: file.size
        };
        
        setUploadedImage(uploadedImageData);
        onImageUpload(result.data);
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUpload('');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const displayImage = uploadedImage?.preview || currentImage;

  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="space-y-4">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragOver 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload size={32} className="text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}

        {/* Success Message */}
        {uploadedImage && !uploadError && (
          <div className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">Image uploaded successfully!</span>
          </div>
        )}

        {/* Image Preview */}
        {displayImage && (
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={displayImage}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {uploadedImage && (
              <div className="mt-2 text-xs text-gray-500">
                <p>File: {uploadedImage.name}</p>
                <p>Size: {formatFileSize(uploadedImage.size)}</p>
              </div>
            )}
          </div>
        )}

        {/* URL Input Alternative */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or use image URL</span>
          </div>
        </div>

        <div>
          <input
            type="url"
            className="input"
            placeholder="https://example.com/image.jpg"
            onChange={(e) => {
              if (e.target.value) {
                setUploadedImage(null);
                onImageUpload(e.target.value);
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-1">
            You can still use image URLs if preferred
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;