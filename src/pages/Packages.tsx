import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Calendar, Star, ChevronDown, Plus } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { usePackages } from '../contexts/PackageContext';
import { useAuth } from '../contexts/AuthContext';

const Packages: React.FC = () => {
  const { packages } = usePackages();
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('default');
  const { user } = useAuth();
  
  // Filter packages based on search term and duration filter
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDuration = 
      durationFilter === 'all' || 
      (durationFilter === '1-3' && pkg.duration >= 1 && pkg.duration <= 3) ||
      (durationFilter === '4-7' && pkg.duration >= 4 && pkg.duration <= 7) ||
      (durationFilter === '8+' && pkg.duration >= 8);
    
    return matchesSearch && matchesDuration;
  });
  
  // Sort packages based on price
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (priceSort === 'low-high') {
      return a.price - b.price;
    } else if (priceSort === 'high-low') {
      return b.price - a.price;
    }
    return 0; // Default sorting (as is in the original array)
  });
  
  return (
    <div className="pt-24 pb-16 fade-in">
      {/* Header */}
      <div className="bg-primary-600 py-16 mb-12">
        <div className="container text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Tour Packages</h1>
          <p className="max-w-2xl mx-auto">
            Discover More with Ali Tours & Travels.
          </p>
          {user?.role === 'admin' && (
            <div className="mt-8">
              <Link 
                to="/admin/packages/new" 
                className="btn bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add New Package
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="container">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages by name, destination, or keyword..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-4">
              {/* Duration Filter */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-3 cursor-pointer">
                  <Calendar size={18} className="text-gray-500 mr-2" />
                  <select
                    className="appearance-none bg-transparent pr-8 focus:outline-none cursor-pointer"
                    value={durationFilter}
                    onChange={(e) => setDurationFilter(e.target.value)}
                  >
                    <option value="all">Any Duration</option>
                    <option value="1-3">1-3 Days</option>
                    <option value="4-7">4-7 Days</option>
                    <option value="8+">8+ Days</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              {/* Price Sort */}
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-3 cursor-pointer">
                  <Filter size={18} className="text-gray-500 mr-2" />
                  <select
                    className="appearance-none bg-transparent pr-8 focus:outline-none cursor-pointer"
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                  >
                    <option value="default">Sort by: Featured</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Package Results */}
        {sortedPackages.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-500">
                Showing {sortedPackages.length} packages
              </div>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/packages/new"
                  className="btn btn-primary inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add New Package
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPackages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏝️</div>
            <h3 className="text-2xl font-bold mb-2">No packages found</h3>
            <p className="text-gray-600 mb-8">
              We couldn't find any packages matching your search criteria. Try different keywords or filters.
            </p>
            <div className="flex items-center justify-center gap-4">
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="btn btn-outline"
                >
                  Clear Search
                </button>
              )}
              {user?.role === 'admin' && (
                <Link 
                  to="/admin/packages/new"
                  className="btn btn-primary inline-flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Add New Package
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Island Destinations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative rounded-lg overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/1450372/pexels-photo-1450372.jpeg" 
                alt="Havelock Island" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Havelock Island</h3>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">Andaman</span>
                  </div>
                </div>
              </div>
              <Link to="/packages?destination=havelock" className="absolute inset-0" aria-label="Havelock Island"></Link>
            </div>
            
            <div className="group relative rounded-lg overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg" 
                alt="Neil Island" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Neil Island</h3>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">Andaman</span>
                  </div>
                </div>
              </div>
              <Link to="/packages?destination=neil" className="absolute inset-0" aria-label="Neil Island"></Link>
            </div>
            
            <div className="group relative rounded-lg overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg"
                alt="Port Blair" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Port Blair</h3>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">Andaman</span>
                  </div>
                </div>
              </div>
              <Link to="/packages?destination=port-blair" className="absolute inset-0" aria-label="Port Blair"></Link>
            </div>
            
            <div className="group relative rounded-lg overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow">
              <img 
                src="https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg" 
                alt="Ross Island" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">Ross Island</h3>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">Andaman</span>
                  </div>
                </div>
              </div>
              <Link to="/packages?destination=ross" className="absolute inset-0" aria-label="Ross Island"></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;