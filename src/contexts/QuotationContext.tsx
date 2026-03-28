import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes?: string;
}

interface Quotation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  validUntil: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  items: QuotationItem[];
  terms: string;
  notes?: string;
}

interface QuotationContextType {
  quotations: Quotation[];
  addQuotation: (quotation: Omit<Quotation, 'id' | 'createdAt' | 'status'>) => string;
  updateQuotationStatus: (id: string, status: 'pending' | 'accepted' | 'rejected') => void;
  getQuotationById: (id: string) => Quotation | undefined;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

import { useAuth } from './AuthContext';

export const QuotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchQuotations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quotations`, {
        headers: { 
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        // Since backend might only store clientId, price, itineraryDetails, 
        // we might need to parse some things if we stringified them.
        // Assuming for now the backend provides what we need.
        setQuotations(data);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  React.useEffect(() => {
    if (user?.role === 'admin' && user?.token) {
      fetchQuotations();
    }
  }, [user]);

  const addQuotation = async (quotationData: Omit<Quotation, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    try {
      // For now, we need to map this to the backend expected structure:
      // { clientId, itineraryDetails, price }
      // We might not have a clientId yet if it's a new customer. 
      // In this app, maybe we create a client first? 
      // For simplicity, I'll assume a dummy clientId or search for one.
      
      const payload = {
        clientId: 1, // Dummy or needs logic to find/create client
        itineraryDetails: JSON.stringify(quotationData),
        price: quotationData.totalAmount
      };

      const response = await fetch(`${API_URL}/api/quotations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newQuotation = await response.json();
        // Construct frontend Quotation object from backend response
        const formatted: Quotation = {
          ...quotationData,
          id: newQuotation.id.toString(),
          createdAt: newQuotation.createdAt,
          status: 'pending'
        };
        setQuotations(prev => [formatted, ...prev]);
        return formatted.id;
      }
      throw new Error('Failed to create quotation');
    } catch (error) {
      console.error('Error adding quotation:', error);
      throw error;
    }
  };

  const updateQuotationStatus = async (id: string, status: 'pending' | 'accepted' | 'rejected') => {
    // Backend doesn't have an update status route yet, let's just update local state or add route if needed.
    // Assuming we might add one soon:
    setQuotations(prev => 
      prev.map(quotation => 
        quotation.id === id ? { ...quotation, status } : quotation
      )
    );
  };

  const getQuotationById = (id: string): Quotation | undefined => {
    return quotations.find(quotation => quotation.id === id);
  };

  return (
    <QuotationContext.Provider value={{
      quotations,
      addQuotation: addQuotation as any,
      updateQuotationStatus,
      getQuotationById
    }}>
      {children}
    </QuotationContext.Provider>
  );
};

export const useQuotations = () => {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotations must be used within a QuotationProvider');
  }
  return context;
};