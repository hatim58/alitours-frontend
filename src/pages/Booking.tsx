import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackages } from '../contexts/PackageContext';
import { ChevronRight, ChevronDown } from 'lucide-react';
import BookingForm from '../components/BookingForm';

const Booking: React.FC = () => {
  const { packages, getPackageById } = usePackages();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(id ? getPackageById(id) : null);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  
  // If ID is provided but package not found, redirect to booking page
  useEffect(() => {
    if (id && !selectedPackage) {
      navigate('/booking');
    }
  }, [id, selectedPackage, navigate]);
  
  const togglePackageDropdown = () => {
    setIsPackageDropdownOpen(!isPackageDropdownOpen);
  };
  
  const selectPackage = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setIsPackageDropdownOpen(false);
  };
  
  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Andaman Adventure</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Home</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-primary-600">Book Now</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {selectedPackage ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={selectedPackage.image} 
                    alt={selectedPackage.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h2 className="text-xl font-bold mb-1">{selectedPackage.name}</h2>
                      <div className="flex items-center gap-2 text-sm">
                        <span>{selectedPackage.duration} Days</span>
                        <span>•</span>
                        <span>{selectedPackage.destination}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    You're interested in <span className="font-medium">{selectedPackage.name}</span>. 
                    Choose your preferred booking method below to proceed.
                  </p>
                  
                  <BookingForm 
                    packageId={selectedPackage.id} 
                    packageName={selectedPackage.name} 
                    pricePerPerson={selectedPackage.price} 
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Select a Package to Book</h2>
                
                <p className="text-gray-600 mb-6">
                  Please select a tour package from our available options to proceed with your booking or inquiry.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {packages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary-300 cursor-pointer transition-all"
                      onClick={() => selectPackage(pkg)}
                    >
                      <div className="flex items-start">
                        <img 
                          src={pkg.image} 
                          alt={pkg.name} 
                          className="w-16 h-16 rounded object-cover mr-3" 
                        />
                        <div>
                          <h3 className="font-medium">{pkg.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{pkg.duration} Days • {pkg.destination}</p>
                          <div className="flex items-center">
                            <span className="text-primary-600 font-medium">₹{pkg.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-500 ml-1">per person</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="order-1 lg:order-2">
            {selectedPackage ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="bg-primary-600 p-4 text-white">
                  <h3 className="font-semibold">Selected Package</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-medium">{selectedPackage.name}</div>
                    <button 
                      onClick={() => setSelectedPackage(null)}
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{selectedPackage.duration} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span>{selectedPackage.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <div>
                        {selectedPackage.discount > 0 && (
                          <span className="line-through text-gray-400 mr-2">₹{selectedPackage.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="font-medium">₹{selectedPackage.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">Package Includes:</h4>
                  <ul className="text-sm space-y-2 mb-4">
                    {selectedPackage.includes.slice(0, 4).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="text-green-500 mr-2">•</div>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                    {selectedPackage.includes.length > 4 && (
                      <button 
                        className="text-primary-600 hover:text-primary-800 text-sm mt-1"
                        onClick={togglePackageDropdown}
                      >
                        {isPackageDropdownOpen ? 'Show less' : `Show ${selectedPackage.includes.length - 4} more`}
                        <ChevronDown 
                          size={14} 
                          className={`inline ml-1 transform transition-transform ${isPackageDropdownOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                    )}
                    {isPackageDropdownOpen && 
                      selectedPackage.includes.slice(4).map((item, index) => (
                        <li key={index + 4} className="flex items-start">
                          <div className="text-green-500 mr-2">•</div>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))
                    }
                  </ul>
                  
                  <a 
                    href={`/packages/${selectedPackage.id}`} 
                    className="text-primary-600 hover:text-primary-800 text-sm flex items-center"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View full package details
                    <ChevronRight size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-primary-600 p-4 text-white">
                  <h3 className="font-semibold">Booking Information</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    Select a package from the left panel to proceed with your booking. Our packages include:
                  </p>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="text-primary-600 mr-2">•</div>
                      <span>Hotels and accommodation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-primary-600 mr-2">•</div>
                      <span>Transportation between destinations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-primary-600 mr-2">•</div>
                      <span>Sightseeing and activities as per itinerary</span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-primary-600 mr-2">•</div>
                      <span>Expert guides for a better experience</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Need a custom package?</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      We can create a personalized itinerary based on your preferences and budget.
                    </p>
                    <a 
                      href="/contact"
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      Contact us for custom packages
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;