import React from 'react';
import { Star, CheckCircle, Package } from 'lucide-react';
import { ReviewType } from '../types';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: ReviewType;
  showPackage?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showPackage = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mr-4">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.isVerified && (
                <CheckCircle size={16} className="text-green-500 ml-2" title="Verified Customer" />
              )}
            </div>
            <p className="text-sm text-gray-500">
              {format(review.createdAt, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={
                star <= review.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-300'
              }
            />
          ))}
          <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
        </div>
      </div>

      {/* Package Info */}
      {showPackage && review.packageName && (
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <Package size={14} className="mr-2" />
          <span>Package: {review.packageName}</span>
        </div>
      )}

      {/* Review Content */}
      <div className="mb-4">
        <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Status Badge (for admin view) */}
      {review.status !== 'approved' && (
        <div className="flex justify-end">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            review.status === 'rejected' ? 'bg-red-100 text-red-800' :
            'bg-green-100 text-green-800'
          }`}>
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;