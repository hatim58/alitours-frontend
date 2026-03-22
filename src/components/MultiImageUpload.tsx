import React, { useState, useRef } from 'react';
import { Upload, X, Plus, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { handleImageUpload, formatFileSize, UploadedImage } from '../utils/imageUpload';

interface MultiImageUploadProps {
  onImagesChange: (imageUrls: string[]) => void;
  currentImages?: string[];
  label?: string;
  maxImages?: number;
  className?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  onImagesChange,
  currentImages = [],
  label = "Upload Images",
  maxImages = 10,
  className = ""
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allImages = [...currentImages, ...uploadedImages.map(img => img.preview)];

  const handleFileSelect = async (files: FileList) => {
    if (allImages.length + files.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const result = await handleImageUpload(file);
        if (result.success && result.data) {
          return {
            file,
            preview: result.data,
            name: file.name,
            size: file.size
          };
        }
        throw new Error(result.error || 'Upload failed');
      });

      const newUploadedImages = await Promise.all(uploadPromises);
      const updatedUploadedImages = [...uploadedImages, ...newUploadedImages];
      
      setUploadedImages(updatedUploadedImages);
      
      // Update parent component with all image URLs
      const allImageUrls = [...currentImages, ...updatedUploadedImages.map(img => img.preview)];
      onImagesChange(allImageUrls);
      
    } catch (error) {
      setUploadError('Failed to upload one or more images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
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

  const removeImage = (index: number, isUploaded: boolean) => {
    if (isUploaded) {
      // Remove from uploaded images
      const imageIndex = index - currentImages.length;
      const updatedUploadedImages = uploadedImages.filter((_, i) => i !== imageIndex);
      setUploadedImages(updatedUploadedImages);
      
      // Update parent component
      const allImageUrls = [...currentImages, ...updatedUploadedImages.map(img => img.preview)];
      onImagesChange(allImageUrls);
    } else {
      // Remove from current images (URL-based)
      const updatedCurrentImages = currentImages.filter((_, i) => i !== index);
      onImagesChange([...updatedCurrentImages, ...uploadedImages.map(img => img.preview)]);
    }
    
    setUploadError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="label">
        {label} ({allImages.length}/{maxImages})
      </label>
      
      <div className="space-y-4">
        {/* Upload Area */}
        {allImages.length < maxImages && (
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
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
                <p className="text-sm text-gray-600">Uploading images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={32} className="text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB each • Max {maxImages} images
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{uploadError}</span>
          </div>
        )}

        {/* Image Grid */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((image, index) => {
              const isUploaded = index >= currentImages.length;
              const uploadedImageData = isUploaded ? uploadedImages[index - currentImages.length] : null;
              
              return (
                <div key={index} className="relative group">
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-square">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index, isUploaded)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                    
                    {/* Upload indicator */}
                    {isUploaded && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle size={12} />
                      </div>
                    )}
                  </div>
                  
                  {uploadedImageData && (
                    <div className="mt-1 text-xs text-gray-500 truncate">
                      <p className="truncate">{uploadedImageData.name}</p>
                      <p>{formatFileSize(uploadedImageData.size)}</p>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Add More Button */}
            {allImages.length < maxImages && (
              <div
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-gray-50 transition-colors"
                onClick={openFileDialog}
              >
                <Plus size={24} className="text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Add More</span>
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
            <span className="px-2 bg-white text-gray-500">Or add image URLs</span>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            className="input flex-1"
            placeholder="https://example.com/image.jpg"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                if (input.value && allImages.length < maxImages) {
                  const updatedImages = [...allImages, input.value];
                  onImagesChange(updatedImages);
                  input.value = '';
                }
              }
            }}
          />
          <button
            type="button"
            className="btn btn-outline px-3"
            onClick={(e) => {
              const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
              if (input.value && allImages.length < maxImages) {
                const updatedImages = [...allImages, input.value];
                onImagesChange(updatedImages);
                input.value = '';
              }
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiImageUpload;