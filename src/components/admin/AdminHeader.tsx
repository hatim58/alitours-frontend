import React, { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminHeaderProps {
  toggleSidebar?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-white shadow-sm flex items-center px-5 relative z-40">
      <div className="lg:hidden mr-4">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-between">
        {/* Page Title */}
        {/* <h1 className="text-xl font-semibold">Dashboard</h1> */}

        {/* Search Bar (Desktop) */}
        {/* <div className="hidden md:block relative max-w-md">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-100 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white" 
          />
        </div> */}

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Icon (Mobile) */}
          {/* <div className="md:hidden">
            {isSearchOpen ? (
              <div className="fixed inset-0 z-50 bg-white px-5 py-4 flex items-center">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search..."
                    className="bg-gray-100 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-3 p-2 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Search size={20} />
              </button>
            )}
          </div> */}

          {/* Notifications */}
          {/* <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium mr-2">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;