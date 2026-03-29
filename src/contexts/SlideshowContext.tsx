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

import kashmirImg from '../assets/kashmir.jpg';
import ladakhImg from '../assets/ladakh.jpg';
import finlandImg from '../assets/finland.jpg';
import turkeyImg from '../assets/turkey.jpg';
import andamanImg from '../assets/andaman.jpg';

const initialSlides: SlideType[] = [
  {
    id: 'slide-1',
    title: 'Heaven on Earth: Kashmir',
    subtitle: 'Paradise Found',
    description: 'Breathtaking landscapes, serene Dal Lake, and the majestic Himalayas await you in the valley of Kashmir.',
    image: kashmirImg,
    buttonText: 'Explore Kashmir',
    buttonLink: '/packages/kashmir-paradise',
    isActive: true,
    order: 1,
    type: 'package',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'slide-2',
    title: 'Adventure in Ladakh',
    subtitle: 'The Land of High Passes',
    description: 'Conquer the highest motorable roads and find inner peace in the ancient monasteries of Ladakh.',
    image: ladakhImg,
    buttonText: 'View Ladakh Trips',
    buttonLink: '/packages/ladakh-adventure',
    isActive: true,
    order: 2,
    type: 'package',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'slide-3',
    title: 'Northern Lights in Finland',
    subtitle: 'Arctic Magic',
    description: 'Experience the magical Aurora Borealis and the winter wonderland of Finland like never before.',
    image: finlandImg,
    buttonText: 'Winter Packages',
    buttonLink: '/packages',
    isActive: true,
    order: 3,
    type: 'package',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'slide-4',
    title: 'Magnificent Turkey',
    subtitle: 'Where East Meets West',
    description: 'Explore the historical wonders, vibrant bazaars, and stunning coastlines of beautiful Turkey.',
    image: turkeyImg,
    buttonText: 'Discover Turkey',
    buttonLink: '/packages',
    isActive: true,
    order: 4,
    type: 'package',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: 'slide-5',
    title: 'Tropical Andaman',
    subtitle: 'Island Paradise',
    description: 'Dive into turquoise waters and relax on the white sandy beaches of the Andaman Islands.',
    image: andamanImg,
    buttonText: 'Explore Andaman',
    buttonLink: '/packages/andaman-explorer',
    isActive: true,
    order: 5,
    type: 'package',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
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