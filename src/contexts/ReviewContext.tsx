import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ReviewType } from '../types';

interface ReviewContextType {
  reviews: ReviewType[];
  addReview: (review: Omit<ReviewType, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isVerified'>) => string;
  updateReviewStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  getApprovedReviews: () => ReviewType[];
  getReviewsByUserId: (userId: string) => ReviewType[];
  getAllReviews: () => ReviewType[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// Sample initial reviews
const initialReviews: ReviewType[] = [
  {
    id: 'REV001',
    userId: '2',
    userName: 'Priya Sharma',
    userEmail: 'priya@example.com',
    packageId: 'shimla-explorer',
    packageName: 'Shimla Winter Wonderland',
    rating: 5,
    title: 'Amazing Shimla Experience!',
    comment: 'Had an incredible time in Shimla with Ali Tours & Travels. The itinerary was perfect, hotels were comfortable, and the guide was very knowledgeable. The toy train ride was the highlight of our trip!',
    isVerified: true,
    status: 'approved',
    createdAt: new Date('2024-04-15'),
    updatedAt: new Date('2024-04-15')
  },
  {
    id: 'REV002',
    userId: '2',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh@example.com',
    packageId: 'ladakh-adventure',
    packageName: 'Ladakh Adventure Explorer',
    rating: 5,
    title: 'Breathtaking Ladakh Journey',
    comment: 'Ladakh was a dream come true! The landscapes were absolutely stunning. Ali Tours & Travels handled everything perfectly - from permits to accommodation. Pangong Lake was mesmerizing!',
    isVerified: true,
    status: 'approved',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-10')
  },
  {
    id: 'REV003',
    userId: '2',
    userName: 'Anita Patel',
    userEmail: 'anita@example.com',
    rating: 4,
    title: 'Great Service Overall',
    comment: 'Very professional service from Ali Tours & Travels. The team was responsive and helpful throughout our booking process. Would definitely recommend to others planning their trips.',
    isVerified: false,
    status: 'approved',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-05')
  }
];

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);

  const addReview = (reviewData: Omit<ReviewType, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'isVerified'>): string => {
    const newId = `REV${Date.now()}`;
    const newReview: ReviewType = {
      ...reviewData,
      id: newId,
      status: 'pending',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setReviews(prev => [newReview, ...prev]);
    return newId;
  };

  const updateReviewStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id 
          ? { ...review, status, updatedAt: new Date() }
          : review
      )
    );
  };

  const getApprovedReviews = (): ReviewType[] => {
    return reviews.filter(review => review.status === 'approved');
  };

  const getReviewsByUserId = (userId: string): ReviewType[] => {
    return reviews.filter(review => review.userId === userId);
  };

  const getAllReviews = (): ReviewType[] => {
    return reviews;
  };

  return (
    <ReviewContext.Provider value={{
      reviews,
      addReview,
      updateReviewStatus,
      getApprovedReviews,
      getReviewsByUserId,
      getAllReviews
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};