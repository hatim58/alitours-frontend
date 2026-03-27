import React from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';
import { useBookings } from '../../contexts/BookingContext';

const AdminDashboard: React.FC = () => {
  const { packages } = usePackages();
  const { getAllBookings } = useBookings();
  const allBookings = getAllBookings();

  // Calculate statistics
  const totalRevenue = allBookings.reduce((sum, booking) =>
    booking.status === 'confirmed' ? sum + booking.totalPrice : sum, 0
  );
  const totalCustomers = new Set(allBookings.map(booking => booking.userId)).size;

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link to="/admin/packages/new" className="btn btn-primary flex items-center">
            <Plus size={16} className="mr-2" />
            Add New Package
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Bookings</p>
              <h3 className="text-2xl font-bold">{allBookings.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Customers</p>
              <h3 className="text-2xl font-bold">{totalCustomers}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Tours</p>
              <h3 className="text-2xl font-bold">{packages.length}</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Start managing your tours and bookings. Add new packages or view existing bookings using the navigation menu.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/admin/packages/new" className="btn btn-primary">
            Add New Package
          </Link>
          <Link to="/admin/bookings" className="btn btn-outline">
            View Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;