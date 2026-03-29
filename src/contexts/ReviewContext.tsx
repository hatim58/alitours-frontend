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
    userId: '1',
    userName: 'hatim husain',
    userEmail: 'hatim@example.com',
    rating: 5,
    title: 'The best travel agent!',
    comment: 'The best travel agent I have ever met!!! Book confidently.',
    isVerified: true,
    status: 'approved',
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-25')
  },
  {
    id: 'REV002',
    userId: '2',
    userName: 'Tasneem Nalwala',
    userEmail: 'tasneem@example.com',
    rating: 5,
    title: 'Lovely experience in Manali',
    comment: 'We had a lovely experience in Manali-Kullu & Kasol. Ali tours & travels suggested a perfect itinerary with all activities including road trip & hotel accommodations.',
    isVerified: true,
    status: 'approved',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'REV003',
    userId: '3',
    userName: 'Khatu shyam Baba',
    userEmail: 'khatu@example.com',
    rating: 5,
    title: 'Unforgettable Bandhavgarh tour',
    comment: 'An unforgettable experience! Ali Tours & Travels organized our Bandhavgarh tour flawlessly. From comfortable transportation to well-planned safaris and stays, every detail was taken care of. Their team is professional, polite, and truly...',
    isVerified: true,
    status: 'approved',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15')
  },
  {
    id: 'REV004',
    userId: '4',
    userName: 'Burhanuddin Santrod',
    userEmail: 'burhan@example.com',
    rating: 5,
    title: 'Best service provider',
    comment: 'Best service provider for train & flight tickets! His way of explaining and thinking from customers point of view is amazing! Everyone should must try his service once! Thanks bhai for making my journey comfortable 😊🙏🏻',
    isVerified: true,
    status: 'approved',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-10')
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