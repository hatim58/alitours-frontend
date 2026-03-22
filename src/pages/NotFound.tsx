import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Phone, MapPin } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 fade-in">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-600 py-12 px-6 text-center">
          <h2 className="text-6xl font-bold text-white mb-2">404</h2>
          <p className="text-primary-100 text-xl">Page Not Found</p>
        </div>
        
        <div className="p-6 sm:p-8">
          <p className="text-lg text-gray-600 text-center mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link 
              to="/" 
              className="flex-1 flex justify-center items-center px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Home size={16} className="mr-2" />
              Go to Homepage
            </Link>
            <Link 
              to="/contact" 
              className="flex-1 flex justify-center items-center px-4 py-3 bg-white border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
            >
              <Phone size={16} className="mr-2" />
              Contact Support
            </Link>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center justify-center mx-auto text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={16} className="mr-2" />
              Go Back
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Need assistance finding what you're looking for?
            </p>
            <p className="text-sm flex items-center justify-center">
              <MapPin size={14} className="text-primary-500 mr-1" />
              <span>Site is Under Process</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;