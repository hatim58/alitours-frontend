import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BookingType, UserType } from '../types';

interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  packageName: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  gstRate: number;
  invoiceDate: string;
  status: 'generated' | 'sent' | 'paid';
  createdAt: Date;
}

interface InvoiceContextType {
  invoices: Invoice[];
  generateInvoice: (booking: BookingType, customer: UserType) => string;
  getInvoicesByCustomerId: (customerId: string) => Invoice[];
  getAllInvoices: () => Invoice[];
  updateInvoiceStatus: (invoiceId: string, status: 'generated' | 'sent' | 'paid') => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

// Sample initial invoices
const initialInvoices: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'ALI240501001',
    bookingId: 'BK1001',
    customerId: '2',
    customerName: 'Test User',
    packageName: 'Andaman Explorer',
    amount: 43808,
    gstAmount: 2190,
    totalAmount: 45998,
    gstRate: 5,
    invoiceDate: '2024-05-01',
    status: 'generated',
    createdAt: new Date('2024-05-01')
  }
];

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const generateInvoice = (booking: BookingType, customer: UserType): string => {
    const invoiceNumber = `ALI${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${Date.now().toString().slice(-6)}`;
    const gstRate = 5; // 5% GST for travel services
    const baseAmount = Math.round(booking.totalPrice / (1 + gstRate / 100)); // Extract base amount
    const gstAmount = booking.totalPrice - baseAmount; // Calculate GST amount
    
    const newInvoice: Invoice = {
      id: `INV${Date.now()}`,
      invoiceNumber,
      bookingId: booking.id,
      customerId: customer.id,
      customerName: customer.name,
      packageName: booking.packageName,
      amount: baseAmount,
      gstAmount,
      totalAmount: booking.totalPrice,
      gstRate,
      invoiceDate: new Date().toISOString().split('T')[0],
      status: 'generated',
      createdAt: new Date()
    };

    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice.id;
  };

  const getInvoicesByCustomerId = (customerId: string): Invoice[] => {
    return invoices.filter(invoice => invoice.customerId === customerId);
  };

  const getAllInvoices = (): Invoice[] => {
    return invoices;
  };

  const updateInvoiceStatus = (invoiceId: string, status: 'generated' | 'sent' | 'paid') => {
    setInvoices(prev => 
      prev.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, status } : invoice
      )
    );
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      generateInvoice,
      getInvoicesByCustomerId,
      getAllInvoices,
      updateInvoiceStatus
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};