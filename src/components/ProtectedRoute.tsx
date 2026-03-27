import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  // While AuthContext is hydrating from localStorage the user will be null
  // but isAuthenticated won't be set yet — we use a simple check here.
  // Since AuthContext sets state synchronously from localStorage in a useEffect,
  // we wait one tick; however the simplest reliable approach is:
  // if no user AND no stored token → redirect to login.
  const storedUser = localStorage.getItem('user');

  if (!isAuthenticated && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  // If AuthContext hasn't hydrated yet (storedUser exists but user state is null)
  // show a loader briefly
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={32} />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Role-based check
  if (requiredRole && user.role !== requiredRole) {
    // Admin trying to access user route → redirect to admin
    // User trying to access admin route → redirect to login
    if (requiredRole === 'admin') {
      return <Navigate to="/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;