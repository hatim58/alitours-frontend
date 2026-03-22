import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Eye, 
  XCircle, 
  CheckCircle, 
  RefreshCw,
  Calendar,
  Download
} from 'lucide-react';
import { useBookings } from '../../contexts/BookingContext';
import { usePackages } from '../../contexts/PackageContext';

const Bookings: React.FC = () => {
  const { getAllBookings, updateBookingStatus } = useBookings();
  const { getPackageById } = usePackages();
  const bookingsData = getAllBookings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Filter bookings based on search term and status filter
  const filteredBookings = bookingsData.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const openBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };
  
  const closeBookingDetails = () => {
    setIsDetailsOpen(false);
  };
  
  const handleStatusUpdate = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    updateBookingStatus(bookingId, newStatus);
    if (selectedBooking && selectedBooking.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus });
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <button className="btn btn-primary flex items-center">
          <Download size={16} className="mr-2" />
          Export Bookings
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
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
                statusFilter === 'confirmed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                statusFilter === 'cancelled' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setStatusFilter('cancelled')}
            >
              Cancelled
            </button>
          </div>
          
          {/* Date Filter Button */}
          <button className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm">Filter by Date</span>
            <ChevronDown size={14} className="ml-2" />
          </button>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
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
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate">
                      {booking.packageName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.travelDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.guests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ₹{booking.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-primary-600 hover:text-primary-800 mr-3"
                        onClick={() => openBookingDetails(booking)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    No bookings found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Booking Details Modal */}
      {isDetailsOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Booking Details</h3>
              <button 
                onClick={closeBookingDetails}
                className="text-white hover:text-primary-100"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-sm text-gray-500">Booking ID</span>
                  <h4 className="font-bold text-xl">{selectedBooking.id}</h4>
                </div>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3 text-gray-700">Customer Information</h5>
                  <ul className="space-y-3">
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Name</span>
                      <span>{selectedBooking.userName}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Email</span>
                      <span>{selectedBooking.email}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span>{selectedBooking.phone}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-3 text-gray-700">Booking Information</h5>
                  <ul className="space-y-3">
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Package</span>
                      <span>{selectedBooking.packageName}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Travel Date</span>
                      <span>{new Date(selectedBooking.travelDate).toLocaleDateString()}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Number of Guests</span>
                      <span>{selectedBooking.guests} {selectedBooking.guests === 1 ? 'person' : 'people'}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-sm text-gray-500">Total Amount</span>
                      <span className="font-semibold">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {selectedBooking.specialRequests && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h5 className="font-medium mb-3 text-gray-700">Special Requests</h5>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h5 className="font-medium mb-3 text-gray-700">Actions</h5>
                <div className="flex flex-wrap gap-3">
                  <button className="btn bg-blue-600 text-white hover:bg-blue-700 py-2">
                    <Eye size={16} className="mr-2" />
                    View Full Details
                  </button>
                  {selectedBooking.status === 'pending' && (
                    <button 
                      className="btn bg-green-600 text-white hover:bg-green-700 py-2"
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Confirm Booking
                    </button>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <button 
                      className="btn bg-red-600 text-white hover:bg-red-700 py-2"
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                    >
                      <XCircle size={16} className="mr-2" />
                      Cancel Booking
                    </button>
                  )}
                  {selectedBooking.status === 'cancelled' && (
                    <button 
                      className="btn bg-orange-600 text-white hover:bg-orange-700 py-2"
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'pending')}
                    >
                      <RefreshCw size={16} className="mr-2" />
                      Restore Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;