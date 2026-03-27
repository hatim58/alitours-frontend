import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Globe } from 'lucide-react';
import { useLocations } from '../../contexts/LocationContext';
import { usePackages } from '../../contexts/PackageContext';

const Locations: React.FC = () => {
  const { locations } = useLocations();
  const { packages } = usePackages();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count packages per location
  const packageCountByLocation = (locationId: string) =>
    packages.filter(pkg => pkg.locationId === locationId).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Banner */}
      <div
        className="relative h-72 md:h-96 flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)'
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 opacity-10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center mb-4">
            <Globe size={40} className="text-teal-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Explore Destinations
            </h1>
          </div>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Discover the world's most breathtaking locations, handpicked for you by Ali Tours & Travels.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations..."
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white shadow-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-6 justify-center mb-10">
          <div className="bg-white rounded-2xl shadow-md px-8 py-4 flex items-center gap-3">
            <MapPin size={24} className="text-teal-500" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{locations.length}</p>
              <p className="text-sm text-gray-500">Destinations</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md px-8 py-4 flex items-center gap-3">
            <Globe size={24} className="text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{packages.length}</p>
              <p className="text-sm text-gray-500">Tour Packages</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Destinations'}
            </h2>
            <p className="text-gray-500 mt-1">
              {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'} found
            </p>
          </div>
        </div>

        {/* Location Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((location) => {
              const pkgCount = packageCountByLocation(location.id);
              return (
                <div
                  key={location.id}
                  className="group bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg';
                      }}
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Location name badge */}
                    <div className="absolute bottom-4 left-4 flex items-center">
                      <MapPin size={16} className="text-teal-300 mr-1" />
                      <span className="text-white font-semibold text-lg drop-shadow">
                        {location.name}
                      </span>
                    </div>

                    {/* Package count badge */}
                    {pkgCount > 0 && (
                      <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        {pkgCount} {pkgCount === 1 ? 'Package' : 'Packages'}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    {location.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {location.description}
                      </p>
                    )}

                    <Link
                      to={`/packages?location=${location.id}`}
                      className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-800 transition-colors group/link"
                    >
                      View Packages
                      <ArrowRight
                        size={16}
                        className="group-hover/link:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <Globe size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-500 mb-2">No destinations found</h3>
            <p className="text-gray-400 mb-6">
              Try a different search term or explore all destinations.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl p-10 text-center text-white shadow-lg">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Can't find your dream destination?
          </h3>
          <p className="text-teal-100 mb-6 max-w-xl mx-auto">
            Our travel experts craft custom itineraries tailored just for you. Get in touch today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-teal-700 font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/packages"
              className="px-8 py-3 bg-teal-400 text-white font-bold rounded-full hover:bg-teal-300 transition-colors"
            >
              Browse All Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
