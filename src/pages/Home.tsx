import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, Star, ArrowRight, Phone } from 'lucide-react';
import Slideshow from '../components/Slideshow';
import PackageCard from '../components/PackageCard';
import TestimonialCard from '../components/TestimonialCard';
import SearchBar from '../components/SearchBar';
import TrendingDestinations from '../components/TrendingDestinations';
import { usePackages } from '../contexts/PackageContext';
import { testimonials } from '../data/testimonials';
import { packages as allPackages } from '../data/packages';

const Home: React.FC = () => {
  const { packages } = usePackages();

  return (
    <div className="fade-in">
      {/* Slideshow Section */}
      <Slideshow />

      {/* Search Bar */}
      <SearchBar />

      {/* Trending Destinations */}
      <TrendingDestinations packages={allPackages} />
      
      {/* Popular Packages */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Tour Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our hand-picked selection of the most popular Andaman tour packages, designed to give you the perfect island experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.slice(0, 3).map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/packages" className="btn btn-outline">
              View All Packages <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Ali Tours & Travels</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Backed by years of experience and a long list of happy travelers, we’re your trusted partner for memorable journeys.
            </p>
            
            {/* Google Reviews Button */}
            <div className="mt-8">
              <a 
                href="https://share.google/903hhI2NBV800BQfv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Star size={20} className="mr-2 text-yellow-300" />
                ⭐ Check Our Google Reviews
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Our team has extensive knowledge of Andaman's hidden gems and attractions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Tours</h3>
              <p className="text-gray-600">
                We customize each itinerary to match your preferences and interests.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Group Discounts</h3>
              <p className="text-gray-600">
                Special rates for family trips and large group bookings.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={28} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">5-Star Service</h3>
              <p className="text-gray-600">
                Dedicated support throughout your journey for a worry-free experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Destination */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-600 font-medium mb-2 block">Featured Destination</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Radhanagar Beach, Havelock Island</h2>
              <p className="text-gray-600 mb-6">
                Experience one of Asia's best beaches with pristine white sand and turquoise waters. Radhanagar Beach (Beach #7) on Havelock Island has been voted as one of the best beaches in Asia and it's easy to see why.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                    <Star size={14} className="text-primary-600" />
                  </div>
                  <span>Rated among Asia's top beaches</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                    <Star size={14} className="text-primary-600" />
                  </div>
                  <span>Perfect spot for watching stunning sunsets</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                    <Star size={14} className="text-primary-600" />
                  </div>
                  <span>Crystal clear waters ideal for swimming and snorkeling</span>
                </li>
              </ul>
              <Link to="/packages/havelock-escape" className="btn btn-primary">
                Explore Havelock Packages
              </Link>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg" 
                alt="Radhanagar Beach" 
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what travelers who have explored Andaman with us have to say.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/reviews" className="btn btn-outline">
              View All Reviews <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Dreaming of Your Next Escape?</h2>
              <p className="text-primary-100 max-w-2xl">
                Our team is here to design a journey that’s uniquely yours—memorable, smooth, and full of joy.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100">
                Contact Us
              </Link>
              <Link to="/dashboard" className="btn bg-primary-700 text-white hover:bg-primary-800">
                My Dashboard
              </Link>
              <a href="tel:+919876543210" className="btn bg-primary-700 text-white hover:bg-primary-800">
                <Phone size={18} className="mr-2" /> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;