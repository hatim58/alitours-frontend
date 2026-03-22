import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, IndianRupee as Indian, Eye, Download, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../contexts/BookingContext';
import { usePackages } from '../contexts/PackageContext';
import { useInvoices } from '../contexts/InvoiceContext';
import { generateInvoicePDF, generateInvoiceNumber } from '../utils/invoiceGenerator';
import { format } from 'date-fns';

const MyBookings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { getBookingsByUserId } = useBookings();
  const { getPackageById } = usePackages();
  const { generateInvoice } = useInvoices();

  // Get user's bookings from context
  const userBookings = user ? getBookingsByUserId(user.id) : [];

  const downloadInvoice = (booking: BookingType) => {
    if (!user) return;
    
    // Generate invoice data
    const gstRate = 5;
    const baseAmount = Math.round(booking.totalPrice / (1 + gstRate / 100));
    const gstAmount = booking.totalPrice - baseAmount;
    
    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: format(new Date(), 'dd/MM/yyyy'),
      booking,
      customer: user,
      gstRate,
      baseAmount,
      gstAmount,
      totalAmount: booking.totalPrice
    };
    
    // Generate and save invoice to context
    generateInvoice(booking, user);
    
    // Generate PDF
    const pdf = generateInvoicePDF(invoiceData);
    pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
  };
  if (!isAuthenticated || !user) {
    return (
      <div className="pt-24 pb-16 fade-in">
        <div className="container">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">Please Login</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your bookings.
            </p>
            <Link to="/login" className="btn btn-primary">
              Login to Your Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {userBookings.length > 0 ? (
          <div className="space-y-6">
            {userBookings.map((booking) => {
              const packageData = getPackageById(booking.packageId);
              
              return (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{booking.packageName}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin size={16} className="mr-2" />
                        {packageData?.destination || 'Andaman & Nicobar Islands'}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Travel Date</p>
                        <p className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Indian size={16} className="text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-medium">₹{booking.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {booking.specialRequests && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Special Requests:</p>
                      <p className="text-sm">{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/packages/${booking.packageId}`}
                      className="btn bg-primary-600 text-white hover:bg-primary-700 py-2"
                    >
                      <Eye size={16} className="mr-2" />
                      View Package Details
                    </Link>
                    <button 
                      onClick={() => downloadInvoice(booking)}
                      className="btn bg-gray-600 text-white hover:bg-gray-700 py-2"
                    >
                      <Download size={16} className="mr-2" />
                      Download Invoice
                    </button>
                    {user?.role === 'admin' && (
                      <Link 
                        to={`/admin/bookings?id=${booking.id}`}
                        className="btn bg-purple-600 text-white hover:bg-purple-700 py-2"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        View in Admin
                      </Link>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                    <p>Booking ID: {booking.id}</p>
                    <p>Booked on: {booking.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🏖️</div>
            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any bookings yet. Start planning your next adventure!
            </p>
            <Link to="/packages" className="btn btn-primary">
              Browse Tour Packages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;