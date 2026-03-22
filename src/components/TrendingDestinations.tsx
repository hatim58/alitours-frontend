import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { getTrendingDestinations } from '../utils/searchUtils';
import { PackageType } from '../types';

interface TrendingDestinationsProps {
  packages: PackageType[];
}

const TrendingDestinations: React.FC<TrendingDestinationsProps> = ({
  packages,
}) => {
  const navigate = useNavigate();
  const trendingDestinations = getTrendingDestinations(packages);

  const handleExplore = (city: string, country: string) => {
    navigate(
      `/search?to=${encodeURIComponent(city + ', ' + country)}`
    );
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-blue-600" size={28} />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Trending Destinations
            </h2>
            <p className="text-gray-600 mt-1">Most popular travel destinations</p>
          </div>
        </div>

        {trendingDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No destinations available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDestinations.map((dest, index) => (
              <div
                key={`${dest.city}-${dest.country}`}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-6">
                  <div className="text-white">
                    <div className="inline-block bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      #{index + 1} Trending
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {dest.city}
                    </h3>
                    <p className="text-blue-100 text-sm mb-4">{dest.country}</p>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
                      <p className="text-white text-sm">
                        <span className="font-bold text-lg">{dest.packages}</span>{' '}
                        amazing packages
                      </p>
                    </div>

                    <button
                      onClick={() => handleExplore(dest.city, dest.country)}
                      className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group/btn"
                    >
                      Explore
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingDestinations;
