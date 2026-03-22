import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash, 
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  FileText
} from 'lucide-react';
import { getCustomerDatabase } from '../../contexts/AuthContext';


const Customers: React.FC = () => {
  // Get real customer data from AuthContext
  const customersData = getCustomerDatabase();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customersData[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  
  // Filter customers based on search term and status filter
  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const openCustomerDetails = (customer: typeof customersData[0]) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };
  
  const closeCustomerDetails = () => {
    setIsDetailsOpen(false);
    setSelectedCustomer(null);
  };

  const exportCustomers = () => {
    // In a real app, this would generate and download an Excel file
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={exportCustomers}
            className="btn bg-green-600 text-white hover:bg-green-700 flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export Data
          </button>
          <button 
            onClick={() => setIsAddCustomerOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Customers</p>
              <h3 className="text-2xl font-bold">{customersData.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <User size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Customers</p>
              <h3 className="text-2xl font-bold">
                {customersData.filter(c => c.status === 'active').length}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <User size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                ₹{customersData.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <IndianRupee size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg. Booking Value</p>
              <h3 className="text-2xl font-bold">
                ₹{Math.round(customersData.reduce((sum, c) => sum + c.totalSpent, 0) / 
                  customersData.reduce((sum, c) => sum + c.totalBookings, 0) || 0).toLocaleString()}
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FileText size={20} className="text-orange-600" />
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
              placeholder="Search customers..."
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
                statusFilter === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'inactive' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
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
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium mr-3">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(customer.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalBookings} bookings</div>
                      {customer.lastBooking && (
                        <div className="text-sm text-gray-500">
                          Last: {new Date(customer.lastBooking).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        onClick={() => openCustomerDetails(customer)}
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800 mr-3"
                        title="Edit Customer"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Delete Customer"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    No customers found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Customer Details Modal */}
      {isDetailsOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Customer Details</h3>
              <button 
                onClick={closeCustomerDetails}
                className="text-white hover:text-primary-100"
              >
                <Eye size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Customer Header */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl mr-4">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold">{selectedCustomer.name}</h4>
                  <p className="text-gray-600">Customer ID: {selectedCustomer.id}</p>
                  <span 
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Customer Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h5 className="font-semibold mb-4 flex items-center">
                    <Mail size={18} className="mr-2 text-primary-600" />
                    Contact Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail size={16} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone size={16} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin size={16} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{selectedCustomer.address}</p>
                      </div>
                    </div>
                    {selectedCustomer.gstNumber && (
                      <div className="flex items-start">
                        <FileText size={16} className="mr-2 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">GST Number</p>
                          <p className="font-medium">{selectedCustomer.gstNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Booking Statistics */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h5 className="font-semibold mb-4 flex items-center">
                    <Calendar size={18} className="mr-2 text-primary-600" />
                    Booking Statistics
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Calendar size={16} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Registration Date</p>
                        <p className="font-medium">{new Date(selectedCustomer.registrationDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileText size={16} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="font-medium">{selectedCustomer.totalBookings}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <IndianRupee size={16} className="mr-2 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Total Spent</p>
                        <p className="font-medium">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                      </div>
                    </div>
                    {selectedCustomer.lastBooking && (
                      <div className="flex items-start">
                        <Calendar size={16} className="mr-2 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Last Booking</p>
                          <p className="font-medium">{new Date(selectedCustomer.lastBooking).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              {selectedCustomer.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                  <h5 className="font-semibold mb-2">Notes</h5>
                  <p className="text-gray-700">{selectedCustomer.notes}</p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                <button className="btn bg-blue-600 text-white hover:bg-blue-700">
                  <Edit size={16} className="mr-2" />
                  Edit Customer
                </button>
                <button className="btn bg-green-600 text-white hover:bg-green-700">
                  <Plus size={16} className="mr-2" />
                  New Booking
                </button>
                <button className="btn bg-purple-600 text-white hover:bg-purple-700">
                  <FileText size={16} className="mr-2" />
                  View Ledger
                </button>
                <button className="btn bg-orange-600 text-white hover:bg-orange-700">
                  <Download size={16} className="mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;