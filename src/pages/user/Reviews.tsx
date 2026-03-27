import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Filter, Plus } from 'lucide-react';
import { useReviews } from '../../contexts/ReviewContext';
import { useAuth } from '../../contexts/AuthContext';
import ReviewCard from '../../components/ReviewCard';
import ReviewForm from '../../components/ReviewForm';

const Reviews: React.FC = () => {
  const { getApprovedReviews } = useReviews();
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingFilter, setRatingFilter] = useState('all');

  const approvedReviews = getApprovedReviews();

  // Filter reviews by rating
  const filteredReviews = approvedReviews.filter(review => {
    if (ratingFilter === 'all') return true;
    return review.rating === parseInt(ratingFilter);
  });

  // Calculate average rating
  const averageRating = approvedReviews.length > 0
    ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length
    : 0;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: approvedReviews.filter(review => review.rating === rating).length,
    percentage: approvedReviews.length > 0
      ? (approvedReviews.filter(review => review.rating === rating).length / approvedReviews.length) * 100
      : 0
  }));

  return (
    <div className="pt-24 pb-16 fade-in">
      {/* Header */}
      <div className="bg-primary-600 py-16 mb-12">
        <div className="container text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Customer Reviews</h1>
          <p className="max-w-2xl mx-auto">
            Read what our customers say about their travel experiences with Ali Tours & Travels
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mb-8">
        <div className="flex items-center text-sm">
          <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-primary-600">Reviews</span>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Review Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Review Summary</h3>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={
                        star <= Math.round(averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-8">{rating}</span>
                    <Star size={14} className="text-yellow-500 fill-yellow-500 mr-2" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Filter size={18} className="mr-2" />
                Filter Reviews
              </h3>

              <div>
                <label className="label">Rating</label>
                <select
                  className="input"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              Write a Review
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8">
                <ReviewForm onSuccess={() => setShowReviewForm(false)} />
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Customer Reviews ({filteredReviews.length})
                </h2>
              </div>

              {filteredReviews.length > 0 ? (
                <div className="space-y-6">
                  {filteredReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⭐</div>
                  <h3 className="text-xl font-bold mb-2">No Reviews Found</h3>
                  <p className="text-gray-600 mb-6">
                    {ratingFilter === 'all'
                      ? 'Be the first to write a review!'
                      : `No reviews found with ${ratingFilter} star${ratingFilter !== '1' ? 's' : ''}.`
                    }
                  </p>
                  {!showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="btn btn-primary"
                    >
                      Write the First Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;