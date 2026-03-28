import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LocationType } from '../types';
import { useAuth } from './AuthContext';

interface LocationContextType {
  locations: LocationType[];
  addLocation: (locationData: Omit<LocationType, 'id'>) => Promise<string>;
  updateLocation: (id: string, locationData: Partial<LocationType>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  getLocationById: (id: string) => LocationType | undefined;
  getLocationBySlug: (slug: string) => LocationType | undefined;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/locations`);
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  React.useEffect(() => {
    fetchLocations();
  }, []);

  const addLocation = async (locationData: Omit<LocationType, 'id'>): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/api/locations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(locationData),
      });

      if (response.ok) {
        const newLocation = await response.json();
        setLocations(prev => [newLocation, ...prev]);
        return newLocation.id;
      }
      throw new Error('Failed to add location');
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const updateLocation = async (id: string, locationData: Partial<LocationType>) => {
    try {
      const response = await fetch(`${API_URL}/api/locations/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(locationData),
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations(prev => 
          prev.map(loc => loc.id === id ? updatedLocation : loc)
        );
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/locations/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setLocations(prev => prev.filter(loc => loc.id !== id));
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
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
      addLocation: addLocation as any,
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
