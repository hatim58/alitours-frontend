import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { Booking, Customer, LedgerEntry, Transaction } from '../types/management';

export const exportCustomersToExcel = (customers: Customer[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    customers.map(customer => ({
      'Customer ID': customer.id,
      'Name': customer.name,
      'Email': customer.email,
      'Phone': customer.phone,
      'Address': customer.address,
      'GST Number': customer.gstNumber || '',
      'Balance': customer.balance,
      'Created At': format(new Date(customer.createdAt), 'dd/MM/yyyy')
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const exportBookingsToExcel = (bookings: Booking[], customers: Customer[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    bookings.map(booking => {
      const customer = customers.find(c => c.id === booking.customerId);
      return {
        'Booking ID': booking.id,
        'Customer': customer?.name || '',
        'Type': booking.type,
        'Status': booking.status,
        'Amount': booking.amount,
        'Paid Amount': booking.paidAmount,
        'Travel Date': format(new Date(booking.travelDate), 'dd/MM/yyyy'),
        'Booking Date': format(new Date(booking.bookingDate), 'dd/MM/yyyy')
      };
    })
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const exportLedgerToExcel = (entries: LedgerEntry[], customer: Customer) => {
  const worksheet = XLSX.utils.json_to_sheet(
    entries.map(entry => ({
      'Date': format(new Date(entry.date), 'dd/MM/yyyy'),
      'Description': entry.description,
      'Debit': entry.debit,
      'Credit': entry.credit,
      'Balance': entry.balance,
      'Reference': entry.reference
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Ledger - ${customer.name}`);
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};

export const exportTransactionsToExcel = (transactions: Transaction[], customers: Customer[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(transaction => {
      const customer = customers.find(c => c.id === transaction.customerId);
      return {
        'Transaction ID': transaction.id,
        'Customer': customer?.name || '',
        'Type': transaction.type,
        'Amount': transaction.amount,
        'Payment Method': transaction.paymentMethod,
        'Reference': transaction.reference,
        'Date': format(new Date(transaction.date), 'dd/MM/yyyy'),
        'Notes': transaction.notes || ''
      };
    })
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
};