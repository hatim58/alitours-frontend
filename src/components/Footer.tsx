import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Star } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <Logo className="text-white" />
              <span className="ml-2 text-xl font-bold">Ali Tours & Travels</span>
            </div>
            <p className="text-gray-400 mb-6">
              Discover the beauty of India with Ali Tours & Travels. We provide the best travel experiences with personalized service.
            </p>
            
            {/* Google Reviews Button */}
            <div className="mb-6">
              <a 
                href="https://share.google/903hhI2NBV800BQfv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Star size={16} className="mr-2 text-yellow-300" />
                Read What Our Customers Say on Google
              </a>
            </div>
            
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/alitoursandtravels53" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.instagram.com/alitoursandtravels53/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Book Now
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/packages/shimla-explorer" className="text-gray-400 hover:text-white transition-colors">
                  Shimla
                </Link>
              </li>
              <li>
                <Link to="/packages/ladakh-adventure" className="text-gray-400 hover:text-white transition-colors">
                  Ladakh
                </Link>
              </li>
              <li>
                <Link to="/packages/kashmir-paradise" className="text-gray-400 hover:text-white transition-colors">
                  Kashmir
                </Link>
              </li>
              <li>
                <Link to="/packages/kerala-backwaters" className="text-gray-400 hover:text-white transition-colors">
                  Kerala
                </Link>
              </li>
              <li>
                <Link to="/packages/andaman-explorer" className="text-gray-400 hover:text-white transition-colors">
                  Andaman
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-primary-500 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  Bohra Complex Shop No 3, Near Hirazy Sales, Jwali Poll, Telipara Road, Bilaspur, C.G. 495001, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-primary-500 flex-shrink-0" size={18} />
                <a href="tel:+917869147222" className="text-gray-400 hover:text-white transition-colors">
                  +91 78691-47222
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-primary-500 flex-shrink-0" size={18} />
                <a href="mailto:info@alitourstravels.in" className="text-gray-400 hover:text-white transition-colors">
                  info@alitourstravels.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Ali Tours & Travels. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
        
        {/* CodeHaven Designer Credit */}
        <CodeHavenCredit />
      </div>
    </footer>
  );
};

// CodeHaven Credit Component
const CodeHavenCredit: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-8 pt-6 border-t border-gray-800">
      <div className="text-center">
        {/* Small Tag */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 text-xs hover:text-primary-400 transition-colors duration-200 flex items-center justify-center mx-auto group"
        >
          <span className="mr-1">💻</span>
          <span>Designed by CodeHaven</span>
          <svg 
            className={`ml-1 w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 animate-fadeIn">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-white font-semibold text-lg mb-3">
                💻 Website Developed by CodeHaven Software
              </h3>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                This website was proudly developed by <span className="text-primary-400 font-medium">CodeHaven Software</span> – a digital solutions company founded by Hatim Husain and Yusuf Patnawala. 
                Built on a shared passion for technology, innovation, and excellence, CodeHaven Software transforms ideas into intelligent and impactful digital products.
              </p>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                With deep expertise in custom software development, web and mobile applications, IT services, and system integration, they create scalable and user-friendly solutions tailored to the unique needs of businesses and organizations.
              </p>
              
              <div className="mb-4">
                <h4 className="text-primary-400 font-medium text-sm mb-2">Their approach focuses on:</h4>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                  <span className="bg-gray-700 px-3 py-1 rounded-full">Collaboration</span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full">Transparency</span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full">Technical Precision</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                They listen carefully, understand thoroughly, and build smartly — enabling clients to grow through seamless and efficient digital tools.
              </p>
              
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-primary-400 font-medium text-sm mb-3">Contact CodeHaven Software</h4>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <span>Hatim Husain – </span>
                    <a href="tel:+916265811158" className="text-primary-400 hover:text-primary-300 ml-1 underline">
                      +91 62658 11158
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <span>Yusuf Patnawala – </span>
                    <a href="tel:+917869147222" className="text-primary-400 hover:text-primary-300 ml-1 underline">
                      +91 78691 47222
                    </a>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <a href="mailto:info.codehaven@gmail.com" className="text-primary-400 hover:text-primary-300 underline">
                      info.codehaven@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs mt-4 italic">
                "Driven by innovation and guided by integrity, CodeHaven Software is your trusted partner in the ever-evolving digital world."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer;