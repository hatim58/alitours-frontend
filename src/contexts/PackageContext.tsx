import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PackageType } from '../types';
import { packages as initialPackages } from '../data/packages';

interface PackageContextType {
  packages: PackageType[];
  addPackage: (packageData: Omit<PackageType, 'id' | 'rating' | 'reviews'>) => string;
  updatePackage: (id: string, packageData: Partial<PackageType>) => void;
  deletePackage: (id: string) => void;
  getPackageById: (id: string) => PackageType | undefined;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const PackageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<PackageType[]>(initialPackages);

  const addPackage = (packageData: Omit<PackageType, 'id' | 'rating' | 'reviews'>): string => {
    const newId = `pkg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPackage: PackageType = {
      ...packageData,
      id: newId,
      rating: 4.5, // Default rating for new packages
      reviews: 0, // Start with 0 reviews
    };

    setPackages(prev => [newPackage, ...prev]);
    return newId;
  };

  const updatePackage = (id: string, packageData: Partial<PackageType>) => {
    setPackages(prev => 
      prev.map(pkg => 
        pkg.id === id ? { ...pkg, ...packageData } : pkg
      )
    );
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
  };

  const getPackageById = (id: string): PackageType | undefined => {
    return packages.find(pkg => pkg.id === id);
  };

  return (
    <PackageContext.Provider value={{
      packages,
      addPackage,
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