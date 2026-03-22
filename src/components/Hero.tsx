import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  showSearch?: boolean;
}

const Hero: React.FC<HeroProps> = ({ 
  title, 
  subtitle, 
  cta, 
  ctaLink, 
  showSearch = false 
}) => {
  return (
    <section className="relative h-screen max-h-[800px] min-h-[500px] bg-hero-pattern bg-cover bg-center">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="container relative h-full flex items-center">
        <div className="max-w-3xl text-white pt-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={ctaLink} className="btn btn-primary">
              {cta}
            </Link>
            <Link to="/contact" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      {showSearch && (
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="container">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="label">Destination</label>
                  <select className="input">
                    <option>Andaman Islands</option>
                    <option>Havelock Island</option>
                    <option>Neil Island</option>
                    <option>Port Blair</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">Check In</label>
                  <input type="date" className="input" />
                </div>
                <div className="flex-1">
                  <label className="label">Duration</label>
                  <select className="input">
                    <option>3-4 Days</option>
                    <option>5-6 Days</option>
                    <option>7-8 Days</option>
                    <option>9+ Days</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label">Guests</label>
                  <select className="input">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                    <option>5+ Guests</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="btn btn-primary h-[50px] w-full md:w-auto">
                    <Search size={18} className="mr-2" /> Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;