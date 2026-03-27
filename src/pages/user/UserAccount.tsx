import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Eye,
  Download,
  Plus,
  Phone,
  Edit,
  LogOut,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Heart,
  User,
  Mail,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBookings } from '../../contexts/BookingContext';
import { usePackages } from '../../contexts/PackageContext';
import { useInvoices } from '../../contexts/InvoiceContext';
import { generateInvoicePDF, generateInvoiceNumber } from '../../utils/invoiceGenerator';
import { BookingType } from '../../types';

const UserAccount: React.FC = () => {
  const { user, logout } = useAuth();
  const { getBookingsByUserId } = useBookings();
  const { packages } = usePackages();
  const { generateInvoice, getInvoicesByCustomerId } = useInvoices();

  if (!user) {
    return (
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <Link to="/login" className="btn btn-primary">Login to Your Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const userBookings = getBookingsByUserId(user.id);
  const userInvoices = getInvoicesByCustomerId(user.id);
  const upcomingBookings = userBookings.filter(booking =>
    new Date(booking.travelDate) > new Date() && booking.status !== 'cancelled'
  );
  const pastBookings = userBookings.filter(booking =>
    new Date(booking.travelDate) <= new Date() || booking.status === 'cancelled'
  );

  const downloadInvoice = (booking: BookingType) => {
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

    // Generate and save invoice
    generateInvoice(booking, user);

    // Generate PDF
    const pdf = generateInvoicePDF(invoiceData);
    pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
  };
  // Sample personalized offers based on user's booking history
  const personalizedOffers = [
    {
      id: 1,
      title: "Special Discount for You!",
      description: "Get 20% off on your next Andaman package",
      discount: "20% OFF",
      validUntil: "2024-12-31",
      packageId: "andaman-explorer"
    },
    {
      id: 2,
      title: "Family Package Deal",
      description: "Book for 4+ people and save big",
      discount: "₹5,000 OFF",
      validUntil: "2024-11-30",
      packageId: "family-special"
    }
  ];

  // Sample wishlist/saved packages
  const savedPackages = packages.slice(0, 2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'cancelled': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="container">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-primary-100 mb-4 md:mb-0">
                Ready for your next adventure? Explore new destinations and manage your bookings.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/packages" className="btn bg-white text-primary-600 hover:bg-gray-100">
                <Plus size={18} className="mr-2" />
                Book New Trip
              </Link>
              <a href="tel:+917869147222" className="btn bg-primary-500 text-white hover:bg-primary-400">
                <Phone size={18} className="mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Calendar size={24} className="mr-3 text-primary-600" />
                  Upcoming Trips
                </h2>
                <Link to="/my-bookings" className="text-primary-600 hover:text-primary-800 text-sm">
                  View All →
                </Link>
              </div>

              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 2).map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{booking.packageName}</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2" />
                              {new Date(booking.travelDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Users size={16} className="mr-2" />
                              {booking.guests} {booking.guests === 1 ? 'Person' : 'People'}
                            </div>
                            <div className="flex items-center">
                              <IndianRupee size={16} className="mr-2" />
                              ₹{booking.totalPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                          </span>
                          <button className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-3">
                            <Eye size={16} className="mr-1" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Upcoming Trips</h3>
                  <p className="text-gray-600 mb-4">Start planning your next adventure!</p>
                  <Link to="/packages" className="btn btn-primary">
                    Browse Packages
                  </Link>
                </div>
              )}
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Clock size={24} className="mr-3 text-primary-600" />
                  Recent Booking History
                </h2>
                <Link to="/my-bookings" className="text-primary-600 hover:text-primary-800 text-sm">
                  View All →
                </Link>
              </div>

              {pastBookings.length > 0 ? (
                <div className="space-y-3">
                  {pastBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{booking.packageName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.travelDate).toLocaleDateString()} • {booking.guests} guests
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">₹{booking.totalPrice.toLocaleString()}</span>
                        <button
                          onClick={() => downloadInvoice(booking)}
                          className="btn bg-blue-100 text-blue-700 hover:bg-blue-200 py-1 px-3 text-sm"
                        >
                          <Download size={14} className="mr-1" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600">No booking history yet</p>
                </div>
              )}
            </div>

            {/* Special Offers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold flex items-center mb-6">
                <Gift size={24} className="mr-3 text-primary-600" />
                Special Offers for You
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedOffers.map((offer) => (
                  <div key={offer.id} className="border border-orange-200 rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{offer.title}</h3>
                        <p className="text-gray-600 text-sm">{offer.description}</p>
                      </div>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {offer.discount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                      <button className="btn bg-orange-500 text-white hover:bg-orange-600 py-1 px-3 text-sm">
                        Claim Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Packages / Wishlist */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold flex items-center mb-6">
                <Heart size={24} className="mr-3 text-primary-600" />
                Saved Packages
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <img src={pkg.image} alt={pkg.name} className="w-16 h-16 rounded object-cover mr-3" />
                      <div className="flex-1">
                        <h3 className="font-medium">{pkg.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{pkg.duration} Days • {pkg.destination}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-600 font-medium">₹{pkg.price.toLocaleString()}</span>
                          <Link to={`/packages/${pkg.id}`} className="btn bg-primary-100 text-primary-700 hover:bg-primary-200 py-1 px-3 text-sm">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <User size={20} className="mr-2 text-primary-600" />
                Profile Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg mr-4">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm">
                    <Mail size={16} className="mr-3 text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm">
                      <Smartphone size={16} className="mr-3 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <Link to="/profile" className="btn btn-outline w-full mt-4">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <Link to="/packages" className="btn btn-primary w-full">
                  <Plus size={18} className="mr-2" />
                  Book a New Trip
                </Link>

                <a href="tel:+917869147222" className="btn bg-green-600 text-white hover:bg-green-700 w-full">
                  <Phone size={18} className="mr-2" />
                  Contact Support
                </a>

                <Link to="/profile" className="btn btn-outline w-full">
                  <Edit size={18} className="mr-2" />
                  Edit Profile
                </Link>

                <button onClick={logout} className="btn bg-red-600 text-white hover:bg-red-700 w-full">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-blue-900">Need Help?</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-blue-800">
                  <Phone size={16} className="mr-2" />
                  <div>
                    <p className="font-medium">24/7 Support</p>
                    <a href="tel:+917869147222" className="text-blue-600 hover:underline">+91 78691-47222</a>
                  </div>
                </div>

                <div className="flex items-center text-blue-800">
                  <Mail size={16} className="mr-2" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <a href="mailto:info@alitourstravels.in" className="text-blue-600 hover:underline">info@alitourstravels.in</a>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <Link to="/contact" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Visit Help Center →
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Your Travel Stats</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-bold text-primary-600">{userBookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Upcoming Trips</span>
                  <span className="font-bold text-green-600">{upcomingBookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-bold text-purple-600">
                    ₹{userBookings.reduce((sum, booking) => sum + booking.totalPrice, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Invoices</span>
                  <span className="font-bold text-blue-600">{userInvoices.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;