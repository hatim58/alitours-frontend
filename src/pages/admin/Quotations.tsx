import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash, 
  Download,
  Send,
  Calendar,
  IndianRupee,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useQuotations } from '../../contexts/QuotationContext';

const Quotations: React.FC = () => {
  const { quotations, updateQuotationStatus } = useQuotations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuotation, setSelectedQuotation] = useState<typeof quotations[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Filter quotations based on search term and status filter
  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = 
      quotation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || quotation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openQuotationDetails = (quotation: typeof quotations[0]) => {
    setSelectedQuotation(quotation);
    setIsDetailsOpen(true);
  };

  const closeQuotationDetails = () => {
    setIsDetailsOpen(false);
    setSelectedQuotation(null);
  };

  const openWhatsAppModal = (quotation: typeof quotations[0]) => {
    setSelectedQuotation(quotation);
    setWhatsappNumber(quotation.customerPhone);
    setIsWhatsAppModalOpen(true);
  };

  const sendQuotationViaWhatsApp = () => {
    if (!selectedQuotation) return;

    const quotationMessage = `*QUOTATION FROM ALI TOURS & TRAVELS*

📋 *Quotation ID:* ${selectedQuotation.id}
👤 *Customer:* ${selectedQuotation.customerName}
📅 *Date:* ${new Date(selectedQuotation.createdAt).toLocaleDateString()}
⏰ *Valid Until:* ${new Date(selectedQuotation.validUntil).toLocaleDateString()}

*QUOTATION DETAILS:*
${selectedQuotation.items.map((item, index) => 
  `${index + 1}. ${item.description}
   Qty: ${item.quantity} | Rate: ₹${item.unitPrice.toLocaleString()} | Amount: ₹${item.amount.toLocaleString()}${item.notes ? `\n   Note: ${item.notes}` : ''}`
).join('\n\n')}

*TOTAL AMOUNT: ₹${selectedQuotation.totalAmount.toLocaleString()}*

*Terms & Conditions:*
${selectedQuotation.terms.split('\n').map(term => term.trim()).filter(term => term).join('\n')}

${selectedQuotation.notes ? `*Additional Notes:*\n${selectedQuotation.notes}\n\n` : ''}For any queries or to confirm this quotation, please contact us:
📞 +91 78691-47222
📧 info@alitourstravels.in

Thank you for choosing Ali Tours & Travels! 🏝️`;

    const encodedMessage = encodeURIComponent(quotationMessage);
    const whatsappURL = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    setIsWhatsAppModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quotation Management</h1>
        <Link to="/admin/quotations/new" className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-2" />
          Create New Quotation
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Quotations</p>
              <h3 className="text-2xl font-bold">{quotations.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold">
                {quotations.filter(q => q.status === 'pending').length}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Accepted</p>
              <h3 className="text-2xl font-bold">
                {quotations.filter(q => q.status === 'accepted').length}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Value</p>
              <h3 className="text-2xl font-bold">
                ₹{quotations.reduce((sum, q) => sum + q.totalAmount, 0).toLocaleString()}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <IndianRupee size={20} className="text-purple-600" />
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
              placeholder="Search quotations..."
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
                statusFilter === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'accepted' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('accepted')}
            >
              Accepted
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quotation ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {quotation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{quotation.customerName}</div>
                        <div className="text-sm text-gray-500">{quotation.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(quotation.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{quotation.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => openQuotationDetails(quotation)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-800 mr-3"
                        onClick={() => openWhatsAppModal(quotation)}
                        title="Send via WhatsApp"
                      >
                        <Send size={18} />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800 mr-3"
                        title="Edit Quotation"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-800 mr-3"
                        title="Download PDF"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No quotations found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quotation Details Modal */}
      {isDetailsOpen && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Quotation Details</h3>
              <button 
                onClick={closeQuotationDetails}
                className="text-white hover:text-primary-100"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Quotation Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold mb-2">Quotation #{selectedQuotation.id}</h4>
                  <p className="text-gray-600">Created: {new Date(selectedQuotation.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-600">Valid Until: {new Date(selectedQuotation.validUntil).toLocaleDateString()}</p>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedQuotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    selectedQuotation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedQuotation.status.charAt(0).toUpperCase() + selectedQuotation.status.slice(1)}
                </span>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h5 className="font-semibold mb-2">Customer Information</h5>
                <p><strong>Name:</strong> {selectedQuotation.customerName}</p>
                <p><strong>Phone:</strong> {selectedQuotation.customerPhone}</p>
                {selectedQuotation.customerEmail && (
                  <p><strong>Email:</strong> {selectedQuotation.customerEmail}</p>
                )}
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <h5 className="font-semibold mb-4">Quotation Items</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left border-b">Description</th>
                        <th className="px-4 py-2 text-center border-b">Qty</th>
                        <th className="px-4 py-2 text-right border-b">Unit Price</th>
                        <th className="px-4 py-2 text-right border-b">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">
                            {item.description}
                            {item.notes && (
                              <div className="text-sm text-gray-500 mt-1">Note: {item.notes}</div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">₹{item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-2 text-right">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={3} className="px-4 py-2 text-right">Total Amount:</td>
                        <td className="px-4 py-2 text-right">₹{selectedQuotation.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="mb-6">
                <h5 className="font-semibold mb-2">Terms & Conditions</h5>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm">{selectedQuotation.terms}</pre>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedQuotation.notes && (
                <div className="mb-6">
                  <h5 className="font-semibold mb-2">Additional Notes</h5>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedQuotation.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => openWhatsAppModal(selectedQuotation)}
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  <Send size={16} className="mr-2" />
                  Send via WhatsApp
                </button>
                <button className="btn bg-purple-600 text-white hover:bg-purple-700">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </button>
                <button className="btn bg-blue-600 text-white hover:bg-blue-700">
                  <Edit size={16} className="mr-2" />
                  Edit Quotation
                </button>
                {selectedQuotation.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateQuotationStatus(selectedQuotation.id, 'accepted')}
                      className="btn bg-green-600 text-white hover:bg-green-700"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Accepted
                    </button>
                    <button 
                      onClick={() => updateQuotationStatus(selectedQuotation.id, 'rejected')}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      <XCircle size={16} className="mr-2" />
                      Mark as Rejected
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Send Modal */}
      {isWhatsAppModalOpen && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-green-600 text-white px-6 py-4">
              <h3 className="text-xl font-semibold">Send Quotation via WhatsApp</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Quotation: <strong>{selectedQuotation.id}</strong></p>
                <p className="text-gray-600 mb-4">Customer: <strong>{selectedQuotation.customerName}</strong></p>
              </div>

              <div className="mb-6">
                <label className="label">WhatsApp Number</label>
                <input
                  type="tel"
                  className="input"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="+91 9876543210"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the recipient's WhatsApp number with country code
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={sendQuotationViaWhatsApp}
                  className="btn bg-green-600 text-white hover:bg-green-700 flex-1"
                  disabled={!whatsappNumber.trim()}
                >
                  <Send size={16} className="mr-2" />
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotations;