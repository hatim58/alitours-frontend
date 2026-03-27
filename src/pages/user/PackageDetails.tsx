import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Map,
  Users,
  Calendar,
  Utensils,
  Wifi,
  Compass,
  Camera,
  Hotel,
  Plane,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { usePackages } from '../../contexts/PackageContext';
import BookingForm from '../../components/BookingForm';
import Itinerary from '../../components/Itinerary';
import ReviewForm from '../../components/ReviewForm';
import ReviewCard from '../../components/ReviewCard';
import { useReviews } from '../../contexts/ReviewContext';

const PackageDetails: React.FC = () => {
  const { getPackageById } = usePackages();
  const { getApprovedReviews } = useReviews();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('itinerary');

  // Find the package based on the id
  const packageData = id ? getPackageById(id) : undefined;

  // Get reviews for this package
  const packageReviews = getApprovedReviews().filter(review => review.packageId === id);

  if (!packageData) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Package Not Found</h2>
        <p className="mb-8">The package you're looking for doesn't exist or has been removed.</p>
        <Link to="/packages" className="btn btn-primary">
          View All Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in pt-20">
      {/* Package Hero */}
      <div className="relative h-[500px]">
        <img
          src={packageData.image}
          alt={packageData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="container pb-12">
            <div className="max-w-3xl text-white">
              <div className="flex items-center mb-4">
                <Map size={16} className="mr-2" />
                <span className="text-sm">{packageData.destination}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">{packageData.duration} Days</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {packageData.name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full">
                  {packageData.rating} / 5 Rated
                </div>
                <div className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                  {packageData.reviews} Reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-3">
        <div className="container">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <Link to="/packages" className="text-gray-600 hover:text-primary-600">Tour Packages</Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-primary-600">{packageData.name}</span>
          </div>
        </div>
      </div>

      {/* Package Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Package Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-600 mb-6">
                {packageData.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Clock size={24} className="mx-auto mb-2 text-primary-600" />
                  <span className="block text-sm font-medium">{packageData.duration} Days</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Users size={24} className="mx-auto mb-2 text-primary-600" />
                  <span className="block text-sm font-medium">Max {packageData.maxGuests} Persons</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Calendar size={24} className="mx-auto mb-2 text-primary-600" />
                  <span className="block text-sm font-medium">Available Daily</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Map size={24} className="mx-auto mb-2 text-primary-600" />
                  <span className="block text-sm font-medium">{packageData.destination}</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">Package Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {packageData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-3">Package Includes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {packageData.includes.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-3">Package Excludes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {packageData.excludes.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <XCircle size={18} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`py-3 px-5 font-medium text-sm focus:outline-none ${activeTab === 'itinerary'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Itinerary
                </button>
                <button
                  onClick={() => setActiveTab('accommodation')}
                  className={`py-3 px-5 font-medium text-sm focus:outline-none ${activeTab === 'accommodation'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Accommodation
                </button>
                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`py-3 px-5 font-medium text-sm focus:outline-none ${activeTab === 'gallery'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-3 px-5 font-medium text-sm focus:outline-none ${activeTab === 'reviews'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Reviews ({packageReviews.length})
                </button>
              </div>

              <div className="py-6">
                {activeTab === 'itinerary' && (
                  <Itinerary itinerary={packageData.itinerary} />
                )}

                {activeTab === 'accommodation' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Accommodation Details</h3>

                    {packageData.accommodation.map((hotel, index) => (
                      <div key={index} className="mb-6 bg-gray-50 p-5 rounded-lg">
                        <div className="flex items-start">
                          <div className="bg-primary-100 rounded-lg p-3 mr-4">
                            <Hotel className="text-primary-600" size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold mb-2">{hotel.name}</h4>
                            <p className="text-gray-600 mb-3">{hotel.description}</p>
                            <div className="flex flex-wrap gap-3">
                              {hotel.amenities.map((amenity, i) => (
                                <span key={i} className="bg-white py-1 px-3 text-sm rounded-full border border-gray-200">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <p className="text-gray-500 text-sm mt-4">
                      Note: Accommodation is subject to availability. Similar category hotels may be provided if mentioned hotels are not available.
                    </p>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Photo Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {packageData.gallery.map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden h-56">
                          <img
                            src={image}
                            alt={`${packageData.name} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-bold mb-6">Customer Reviews</h3>

                    {/* Review Form */}
                    <div className="mb-8">
                      <ReviewForm packageId={packageData.id} />
                    </div>

                    {/* Reviews List */}
                    {packageReviews.length > 0 ? (
                      <div className="space-y-6">
                        {packageReviews.map((review) => (
                          <ReviewCard key={review.id} review={review} showPackage={false} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">⭐</div>
                        <h4 className="text-lg font-semibold mb-2">No Reviews Yet</h4>
                        <p className="text-gray-600">Be the first to review this package!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Important Notes</h3>
                <ul className="space-y-2 mb-5">
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>All attractions are subject to weather conditions and local restrictions.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>Children aged 0-5 years may avail complimentary stay without extra bed.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>Passport is required for foreign nationals visiting Andaman.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>The itinerary may change due to unforeseen circumstances like weather or local regulations.</span>
                  </li>
                </ul>

                <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>Cancellation more than 15 days before departure: 90% refund</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>Cancellation 7-15 days before departure: 75% refund</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>Cancellation 3-7 days before departure: 50% refund</span>
                  </li>
                  <li className="flex items-start">
                    <div className="text-yellow-500 mr-2">•</div>
                    <span>Cancellation less than 3 days before departure: No refund</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 sticky top-24">
              <div className="bg-primary-600 p-4 text-white">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-sm opacity-80">From</span>
                    <div className="flex items-center">
                      {packageData.discount > 0 && (
                        <span className="line-through mr-2 opacity-70">₹{packageData.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="text-2xl font-bold">₹{packageData.price.toLocaleString()}</span>
                    </div>
                    <span className="text-sm opacity-80">per person</span>
                  </div>
                  {packageData.discount > 0 && (
                    <div className="bg-accent-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {packageData.discount}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Form */}
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4">Get This Package</h3>
                <BookingForm packageId={packageData.id} packageName={packageData.name} pricePerPerson={packageData.price} />
              </div>
            </div>

            {/* Services */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Our Services</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Hotel size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Premium Accommodation</h4>
                    <p className="text-sm text-gray-600">Handpicked hotels and resorts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Plane size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Travel Assistance</h4>
                    <p className="text-sm text-gray-600">Ferry and flight bookings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Compass size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Expert Guides</h4>
                    <p className="text-sm text-gray-600">Knowledgeable local guides</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Utensils size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Delicious Meals</h4>
                    <p className="text-sm text-gray-600">Authentic local cuisine</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Camera size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Sightseeing Tours</h4>
                    <p className="text-sm text-gray-600">All major attractions covered</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="p-2 bg-primary-100 rounded-lg mr-3">
                    <Wifi size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">24/7 Support</h4>
                    <p className="text-sm text-gray-600">Assistance throughout your trip</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;