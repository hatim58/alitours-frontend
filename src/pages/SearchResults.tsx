import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Loader, Filter, X } from 'lucide-react';
import { packages } from '../data/packages';
import {
  searchPackages,
  sortPackages,
  getPriceRange,
  getDurationOptions,
  getDestinationTypes,
  SearchFilters,
} from '../utils/searchUtils';
import { PackageType } from '../types';
import SearchBar from '../components/SearchBar';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [results, setResults] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'popular' | 'rating'>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    fromCity: searchParams.get('from') || '',
    destination: searchParams.get('to') || '',
    travelDate: searchParams.get('date') || '',
    minPrice: undefined,
    maxPrice: undefined,
    duration: undefined,
    destinationType: undefined,
  });

  const [filterOptions, setFilterOptions] = useState({
    priceRange: { min: 0, max: 100000 },
    durations: [3, 5, 7, 10, 14],
    destinationTypes: ['adventure', 'beach', 'cultural', 'mountain', 'spiritual', 'wildlife'],
  });

  useEffect(() => {
    setLoading(true);
    const searchResult = searchPackages(packages, filters);
    const sortedResults = sortPackages(searchResult.packages, sortBy);
    setResults(sortedResults);

    const priceRange = getPriceRange(packages);
    setFilterOptions({
      priceRange,
      durations: getDurationOptions(packages),
      destinationTypes: getDestinationTypes(packages),
    });

    setLoading(false);
  }, [filters, sortBy]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      fromCity: searchParams.get('from') || '',
      destination: searchParams.get('to') || '',
      travelDate: searchParams.get('date') || '',
      minPrice: undefined,
      maxPrice: undefined,
      duration: undefined,
      destinationType: undefined,
    });
  };

  const handleWhatsAppInquiry = (packageId: string, packageName: string) => {
    const message = encodeURIComponent(
      `Hi! I'm interested in the "${packageName}" package. Can you provide more details?`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchBar compact={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside
            className={`${showFilters ? 'fixed inset-0 bg-black/50 z-40 lg:static lg:bg-transparent' : 'hidden lg:block'} lg:w-64 flex-shrink-0`}
          >
            {showFilters && (
              <div
                className="fixed inset-0 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
            )}

            <div className="bg-white p-6 rounded-2xl shadow-lg lg:shadow-none lg:bg-transparent fixed left-0 right-0 bottom-0 max-h-[80vh] overflow-y-auto lg:relative lg:max-h-none lg:bottom-auto">
              <div className="flex justify-between items-center mb-6 lg:mb-4">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filterOptions.priceRange.min}
                      max={filterOptions.priceRange.max}
                      value={filters.minPrice || filterOptions.priceRange.min}
                      onChange={(e) =>
                        handleFilterChange('minPrice', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <input
                      type="range"
                      min={filterOptions.priceRange.min}
                      max={filterOptions.priceRange.max}
                      value={filters.maxPrice || filterOptions.priceRange.max}
                      onChange={(e) =>
                        handleFilterChange('maxPrice', parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-2">
                      {formatPrice(filters.minPrice || filterOptions.priceRange.min)} -{' '}
                      {formatPrice(filters.maxPrice || filterOptions.priceRange.max)}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Duration</h4>
                  <div className="space-y-2">
                    {filterOptions.durations.map(duration => (
                      <label key={duration} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.duration === duration}
                          onChange={(e) =>
                            handleFilterChange('duration', e.target.checked ? duration : undefined)
                          }
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-gray-700">{duration} Days</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Destination Type</h4>
                  <div className="space-y-2">
                    {filterOptions.destinationTypes.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer capitalize">
                        <input
                          type="checkbox"
                          checked={filters.destinationType === type}
                          onChange={(e) =>
                            handleFilterChange('destinationType', e.target.checked ? type : undefined)
                          }
                          className="w-4 h-4 accent-blue-600"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
                <p className="text-gray-600 mt-1">{results.length} packages found</p>
              </div>

              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden bg-white px-4 py-2 rounded-lg border border-gray-300 font-semibold flex items-center gap-2 hover:bg-gray-50"
                >
                  <Filter size={20} />
                  Filters
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader className="animate-spin mx-auto mb-4" size={32} />
                  <p className="text-gray-600">Loading results...</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <p className="text-gray-600 text-lg mb-4">
                  No packages found matching your criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map(pkg => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
                  >
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {pkg.discount}% OFF
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {pkg.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {pkg.description}
                      </p>

                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-gray-600 text-sm">Duration</p>
                          <p className="font-semibold text-gray-900">
                            {pkg.duration} Days
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 text-sm">Rating</p>
                          <p className="font-semibold text-gray-900">
                            ⭐ {pkg.rating} ({pkg.reviews})
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-600 text-sm mb-1">Starting from</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-blue-600">
                            {formatPrice(pkg.price)}
                          </span>
                          <span className="text-gray-500 line-through text-sm">
                            {formatPrice(pkg.originalPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/packages/${pkg.id}`)}
                          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleWhatsAppInquiry(pkg.id, pkg.name)}
                          className="bg-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                          title="Enquire on WhatsApp"
                        >
                          <MessageCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
