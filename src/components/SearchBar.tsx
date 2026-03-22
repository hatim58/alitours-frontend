import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, X } from 'lucide-react';
import {
  getCitySuggestions,
  getDestinationSuggestions,
} from '../utils/searchUtils';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  compact?: boolean;
}

export interface SearchFilters {
  fromCity: string;
  destination: string;
  travelDate?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, compact = false }) => {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<
    Array<{ city: string; country: string }>
  >([]);
  const fromRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFromCityChange = (value: string) => {
    setFromCity(value);
    if (value.trim()) {
      setFromSuggestions(getCitySuggestions(value));
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    if (value.trim()) {
      setDestSuggestions(getDestinationSuggestions(value));
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const handleFromCitySelect = (city: string) => {
    setFromCity(city);
    setShowFromSuggestions(false);
  };

  const handleDestinationSelect = (city: string, country: string) => {
    setDestination(`${city}, ${country}`);
    setShowDestSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromCity.trim() || !destination.trim()) {
      alert('Please select both departure and destination');
      return;
    }

    const filters = {
      fromCity,
      destination,
      ...(travelDate && { travelDate }),
    };

    if (onSearch) {
      onSearch(filters);
    } else {
      navigate(`/search?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(destination)}${travelDate ? `&date=${encodeURIComponent(travelDate)}` : ''}`);
    }
  };

  const containerClass = compact
    ? 'py-4'
    : 'py-8 md:py-12';

  const searchInputClass =
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white';

  return (
    <div className={`${containerClass} bg-gradient-to-r from-blue-50 to-blue-100`}>
      <div className="max-w-6xl mx-auto px-4">
        <form onSubmit={handleSearch}>
          <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'} gap-4 items-end`}>
            <div ref={fromRef} className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                From City
              </label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => handleFromCityChange(e.target.value)}
                onFocus={() => fromCity && setShowFromSuggestions(true)}
                placeholder="Select departure city"
                className={searchInputClass}
                autoComplete="off"
              />
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                  {fromSuggestions.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleFromCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-gray-700"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={destRef} className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-1" />
                To Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => destination && setShowDestSuggestions(true)}
                placeholder="Select destination"
                className={searchInputClass}
                autoComplete="off"
              />
              {showDestSuggestions && destSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                  {destSuggestions.map((dest) => (
                    <button
                      key={`${dest.city}-${dest.country}`}
                      type="button"
                      onClick={() =>
                        handleDestinationSelect(dest.city, dest.country)
                      }
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-gray-700"
                    >
                      <span className="font-medium">{dest.city}</span>
                      <span className="text-gray-500 ml-2">{dest.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!compact && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className={searchInputClass}
                />
              </div>
            )}

            <button
              type="submit"
              className={`${compact ? 'col-span-1 sm:col-span-2 lg:col-span-1' : 'col-span-1'} bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 h-12 shadow-md hover:shadow-lg`}
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
