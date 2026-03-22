import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  FileText, 
  Calendar, 
  IndianRupee,
  User,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';
import { useInvoices } from '../../contexts/InvoiceContext';
import { useBookings } from '../../contexts/BookingContext';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';
import { format } from 'date-fns';

const AdminInvoices: React.FC = () => {
  const { getAllInvoices, updateInvoiceStatus } = useInvoices();
  const { getBookingById } = useBookings();
  const allInvoices = getAllInvoices();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter invoices
  const filteredInvoices = allInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailsOpen(true);
  };

  const closeInvoiceDetails = () => {
    setIsDetailsOpen(false);
    setSelectedInvoice(null);
  };

  const downloadInvoicePDF = (invoice: any) => {
    const booking = getBookingById(invoice.bookingId);
    if (!booking) return;

    const customer = {
      id: invoice.customerId,
      name: invoice.customerName,
      email: 'customer@example.com', // In real app, get from customer data
      phone: '+91 9876543210' // In real app, get from customer data
    };

    const invoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: format(new Date(invoice.invoiceDate), 'dd/MM/yyyy'),
      booking,
      customer,
      gstRate: invoice.gstRate,
      baseAmount: invoice.amount,
      gstAmount: invoice.gstAmount,
      totalAmount: invoice.totalAmount
    };

    const pdf = generateInvoicePDF(invoiceData);
    pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
  };

  const calculateTotalRevenue = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  };

  const calculateTotalGST = () => {
    return filteredInvoices.reduce((sum, invoice) => sum + invoice.gstAmount, 0);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <div className="flex gap-3">
          <button className="btn bg-green-600 text-white hover:bg-green-700 flex items-center">
            <Download size={16} className="mr-2" />
            Export GST Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
              <h3 className="text-2xl font-bold">{allInvoices.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{calculateTotalRevenue().toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <IndianRupee size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total GST</p>
              <h3 className="text-2xl font-bold">₹{calculateTotalGST().toLocaleString()}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <h3 className="text-2xl font-bold">
                {allInvoices.filter(inv => 
                  new Date(inv.invoiceDate).getMonth() === new Date().getMonth()
                ).length}
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-1">
            <Filter size={16} className="text-gray-500 mr-2" />
            <span className="text-sm mr-2">Status:</span>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'all' 
                  ? 'bg-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'generated' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('generated')}
            >
              Generated
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'sent' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('sent')}
            >
              Sent
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('paid')}
            >
              Paid
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{invoice.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate">
                      {invoice.packageName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">₹{invoice.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Base: ₹{invoice.amount.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div>₹{invoice.gstAmount.toLocaleString()}</div>
                        <div className="text-gray-500">({invoice.gstRate}%)</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => openInvoiceDetails(invoice)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 mr-3"
                        onClick={() => downloadInvoicePDF(invoice)}
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                      {invoice.status === 'generated' && (
                        <button
                          className="text-purple-600 hover:text-purple-800"
                          onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                          title="Mark as Sent"
                        >
                          <Send size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    No invoices found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {isDetailsOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Invoice Details</h3>
              <button 
                onClick={closeInvoiceDetails}
                className="text-white hover:text-primary-100"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold mb-2">TAX INVOICE</h2>
                <h3 className="text-xl font-semibold text-primary-600">ALI TOURS & TRAVELS</h3>
                <p className="text-sm text-gray-600">GSTIN: 22BFTPY7993F1ZH</p>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3">Invoice Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Date:</span>
                      <span className="font-medium">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SAC Code:</span>
                      <span className="font-medium">9998</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST Rate:</span>
                      <span className="font-medium">{selectedInvoice.gstRate}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedInvoice.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">{selectedInvoice.packageName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Amount Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST ({selectedInvoice.gstRate/2}%):</span>
                    <span>₹{(selectedInvoice.gstAmount/2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST ({selectedInvoice.gstRate/2}%):</span>
                    <span>₹{(selectedInvoice.gstAmount/2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => downloadInvoicePDF(selectedInvoice)}
                  className="btn bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Download size={16} className="mr-2" />
                  Download PDF
                </button>
                {selectedInvoice.status === 'generated' && (
                  <button 
                    onClick={() => updateInvoiceStatus(selectedInvoice.id, 'sent')}
                    className="btn bg-purple-600 text-white hover:bg-purple-700"
                  >
                    <Send size={16} className="mr-2" />
                    Mark as Sent
                  </button>
                )}
                {selectedInvoice.status === 'sent' && (
                  <button 
                    onClick={() => updateInvoiceStatus(selectedInvoice.id, 'paid')}
                    className="btn bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvoices;