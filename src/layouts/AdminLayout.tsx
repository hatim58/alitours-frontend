import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSidebarToggle = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSidebarMouseEnter = () => {
    setIsSidebarExpanded(true);
  };

  const handleSidebarMouseLeave = () => {
    setIsSidebarExpanded(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar 
        isExpanded={isSidebarExpanded}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        onToggle={handleSidebarToggle}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isSidebarExpanded ? 'ml-64' : 'ml-16'
      }`}>
        <AdminHeader toggleSidebar={handleSidebarToggle} />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;