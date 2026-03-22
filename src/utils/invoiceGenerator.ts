import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { BookingType, UserType } from '../types';

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  booking: BookingType;
  customer: UserType;
  gstRate: number;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
}

export const generateInvoicePDF = (invoiceData: InvoiceData) => {
  const doc = new jsPDF();
  const { booking, customer, invoiceNumber, invoiceDate, gstRate, baseAmount, gstAmount, totalAmount } = invoiceData;
  
  // Set margins
  const leftMargin = 20;
  const rightMargin = 190;
  const pageWidth = 210;
  
  // Header - TAX INVOICE
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', pageWidth/2, 20, { align: 'center' });
  
  // Company Name
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ALI TOURS & TRAVELS', pageWidth/2, 35, { align: 'center' });
  
  // Travel and Tourism Agency
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Travel and Tourism Agency', pageWidth/2, 45, { align: 'center' });
  
  // GSTIN
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('GSTIN: 22BFTPY7993F1ZH', pageWidth/2, 55, { align: 'center' });
  
  // Company Address
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const addressLines = [
    'Main Office: Bohra Complex Shop No. 3, Near Hirazy Sales,',
    'Jwali Nala, Telipara Road, Bilaspur, C.G. 495001',
    'Email: info@alitourstravels.in | Phone: 07752-480145'
  ];
  
  let yPos = 65;
  addressLines.forEach(line => {
    doc.text(line, pageWidth/2, yPos, { align: 'center' });
    yPos += 8;
  });
  
  // SAC Code and GST Rate
  doc.setFontSize(10);
  doc.text(`SAC Code: 9998 | GST Rate: ${gstRate}%`, pageWidth/2, yPos + 5, { align: 'center' });
  
  // Invoice Details Section
  yPos += 20;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice No: ${invoiceNumber}`, leftMargin, yPos);
  doc.text(`Invoice Date: ${invoiceDate}`, leftMargin, yPos + 10);
  doc.text(`Booking ID: ${booking.id}`, leftMargin, yPos + 20);
  doc.text(`Travel Date: ${format(new Date(booking.travelDate), 'dd/MM/yyyy')}`, leftMargin, yPos + 30);
  
  // Bill To Section
  yPos += 50;
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', leftMargin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(customer.name, leftMargin, yPos + 10);
  doc.text(`Email: ${customer.email}`, leftMargin, yPos + 20);
  doc.text(`Phone: ${customer.phone || 'N/A'}`, leftMargin, yPos + 30);
  
  // Service Details Table
  yPos += 50;
  
  // Create table data
  const tableData = [
    ['Description', 'SAC Code', 'Quantity', 'Rate (₹)', 'Amount (₹)'],
    [
      booking.packageName,
      '9998',
      booking.guests.toString(),
      (baseAmount / booking.guests).toLocaleString(),
      baseAmount.toLocaleString()
    ]
  ];
  
  // Generate table
  doc.autoTable({
    startY: yPos,
    head: [tableData[0]],
    body: [tableData[1]],
    theme: 'grid',
    styles: { 
      fontSize: 10,
      cellPadding: 8,
      textColor: [0, 0, 0]
    },
    headStyles: { 
      fillColor: [160, 60, 120], // Purple color as in template
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 60, halign: 'left' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: leftMargin, right: 20 }
  });
  
  // Totals Section
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  const totalsX = 140;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  
  // Subtotal
  doc.text('Subtotal:', totalsX, finalY);
  doc.text(`₹${baseAmount.toLocaleString()}`, rightMargin, finalY, { align: 'right' });
  
  // CGST
  doc.text(`CGST (${gstRate/2}%):`, totalsX, finalY + 10);
  doc.text(`₹${(gstAmount/2).toLocaleString()}`, rightMargin, finalY + 10, { align: 'right' });
  
  // SGST
  doc.text(`SGST (${gstRate/2}%):`, totalsX, finalY + 20);
  doc.text(`₹${(gstAmount/2).toLocaleString()}`, rightMargin, finalY + 20, { align: 'right' });
  
  // Total Amount
  doc.setFontSize(12);
  doc.text('Total Amount:', totalsX, finalY + 35);
  doc.text(`₹${totalAmount.toLocaleString()}`, rightMargin, finalY + 35, { align: 'right' });
  
  // Amount in Words
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Amount in Words:', leftMargin, finalY + 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`${numberToWords(totalAmount)} Rupees Only`, leftMargin, finalY + 60);
  
  // Terms & Conditions
  yPos = finalY + 80;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', leftMargin, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const terms = [
    '• Payment terms: 50% advance, balance before travel',
    '• Cancellation charges apply as per policy',
    '• Subject to Bilaspur jurisdiction',
    '• Prices subject to availability',
    '• Travel insurance recommended'
  ];
  
  terms.forEach((term, index) => {
    doc.text(term, leftMargin, yPos + 12 + (index * 8));
  });
  
  // Footer - Computer Generated Note
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('This is a computer-generated invoice. No signature is required.', pageWidth/2, yPos + 70, { align: 'center' });
  
  return doc;
};

// Helper function to convert numbers to words (Indian numbering system)
const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  
  const convertHundreds = (n: number): string => {
    let result = '';
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result.trim();
    }
    
    if (n > 0) {
      result += ones[n] + ' ';
    }
    
    return result.trim();
  };
  
  // Handle Indian numbering system (Crores, Lakhs, Thousands)
  if (num >= 10000000) { // Crores
    const crores = Math.floor(num / 10000000);
    const remainder = num % 10000000;
    return convertHundreds(crores) + ' Crore' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  } else if (num >= 100000) { // Lakhs
    const lakhs = Math.floor(num / 100000);
    const remainder = num % 100000;
    return convertHundreds(lakhs) + ' Lakh' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  } else if (num >= 1000) { // Thousands
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertHundreds(thousands) + ' Thousand' + (remainder > 0 ? ' ' + numberToWords(remainder) : '');
  } else {
    return convertHundreds(num);
  }
};

export const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const timestamp = Date.now().toString().slice(-6);
  return `ALI${year}${month}${day}${timestamp}`;
};