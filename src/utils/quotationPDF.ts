import jsPDF from 'jspdf';
import { Quotation, Customer } from '../types/management';

export const generateQuotationPDF = (quotation: Partial<Quotation>, customer: Customer) => {
  const doc = new jsPDF();
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;

  const setFont = (size: number, weight: 'normal' | 'bold' = 'normal') => {
    doc.setFont('Times', weight);
    doc.setFontSize(size);
  };

  const addText = (text: string, size: number, weight: 'normal' | 'bold' = 'normal', align: 'left' | 'center' | 'right' = 'left') => {
    setFont(size, weight);
    doc.text(text, margin, yPosition, { align, maxWidth });
    yPosition += 8;
  };

  const addMultilineText = (label: string, text: string) => {
    setFont(10, 'bold');
    doc.text(label, margin, yPosition);
    yPosition += 6;

    setFont(10);
    const lines = doc.splitTextToSize(text || 'N/A', maxWidth - 5);
    doc.text(lines, margin + 5, yPosition);
    yPosition += lines.length * 5 + 3;
  };

  const addSeparator = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
  };

  const checkPageBreak = (space: number = 15) => {
    if (yPosition + space > pageHeight - 20) {
      doc.addPage();
      yPosition = 20;
    }
  };

  addText('ALI TOURS & TRAVELS', 18, 'bold', 'center');
  addText('QUOTATION', 14, 'bold', 'center');
  yPosition += 5;

  addSeparator();

  addText(`Quotation Date: ${new Date().toLocaleDateString()}`, 10);
  addText(`Valid Until: ${quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'N/A'}`, 10);
  yPosition += 3;

  addSeparator();

  addText('QUOTATION FOR:', 11, 'bold');
  addText(`Customer Name: ${customer.name}`, 10);
  addText(`Email: ${customer.email}`, 10);
  addText(`Phone: ${customer.phone}`, 10);
  if (customer.address) addText(`Address: ${customer.address}`, 10);
  if (customer.gstNumber) addText(`GST Number: ${customer.gstNumber}`, 10);
  yPosition += 3;

  addSeparator();

  addText('TOUR PACKAGE DETAILS:', 11, 'bold');
  checkPageBreak(5);

  if (quotation.packageName) {
    addText(`Package Name: ${quotation.packageName}`, 10);
  }
  if (quotation.tourRoute) {
    addText(`Tour Route: ${quotation.tourRoute}`, 10);
  }
  if (quotation.duration) {
    addText(`Duration: ${quotation.duration}`, 10);
  }
  if (quotation.noOfTravellers) {
    addText(`Number of Travellers: ${quotation.noOfTravellers}`, 10);
  }
  if (quotation.travelDate) {
    addText(`Travel Date: ${new Date(quotation.travelDate).toLocaleDateString()}`, 10);
  }

  yPosition += 3;

  checkPageBreak(10);
  addMultilineText('PACKAGE INCLUSIONS:', quotation.packageInclusion || '');

  checkPageBreak(10);
  addMultilineText('PACKAGE EXCLUSIONS:', quotation.packageExclusion || '');

  if (quotation.note) {
    checkPageBreak(10);
    addMultilineText('ADDITIONAL NOTES:', quotation.note);
  }

  checkPageBreak(10);
  addMultilineText('ADVANCE POLICY:', quotation.advancePolicy || '');

  checkPageBreak(10);
  addMultilineText('CANCELLATION POLICY:', quotation.cancellationPolicy || '');

  addSeparator();

  setFont(12, 'bold');
  doc.text(`Total Amount: ₹${(quotation.totalAmount || 0).toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  addSeparator();

  yPosition += 5;
  addText('CONTACT INFORMATION:', 10, 'bold');
  addText('📞 +91 9111917200', 9);
  addText('✉️ info@alitourstravels.in', 9);
  addText('SN3, Bohra Complex, Lane in Hirazy Sales, Jwali Nala, Telipara Road, Bilaspur', 8);

  yPosition += 10;
  addSeparator();

  setFont(8);
  doc.text('Thank you for choosing Ali Tours & Travels!', pageWidth / 2, pageHeight - 10, { align: 'center' });

  const filename = `Quotation_${customer.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
