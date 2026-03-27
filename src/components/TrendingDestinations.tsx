import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocations } from '../contexts/LocationContext';

const TrendingDestinations: React.FC = () => {
  const navigate = useNavigate();
  const { locations } = useLocations();
  const [activeTab, setActiveTab] = useState<'International' | 'Domestic'>('Domestic');

  // For this demo, let's treat some as international, some as domestic based on arbitrary logic or just show all
  const filteredLocations = locations.filter(loc => {
    if (activeTab === 'Domestic') {
      return ['ladakh', 'kashmir', 'himachal-pradesh', 'sikkim', 'shimla'].includes(loc.slug);
    } else {
      return ['sri-lanka', 'bhutan'].includes(loc.slug);
    }
  });

  const displayLocations = filteredLocations.length > 0 ? filteredLocations : locations; // fallback to show something

  const handleExplore = (slug: string) => {
    navigate(`/location/${slug}`);
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 md:mb-0">Trending Destinations</h2>
          
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('International')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'International' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              International
            </button>
            <button
              onClick={() => setActiveTab('Domestic')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeTab === 'Domestic' 
                  ? 'bg-blue-700 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Domestic
            </button>
          </div>
        </div>

        {/* Carousel / List */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-10 bg-white shadow-lg rounded-full p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-10 bg-blue-700 text-white shadow-lg rounded-full p-2 hover:bg-blue-800 transition-colors">
            <ChevronRight size={24} />
          </button>

          <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-8 hide-scrollbar snap-x px-4 md:px-0">
            {displayLocations.map((loc) => (
              <div 
                key={loc.id}
                onClick={() => handleExplore(loc.slug)}
                className="flex-shrink-0 w-40 md:w-52 h-64 md:h-80 relative rounded-t-full rounded-b-full overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 snap-center"
              >
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="absolute top-8 left-0 right-0 text-center font-bold text-gray-800 text-lg md:text-xl tracking-wide font-serif px-2 drop-shadow-sm">
                  {loc.name.toUpperCase()}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Now Button */}
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => navigate('/packages')} 
            className="flex items-center space-x-2 bg-blue-700 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
          >
            <span>Explore Now</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default TrendingDestinations;
