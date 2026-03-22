import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Map, Star, Users } from 'lucide-react';
import { PackageType } from '../types';

interface PackageCardProps {
  package: PackageType;
}

const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  return (
    <div className="card group hover:scale-[1.02] transition-all duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={pkg.image} 
          alt={pkg.name} 
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        {pkg.discount > 0 && (
          <div className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-2 py-1 rounded">
            {pkg.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={16} 
                className={star <= pkg.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({pkg.reviews} reviews)
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
          {pkg.name}
        </h3>
        
        <div className="flex items-center text-gray-500 mb-4">
          <Map size={16} className="mr-1" />
          <span className="text-sm">{pkg.destination}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock size={16} className="text-primary-500 mr-1" />
            <span className="text-sm">{pkg.duration} Days</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="text-primary-500 mr-1" />
            <span className="text-sm">Max {pkg.maxGuests} People</span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-sm">From</span>
              <div className="flex items-center">
                {pkg.discount > 0 && (
                  <span className="text-gray-400 line-through mr-2">₹{pkg.originalPrice.toLocaleString()}</span>
                )}
                <span className="text-2xl font-bold text-primary-600">₹{pkg.price.toLocaleString()}</span>
              </div>
              <span className="text-gray-500 text-sm">per person</span>
            </div>
            <Link 
              to={`/packages/${pkg.id}`} 
              className="btn btn-primary py-2"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;