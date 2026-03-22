import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingType } from '../types';

interface BookingContextType {
  bookings: BookingType[];
  addBooking: (bookingData: Omit<BookingType, 'id' | 'createdAt'>) => string;
  updateBookingStatus: (id: string, status: 'pending' | 'confirmed' | 'cancelled') => void;
  getBookingsByUserId: (userId: string) => BookingType[];
  getBookingById: (id: string) => BookingType | undefined;
  getAllBookings: () => BookingType[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Sample initial bookings data
const initialBookings: BookingType[] = [
  {
    id: 'BK1001',
    packageId: 'andaman-explorer',
    packageName: 'Andaman Explorer',
    userId: '2',
    userName: 'Test User',
    email: 'user@example.com',
    phone: '9876543211',
    travelDate: '2024-05-15',
    guests: 2,
    totalPrice: 45998,
    status: 'confirmed',
    specialRequests: 'Vegetarian meals preferred',
    createdAt: new Date('2024-04-15')
  },
  {
    id: 'BK1002',
    packageId: 'havelock-escape',
    packageName: 'Havelock Island Escape',
    userId: '2',
    userName: 'Test User',
    email: 'user@example.com',
    phone: '9876543211',
    travelDate: '2024-06-20',
    guests: 3,
    totalPrice: 67997,
    status: 'pending',
    specialRequests: 'Need airport pickup',
    createdAt: new Date('2024-04-20')
  }
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingType[]>(initialBookings);

  const addBooking = (bookingData: Omit<BookingType, 'id' | 'createdAt'>): string => {
    const newId = `BK${Date.now()}`;
    const newBooking: BookingType = {
      ...bookingData,
      id: newId,
      createdAt: new Date()
    };

    setBookings(prev => [newBooking, ...prev]);
    return newId;
  };

  const updateBookingStatus = (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const getBookingsByUserId = (userId: string): BookingType[] => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getBookingById = (id: string): BookingType | undefined => {
    return bookings.find(booking => booking.id === id);
  };

  const getAllBookings = (): BookingType[] => {
    return bookings;
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      getBookingsByUserId,
      getBookingById,
      getAllBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};