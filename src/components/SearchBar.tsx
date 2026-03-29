import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, DollarSign, Navigation2 } from 'lucide-react';
import { getDestinationSuggestions } from '../utils/searchUtils';

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  compact?: boolean;
}

export interface SearchFilters {
  destination: string;
  travelDate?: string;
  budget?: string;
}

const POPULAR_DESTINATIONS = ['Goa, India', 'Manali, India', 'Dubai, UAE', 'Kerala, India', 'Maldives, Maldives'];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, compact = false }) => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('Anytime');
  const [budget, setBudget] = useState('Any Budget');

  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [destSuggestions, setDestSuggestions] = useState<
    Array<{ city: string; country: string }>
  >([]);
  const destRef = useRef<HTMLDivElement>(null);

  const [activePopover, setActivePopover] = useState<'date' | 'budget' | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestSuggestions(false);
      }
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    if (value.trim()) {
      setDestSuggestions(getDestinationSuggestions(value));
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(true);
    }
  };

  const handleDestinationSelect = (fullDest: string) => {
    setDestination(fullDest);
    setShowDestSuggestions(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination.trim()) {
      alert('Please select a destination');
      return;
    }

    const filters = {
      destination,
      travelDate: travelDate !== 'Anytime' ? travelDate : undefined,
      budget: budget !== 'Any Budget' ? budget : undefined,
    };

    if (onSearch) {
      onSearch(filters);
    } else {
      const url = new URLSearchParams();
      url.append('to', destination);
      if (filters.travelDate) url.append('date', filters.travelDate);
      if (filters.budget) url.append('budget', filters.budget);
      
      navigate(`/search?${url.toString()}`);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${compact ? 'px-4' : 'px-4 py-8'}`}>
      <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl md:rounded-full p-2 border border-white/50 relative z-30">
        <div className="flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          {/* DESTINATION */}
          <div ref={destRef} className="w-full md:w-1/3 relative p-2 md:pl-6 hover:bg-gray-50/50 rounded-xl md:rounded-l-full transition-colors cursor-text" onClick={() => { setActivePopover(null); setShowDestSuggestions(true); }}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Where to?</label>
            <div className="flex items-center">
              <MapPin size={18} className="text-primary-500 mr-2" />
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                placeholder="Search destinations"
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 font-medium placeholder-gray-400"
                autoComplete="off"
              />
            </div>
            {showDestSuggestions && (
              <div className="absolute top-[120%] left-0 w-[120%] bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50">
                {!destination.trim() ? (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Popular Destinations</h4>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_DESTINATIONS.map(dest => (
                        <button key={dest} onClick={() => handleDestinationSelect(dest)} type="button" className="px-4 py-2 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-full text-sm font-medium transition-colors border border-gray-200 hover:border-primary-200">
                          {dest.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {destSuggestions.length > 0 ? destSuggestions.map((dest) => (
                      <button
                        key={`${dest.city}-${dest.country}`}
                        type="button"
                        onClick={() => handleDestinationSelect(`${dest.city}, ${dest.country}`)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                      >
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Navigation2 size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{dest.city}</p>
                          <p className="text-xs text-gray-500">{dest.country}</p>
                        </div>
                      </button>
                    )) : (
                      <div className="p-4 text-center text-gray-500 text-sm">No destinations found.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DATES */}
          <div className="w-full md:w-1/4 relative p-2 md:px-6 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => { setActivePopover(activePopover === 'date' ? null : 'date'); setShowDestSuggestions(false); }}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">When?</label>
            <div className="flex items-center text-gray-800 font-medium">
              <Calendar size={18} className="text-primary-500 mr-2" />
              <span className="truncate">{travelDate}</span>
            </div>
          </div>

          {/* BUDGET */}
          <div className="w-full md:w-1/4 relative p-2 md:px-6 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => { setActivePopover(activePopover === 'budget' ? null : 'budget'); setShowDestSuggestions(false); }}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Budget</label>
            <div className="flex items-center text-gray-800 font-medium">
              <DollarSign size={18} className="text-primary-500 mr-2" />
              <span className="truncate">{budget}</span>
            </div>
          </div>

          {/* BUTTON */}
          <div className="w-full md:w-[20%] p-2">
            <button
              type="submit"
              className="w-full h-14 bg-primary-500 text-white font-bold rounded-xl md:rounded-full hover:bg-primary-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2"
            >
              <Search size={22} className="stroke-[2.5]" />
              <span className="md:hidden lg:inline text-lg">Search</span>
            </button>
          </div>

        </div>

        {/* POPOVERS */}
        {activePopover && (
          <div ref={popoverRef} className={`absolute top-[120%] ${activePopover === 'date' ? 'md:left-1/3 left-0' : 'md:right-1/4 right-0'} w-full md:w-[320px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 transform origin-top animate-in fade-in zoom-in-95 duration-200`}>
            
            {activePopover === 'date' && (
              <div>
                <h4 className="font-bold text-gray-800 mb-4 text-lg">Select travel date</h4>
                <div className="space-y-3">
                  <button type="button" onClick={() => { setTravelDate('Anytime'); setActivePopover(null); }} className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${travelDate === 'Anytime' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-100 hover:border-primary-200 text-gray-700'}`}>
                    Anytime (Flexible)
                  </button>
                  <div className="relative">
                    <input 
                      type="date" 
                      onChange={(e) => { setTravelDate(e.target.value); setActivePopover(null); }} 
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-0 text-gray-700 font-medium" 
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
            )}

            {activePopover === 'budget' && (
              <div>
                <h4 className="font-bold text-gray-800 mb-4 text-lg">What's your budget?</h4>
                <div className="flex flex-col gap-2">
                  {['Any Budget', 'Under ₹20,000', '₹20,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000+'].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      onClick={() => { setBudget(val); setActivePopover(null); }} 
                      className={`w-full text-left px-5 py-3 rounded-xl border-2 transition-all ${budget === val ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-transparent hover:bg-gray-50 text-gray-700 font-medium'}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
