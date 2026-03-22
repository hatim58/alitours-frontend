import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, MessageSquare, User, Mail, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import { usePackages } from '../contexts/PackageContext';

interface ReviewFormData {
  packageId?: string;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  userEmail: string;
}

interface ReviewFormProps {
  packageId?: string;
  onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ packageId, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { addReview } = useReviews();
  const { packages } = usePackages();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      packageId: packageId || '',
      userName: user?.name || '',
      userEmail: user?.email || ''
    }
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedPackage = data.packageId ? packages.find(p => p.id === data.packageId) : undefined;
      
      addReview({
        userId: user?.id || 'guest',
        userName: data.userName,
        userEmail: data.userEmail,
        packageId: data.packageId || undefined,
        packageName: selectedPackage?.name || undefined,
        rating,
        title: data.title,
        comment: data.comment
      });

      alert('Thank you for your review! It will be published after approval.');
      reset();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      alert('Error submitting review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6">Write a Review</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center">
              <User size={16} className="mr-2 text-gray-500" />
              Your Name *
            </label>
            <input
              type="text"
              className={`input ${errors.userName ? 'border-red-500' : ''}`}
              placeholder="Enter your name"
              {...register('userName', { required: 'Name is required' })}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
            )}
          </div>

          <div>
            <label className="label flex items-center">
              <Mail size={16} className="mr-2 text-gray-500" />
              Email Address *
            </label>
            <input
              type="email"
              className={`input ${errors.userEmail ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
              {...register('userEmail', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.userEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.userEmail.message}</p>
            )}
          </div>
        </div>

        {/* Package Selection */}
        {!packageId && (
          <div>
            <label className="label flex items-center">
              <Package size={16} className="mr-2 text-gray-500" />
              Package (Optional)
            </label>
            <select className="input" {...register('packageId')}>
              <option value="">Select a package (optional)</option>
              {packages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="label">Rating *</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-sm text-gray-600">
              {rating > 0 && (
                <>
                  {rating} star{rating !== 1 ? 's' : ''} - 
                  {rating === 1 && ' Poor'}
                  {rating === 2 && ' Fair'}
                  {rating === 3 && ' Good'}
                  {rating === 4 && ' Very Good'}
                  {rating === 5 && ' Excellent'}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label className="label">Review Title *</label>
          <input
            type="text"
            className={`input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Give your review a title"
            {...register('title', { required: 'Review title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Review Comment */}
        <div>
          <label className="label flex items-center">
            <MessageSquare size={16} className="mr-2 text-gray-500" />
            Your Review *
          </label>
          <textarea
            className={`input h-32 ${errors.comment ? 'border-red-500' : ''}`}
            placeholder="Share your experience with Ali Tours & Travels..."
            {...register('comment', { 
              required: 'Review comment is required',
              minLength: {
                value: 10,
                message: 'Review must be at least 10 characters long'
              }
            })}
          ></textarea>
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || rating === 0}
        >
          {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Your review will be published after approval by our team.
        </p>
      </form>
    </div>
  );
};

export default ReviewForm;