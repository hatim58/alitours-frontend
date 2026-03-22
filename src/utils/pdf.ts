import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { Quotation, Customer, Booking, LedgerEntry } from '../types/management';

export const generateQuotationPDF = (quotation: Quotation, customer: Customer) => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('Ali Tours & Travels', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Travel and Tourism Agency', 105, 30, { align: 'center' });
  
  // Add quotation details
  doc.setFontSize(14);
  doc.text(`Quotation #${quotation.id}`, 20, 50);
  doc.setFontSize(10);
  doc.text(`Date: ${format(new Date(quotation.createdAt), 'dd/MM/yyyy')}`, 20, 60);
  doc.text(`Valid Until: ${format(new Date(quotation.validUntil), 'dd/MM/yyyy')}`, 20, 70);
  
  // Add customer details
  doc.text('Customer Details:', 20, 90);
  doc.text(`Name: ${customer.name}`, 20, 100);
  doc.text(`Phone: ${customer.phone}`, 20, 110);
  doc.text(`Email: ${customer.email}`, 20, 120);
  doc.text(`Address: ${customer.address}`, 20, 130);
  
  // Add items table
  doc.autoTable({
    startY: 150,
    head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
    body: quotation.items.map(item => [
      item.description,
      item.quantity,
      `₹${item.unitPrice.toLocaleString()}`,
      `₹${item.amount.toLocaleString()}`
    ]),
    foot: [[
      'Total Amount',
      '',
      '',
      `₹${quotation.totalAmount.toLocaleString()}`
    ]],
  });
  
  // Add terms and conditions
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.text('Terms & Conditions:', 20, finalY + 20);
  quotation.terms.forEach((term, index) => {
    doc.text(`${index + 1}. ${term}`, 20, finalY + 30 + (index * 10));
  });
  
  return doc;
};

export const generateLedgerPDF = (customer: Customer, entries: LedgerEntry[]) => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('Ali Tours & Travels', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Travel and Tourism Agency', 105, 30, { align: 'center' });
  
  // Add customer details
  doc.setFontSize(14);
  doc.text('Customer Ledger', 20, 50);
  doc.setFontSize(10);
  doc.text(`Customer: ${customer.name}`, 20, 60);
  doc.text(`Phone: ${customer.phone}`, 20, 70);
  doc.text(`Current Balance: ₹${customer.balance.toLocaleString()}`, 20, 80);
  
  // Add ledger entries table
  doc.autoTable({
    startY: 100,
    head: [['Date', 'Description', 'Debit', 'Credit', 'Balance']],
    body: entries.map(entry => [
      format(new Date(entry.date), 'dd/MM/yyyy'),
      entry.description,
      entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '',
      entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '',
      `₹${entry.balance.toLocaleString()}`
    ]),
  });
  
  return doc;
};

export const generateBookingPDF = (booking: Booking, customer: Customer) => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.text('Ali Tours & Travels', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Travel and Tourism Agency', 105, 30, { align: 'center' });
  
  // Add booking details
  doc.setFontSize(14);
  doc.text(`Booking Confirmation #${booking.id}`, 20, 50);
  doc.setFontSize(10);
  doc.text(`Date: ${format(new Date(booking.bookingDate), 'dd/MM/yyyy')}`, 20, 60);
  doc.text(`Travel Date: ${format(new Date(booking.travelDate), 'dd/MM/yyyy')}`, 20, 70);
  
  // Add customer details
  doc.text('Customer Details:', 20, 90);
  doc.text(`Name: ${customer.name}`, 20, 100);
  doc.text(`Phone: ${customer.phone}`, 20, 110);
  doc.text(`Email: ${customer.email}`, 20, 120);
  
  // Add booking details based on type
  doc.text('Booking Details:', 20, 140);
  doc.text(`Type: ${booking.type}`, 20, 150);
  doc.text(`Status: ${booking.status}`, 20, 160);
  doc.text(`Amount: ₹${booking.amount.toLocaleString()}`, 20, 170);
  doc.text(`Paid Amount: ₹${booking.paidAmount.toLocaleString()}`, 20, 180);
  
  // Add passenger details
  if (booking.details.passengers.length > 0) {
    doc.autoTable({
      startY: 200,
      head: [['Passenger Name', 'Age', 'Gender', 'ID Type', 'ID Number']],
      body: booking.details.passengers.map(passenger => [
        passenger.name,
        passenger.age,
        passenger.gender,
        passenger.idType,
        passenger.idNumber
      ]),
    });
  }
  
  return doc;
};