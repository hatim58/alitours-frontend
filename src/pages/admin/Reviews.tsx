import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star,
  User,
  Package,
  Calendar
} from 'lucide-react';
import { useReviews } from '../../contexts/ReviewContext';
import ReviewCard from '../../components/ReviewCard';

const AdminReviews: React.FC = () => {
  const { getAllReviews, updateReviewStatus } = useReviews();
  const allReviews = getAllReviews();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter reviews
  const filteredReviews = allReviews.filter(review => {
    const matchesSearch = 
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const openReviewDetails = (review: any) => {
    setSelectedReview(review);
    setIsDetailsOpen(true);
  };

  const closeReviewDetails = () => {
    setIsDetailsOpen(false);
    setSelectedReview(null);
  };

  const handleStatusUpdate = (reviewId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    updateReviewStatus(reviewId, newStatus);
    if (selectedReview && selectedReview.id === reviewId) {
      setSelectedReview({ ...selectedReview, status: newStatus });
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Review Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
              <h3 className="text-2xl font-bold">{allReviews.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Star size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold">
                {allReviews.filter(r => r.status === 'pending').length}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Eye size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Approved</p>
              <h3 className="text-2xl font-bold">
                {allReviews.filter(r => r.status === 'approved').length}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Rating</p>
              <h3 className="text-2xl font-bold">
                {allReviews.length > 0 
                  ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
                  : '0.0'
                }
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Star size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <span className="text-sm">Status:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm">Rating:</span>
              <select
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium mr-3">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{review.userName}</div>
                          <div className="text-sm text-gray-500">{review.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900 truncate">{review.title}</div>
                        <div className="text-sm text-gray-500 truncate">{review.comment}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {review.packageName || 'General Review'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                        <span className="ml-2 text-sm">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          review.status === 'approved' ? 'bg-green-100 text-green-800' :
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => openReviewDetails(review)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {review.status === 'pending' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-800 mr-3"
                            onClick={() => handleStatusUpdate(review.id, 'approved')}
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleStatusUpdate(review.id, 'rejected')}
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No reviews found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {isDetailsOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Review Details</h3>
              <button 
                onClick={closeReviewDetails}
                className="text-white hover:text-primary-100"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <ReviewCard review={selectedReview} />
              
              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                {selectedReview.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(selectedReview.id, 'approved')}
                      className="btn bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Approve Review
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(selectedReview.id, 'rejected')}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject Review
                    </button>
                  </>
                )}
                {selectedReview.status === 'approved' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedReview.id, 'rejected')}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    <XCircle size={16} className="mr-2" />
                    Reject Review
                  </button>
                )}
                {selectedReview.status === 'rejected' && (
                  <button 
                    onClick={() => handleStatusUpdate(selectedReview.id, 'approved')}
                    className="btn bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approve Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;