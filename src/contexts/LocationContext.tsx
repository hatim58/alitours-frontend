import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LocationType } from '../types';
import { locations as initialLocations } from '../data/locations';

interface LocationContextType {
  locations: LocationType[];
  addLocation: (locationData: Omit<LocationType, 'id'>) => string;
  updateLocation: (id: string, locationData: Partial<LocationType>) => void;
  deleteLocation: (id: string) => void;
  getLocationById: (id: string) => LocationType | undefined;
  getLocationBySlug: (slug: string) => LocationType | undefined;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationType[]>(initialLocations);

  const addLocation = (locationData: Omit<LocationType, 'id'>): string => {
    const newId = `loc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newLocation: LocationType = {
      ...locationData,
      id: newId,
    };

    setLocations(prev => [newLocation, ...prev]);
    return newId;
  };

  const updateLocation = (id: string, locationData: Partial<LocationType>) => {
    setLocations(prev => 
      prev.map(loc => 
        loc.id === id ? { ...loc, ...locationData } : loc
      )
    );
  };

  const deleteLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  const getLocationById = (id: string): LocationType | undefined => {
    return locations.find(loc => loc.id === id);
  };

  const getLocationBySlug = (slug: string): LocationType | undefined => {
    return locations.find(loc => loc.slug === slug);
  };

  return (
    <LocationContext.Provider value={{
      locations,
      addLocation,
      updateLocation,
      deleteLocation,
      getLocationById,
      getLocationBySlug
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocations = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocations must be used within a LocationProvider');
  }
  return context;
};
