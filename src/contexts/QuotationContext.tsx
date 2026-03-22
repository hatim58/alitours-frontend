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

// Sample initial data
const initialQuotations: Quotation[] = [
  {
    id: 'QT001',
    customerId: 'CUST001',
    customerName: 'Rahul Sharma',
    customerPhone: '+91 9876543210',
    customerEmail: 'rahul@example.com',
    validUntil: '2024-06-15',
    totalAmount: 125000,
    status: 'pending',
    createdAt: '2024-05-20',
    terms: `• This quotation is valid for 15 days from the date of issue
• 50% advance payment required to confirm booking
• Balance payment due before travel date
• Prices are subject to availability at the time of booking
• Cancellation charges as per our policy
• All rates are inclusive of GST`,
    items: [
      { description: 'Andaman Explorer Package (5 Days)', quantity: 2, unitPrice: 25000, amount: 50000 },
      { description: 'Flight Tickets (Delhi to Port Blair)', quantity: 2, unitPrice: 15000, amount: 30000 },
      { description: 'Airport Transfers', quantity: 1, unitPrice: 5000, amount: 5000 },
      { description: 'Travel Insurance', quantity: 2, unitPrice: 2000, amount: 4000 }
    ]
  },
  {
    id: 'QT002',
    customerId: 'CUST002',
    customerName: 'Priya Patel',
    customerPhone: '+91 9876543211',
    customerEmail: 'priya@example.com',
    validUntil: '2024-06-10',
    totalAmount: 85000,
    status: 'accepted',
    createdAt: '2024-05-18',
    terms: `• This quotation is valid for 15 days from the date of issue
• 50% advance payment required to confirm booking
• Balance payment due before travel date
• Prices are subject to availability at the time of booking
• Cancellation charges as per our policy
• All rates are inclusive of GST`,
    items: [
      { description: 'Havelock Island Escape (4 Days)', quantity: 2, unitPrice: 20000, amount: 40000 },
      { description: 'Scuba Diving Package', quantity: 2, unitPrice: 8000, amount: 16000 },
      { description: 'Hotel Upgrade to Sea View', quantity: 2, unitPrice: 5000, amount: 10000 }
    ]
  }
];

export const QuotationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);

  const addQuotation = (quotationData: Omit<Quotation, 'id' | 'createdAt' | 'status'>): string => {
    const newId = `QT${String(Date.now()).slice(-6)}`;
    const newQuotation: Quotation = {
      ...quotationData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setQuotations(prev => [newQuotation, ...prev]);
    return newId;
  };

  const updateQuotationStatus = (id: string, status: 'pending' | 'accepted' | 'rejected') => {
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
      addQuotation,
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