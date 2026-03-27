import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Plus, Eye, Search } from 'lucide-react';
import { useLocations } from '../../contexts/LocationContext';

const AdminLocations: React.FC = () => {
  const { locations, deleteLocation } = useLocations();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);
  
  // Filter locations based on search term
  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteLocation = (locationId: string) => {
    deleteLocation(locationId);
    setDeleteConfirmOpen(null);
    alert('Location deleted successfully!');
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Locations</h1>
        <Link to="/admin/locations/new" className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded-lg">
          <Plus size={16} className="mr-2" />
          Add New Location
        </Link>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 relative">
        <Search size={18} className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search locations..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Locations List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((loc) => (
                <React.Fragment key={loc.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={loc.image} 
                          alt={loc.name} 
                          className="h-10 w-10 rounded-full object-cover mr-3 bg-gray-100" 
                        />
                        <div className="font-medium text-gray-900">
                          {loc.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      /{loc.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/location/${loc.slug}`} 
                        className="text-blue-600 hover:text-blue-800 mr-3" 
                        title="View Location Page"
                        target="_blank"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link 
                        to={`/admin/locations/edit/${loc.id}`} 
                        className="text-yellow-600 hover:text-yellow-800 mr-3 hidden" 
                        title="Edit Location"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        className="text-red-600 hover:text-red-800" 
                        title="Delete Location"
                        onClick={() => setDeleteConfirmOpen(loc.id)}
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                  
                  {/* Delete Confirmation Row */}
                  {deleteConfirmOpen === loc.id && (
                    <tr className="bg-red-50">
                      <td colSpan={3} className="px-6 py-4 text-center">
                         <div className="inline-block text-left">
                            <p className="font-medium text-red-700 mb-2">
                               Are you sure you want to delete "{loc.name}"?
                            </p>
                            <div className="flex justify-center space-x-3">
                               <button 
                                 className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm"
                                 onClick={() => setDeleteConfirmOpen(null)}
                               >
                                 Cancel
                               </button>
                               <button 
                                 className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                                 onClick={() => handleDeleteLocation(loc.id)}
                               >
                                 Yes, Delete
                               </button>
                            </div>
                         </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {filteredLocations.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                    No locations found.
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

export default AdminLocations;
