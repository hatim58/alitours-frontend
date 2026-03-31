import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MapPin,
  Users,
  LogOut,
  ChevronRight,
  Menu,
  FileText,
  Map
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

interface AdminSidebarProps {
  isExpanded: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isExpanded,
  onMouseEnter,
  onMouseLeave,
  onToggle
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/admin' },
    { icon: <Calendar size={20} />, name: 'Bookings', path: '/admin/bookings' },
    { icon: <Map size={20} />, name: 'Locations', path: '/admin/locations' },
    { icon: <MapPin size={20} />, name: 'Packages', path: '/admin/packages/new' },
    { icon: <FileText size={20} />, name: 'Invoices', path: '/admin/invoices' },
    { icon: <FileText size={20} />, name: 'Quotations', path: '/admin/quotations' },
    { icon: <MapPin size={20} />, name: 'Slideshow', path: '/admin/slideshow' },
    { icon: <Users size={20} />, name: 'Customers', path: '/admin/customers' },
  ];

  const handleLogout = () => {
    logout();
    // User will be redirected via AdminLayout useEffect
  };

  return (
    <div
      className={`bg-white h-screen shadow-lg flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'
        }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="flex items-center p-4 border-b min-h-[64px]">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        {isExpanded ? (
          <Link to="/" className="flex items-center ml-2">
            <Logo />
            <span className="ml-2 text-lg font-bold text-primary-600 whitespace-nowrap">
              Ali Tours & Travels
            </span>
          </Link>
        ) : (
          <div className="flex justify-center w-full">
            <Logo />
          </div>
        )}
      </div>

      {/* Admin Info */}
      {isExpanded && (
        <div className="p-4 border-b">
          <p className="text-sm text-gray-500">Logged in as</p>
          <div className="font-medium truncate">{user?.name}</div>
          <div className="text-sm text-primary-600">Administrator</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors group relative ${isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                    }`}
                  title={!isExpanded ? item.name : undefined}
                >
                  <div className={`${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'}`}>
                    {item.icon}
                  </div>

                  {isExpanded ? (
                    <>
                      <span className="ml-3 whitespace-nowrap">{item.name}</span>
                      <ChevronRight size={16} className="ml-auto text-gray-400" />
                    </>
                  ) : (
                    // Tooltip for collapsed state
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile (collapsed state) */}
      {!isExpanded && (
        <div className="p-2 border-t">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium mx-auto">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-2 border-t">
        <button
          onClick={handleLogout}
          className={`flex items-center text-gray-700 hover:text-red-600 w-full p-3 rounded-lg hover:bg-red-50 transition-colors group relative ${!isExpanded ? 'justify-center' : ''
            }`}
          title={!isExpanded ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {isExpanded ? (
            <span className="ml-3">Logout</span>
          ) : (
            // Tooltip for collapsed state
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;