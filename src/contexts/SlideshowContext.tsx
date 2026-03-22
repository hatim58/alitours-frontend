import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SlideType } from '../types';

interface SlideshowContextType {
  slides: SlideType[];
  addSlide: (slide: Omit<SlideType, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateSlide: (id: string, slide: Partial<SlideType>) => void;
  deleteSlide: (id: string) => void;
  getActiveSlides: () => SlideType[];
  reorderSlides: (slides: SlideType[]) => void;
}

const SlideshowContext = createContext<SlideshowContextType | undefined>(undefined);

// Sample initial slides
const initialSlides: SlideType[] = [
  {
    id: 'slide-1',
    title: 'Discover Paradise in Andaman',
    subtitle: 'Exclusive Island Adventures',
    description: 'Experience pristine beaches, crystal clear waters, and unforgettable memories with our specially curated Andaman tour packages.',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
    buttonText: 'Explore Packages',
    buttonLink: '/packages',
    isActive: true,
    order: 1,
    type: 'package',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'slide-2',
    title: 'Limited Time Offer',
    subtitle: 'Save Up to 30% on All Packages',
    description: 'Book your dream vacation now and save big! Special discount on all Andaman tour packages. Limited time offer.',
    image: 'https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg',
    buttonText: 'Book Now',
    buttonLink: '/booking',
    isActive: true,
    order: 2,
    type: 'offer',
    offerDetails: {
      discountPercentage: 30,
      validUntil: '2024-12-31'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'slide-3',
    title: 'Havelock Island Special',
    subtitle: 'Beach Paradise Awaits',
    description: 'Dive into the beauty of Havelock Island with our exclusive packages featuring water sports, beach resorts, and island hopping.',
    image: 'https://images.pexels.com/photos/5528991/pexels-photo-5528991.jpeg',
    buttonText: 'View Details',
    buttonLink: '/packages/havelock-escape',
    isActive: true,
    order: 3,
    type: 'package',
    packageId: 'havelock-escape',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
];

export const SlideshowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [slides, setSlides] = useState<SlideType[]>(initialSlides);

  const addSlide = (slideData: Omit<SlideType, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const newId = `slide-${Date.now()}`;
    const newSlide: SlideType = {
      ...slideData,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSlides(prev => [...prev, newSlide]);
    return newId;
  };

  const updateSlide = (id: string, slideData: Partial<SlideType>) => {
    setSlides(prev => 
      prev.map(slide => 
        slide.id === id 
          ? { ...slide, ...slideData, updatedAt: new Date() }
          : slide
      )
    );
  };

  const deleteSlide = (id: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== id));
  };

  const getActiveSlides = (): SlideType[] => {
    return slides
      .filter(slide => slide.isActive)
      .sort((a, b) => a.order - b.order);
  };

  const reorderSlides = (reorderedSlides: SlideType[]) => {
    const updatedSlides = reorderedSlides.map((slide, index) => ({
      ...slide,
      order: index + 1,
      updatedAt: new Date()
    }));
    setSlides(updatedSlides);
  };

  return (
    <SlideshowContext.Provider value={{
      slides,
      addSlide,
      updateSlide,
      deleteSlide,
      getActiveSlides,
      reorderSlides
    }}>
      {children}
    </SlideshowContext.Provider>
  );
};

export const useSlideshow = () => {
  const context = useContext(SlideshowContext);
  if (context === undefined) {
    throw new Error('useSlideshow must be used within a SlideshowProvider');
  }
  return context;
};