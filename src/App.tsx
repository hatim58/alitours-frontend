import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminPackages from './pages/admin/Packages';
import AdminCustomers from './pages/admin/Customers';
import Quotations from './pages/admin/Quotations';
import AdminReviews from './pages/admin/Reviews';
import CreatePackage from './pages/admin/CreatePackage';
import CreateQuotation from './pages/admin/CreateQuotation';
import AdminSlideshow from './pages/admin/Slideshow';
import AdminInvoices from './pages/admin/Invoices';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import Dashboard from './pages/Dashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Reviews from './pages/Reviews';
import NotFound from './pages/NotFound';
import PasswordReset from './pages/PasswordReset';
import ProtectedRoute from './components/ProtectedRoute';
import SearchResults from './pages/SearchResults';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:id" element={<PackageDetails />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="booking/:id?" element={<Booking />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="password-reset" element={<PasswordReset />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="quotations" element={<Quotations />} />
          <Route path="quotations/new" element={<CreateQuotation />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="slideshow" element={<AdminSlideshow />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="packages/new" element={<CreatePackage />} />
          <Route path="packages/edit/:id" element={<AdminPackages />} />
        </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;