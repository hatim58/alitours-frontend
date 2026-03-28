import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PackageType } from '../types';

interface PackageContextType {
  packages: PackageType[];
  addPackage: (packageData: Omit<PackageType, 'id' | 'rating' | 'reviews'>) => string;
  updatePackage: (id: string, packageData: Partial<PackageType>) => void;
  deletePackage: (id: string) => void;
  getPackageById: (id: string) => PackageType | undefined;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

import { useAuth } from './AuthContext';

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/packages`);
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  React.useEffect(() => {
    fetchPackages();
  }, []);

  const addPackage = async (packageData: Omit<PackageType, 'id' | 'rating' | 'reviews'>): Promise<string> => {
    try {
      const response = await fetch(`${API_URL}/api/packages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        const newPackage = await response.json();
        setPackages(prev => [newPackage, ...prev]);
        return newPackage.id;
      }
      throw new Error('Failed to create package');
    } catch (error) {
      console.error('Error adding package:', error);
      throw error;
    }
  };

  const updatePackage = async (id: string, packageData: Partial<PackageType>) => {
    try {
      const response = await fetch(`${API_URL}/api/packages/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        setPackages(prev => 
          prev.map(pkg => pkg.id === id ? updatedPackage : pkg)
        );
      }
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/packages/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        setPackages(prev => prev.filter(pkg => pkg.id !== id));
      }
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const getPackageById = (id: string): PackageType | undefined => {
    return packages.find(pkg => pkg.id === id);
  };

  return (
    <PackageContext.Provider value={{
      packages,
      addPackage: addPackage as any, // Temporary cast for compatibility
      updatePackage,
      deletePackage,
      getPackageById
    }}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
};