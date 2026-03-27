import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/user/Home';
import Packages from './pages/user/Packages';
import PackageDetails from './pages/user/PackageDetails';
// import LocationDetails from './pages/user/LocationDetails';
import Contact from './pages/user/Contact';
import Login from './pages/user/Login';
import Locations from './pages/user/Locations';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/Bookings';
import AdminPackages from './pages/admin/Packages';
import AdminCustomers from './pages/admin/Customers';
import CreatePackage from './pages/admin/CreatePackage';
import CreateLocation from './pages/admin/CreateLocation';
import CreateQuotation from './pages/admin/CreateQuotation';
import AdminInvoices from './pages/admin/Invoices';
import UserAccount from './pages/user/UserAccount';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
import TermsOfService from './pages/user/TermsOfService';
import Reviews from './pages/user/Reviews';
import NotFound from './pages/user/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import SearchResults from './pages/user/SearchResults';

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
            <Route path="locations" element={<Locations />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <UserAccount />
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
            <Route path="locations" element={<CreateLocation />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="quotations" element={<CreateQuotation />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="packages/new" element={<CreatePackage />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;