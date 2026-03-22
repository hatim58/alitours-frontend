import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Plus, Eye, Search, Filter } from 'lucide-react';
import { usePackages } from '../../contexts/PackageContext';

const AdminPackages: React.FC = () => {
  const { packages, deletePackage } = usePackages();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
  
  // Filter packages based on search term
  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePackage = (packageId: string) => {
    deletePackage(packageId);
    setDeleteConfirmOpen(null);
    alert('Package deleted successfully!');
  };
  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Tour Packages</h1>
        <Link to="/admin/packages/new" className="btn btn-primary flex items-center">
          <Plus size={16} className="mr-2" />
          Add New Package
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Dropdown */}
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md">
            <Filter size={16} className="mr-2" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </div>
      
      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPackages.map((pkg) => (
                <React.Fragment key={pkg.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          className="h-10 w-10 rounded-md object-cover mr-3" 
                        />
                        <div className="font-medium text-gray-900 max-w-[200px] truncate">
                          {pkg.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pkg.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pkg.duration} Days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium">₹{pkg.price.toLocaleString()}</span>
                        {pkg.discount > 0 && (
                          <span className="text-xs text-green-600">{pkg.discount}% off</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/packages/${pkg.id}`} 
                        className="text-blue-600 hover:text-blue-800 mr-3" 
                        title="View Package"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/packages/edit/${pkg.id}`} 
                        className="text-yellow-600 hover:text-yellow-800 mr-3" 
                        title="Edit Package"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        title="Delete Package"
                        onClick={() => setDeleteConfirmOpen(pkg.id)}
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Delete Confirmation Row */}
                  {deleteConfirmOpen === pkg.id && (
                    <tr className="bg-red-50">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-red-700">
                              Are you sure you want to delete "{pkg.name}"?
                            </p>
                            <p className="text-sm text-red-600">
                              This action cannot be undone.
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <button 
                              className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
                              onClick={() => setDeleteConfirmOpen(null)}
                            >
                              Cancel
                            </button>
                            <button 
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                              onClick={() => handleDeletePackage(pkg.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {filteredPackages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No packages found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPackages;