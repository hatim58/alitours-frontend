import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, User, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Destinations', path: '/locations' },
    { name: 'Tour Packages', path: '/packages' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled || isOpen || location.pathname !== '/'
        ? 'bg-white shadow-md py-2'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a href="tel:+917869147222" className={`flex items-center font-medium transition-colors ${scrolled || isOpen || location.pathname !== '/' ? 'text-gray-700 hover:text-primary-600' : 'text-white hover:text-gray-200'
            }`}>
            <Phone size={18} className="mr-1" />
            <span>7869147222</span>
          </a>

          <Link to="/" className="flex items-center">
            <Logo className={scrolled || isOpen || location.pathname !== '/' ? 'text-primary-600' : 'text-white'} />
            <span
              className={`ml-2 text-xl font-bold ${scrolled || isOpen || location.pathname !== '/' ? 'text-primary-600' : 'text-white'
                }`}
            >
              Tours & Travels
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium hover:text-primary-500 transition-colors ${location.pathname === link.path
                ? 'text-primary-500'
                : scrolled || location.pathname !== '/'
                  ? 'text-gray-700'
                  : 'text-white'
                }`}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-medium ${scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'
                  }`}
              >
                <User size={18} />
                <span>{user?.name || 'Account'}</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                )}
                <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  My Account
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className={`flex items-center space-x-1 font-medium ${scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'
                }`}
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden"
        >
          {isOpen ? (
            <X
              size={24}
              className={scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'}
            />
          ) : (
            <Menu
              size={24}
              className={scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block font-medium ${location.pathname === link.path
                  ? 'text-primary-500'
                  : 'text-gray-700'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <p className="font-medium text-gray-700">
                  Hello, {user?.name || 'User'}
                </p>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="block text-gray-700">
                    Dashboard
                  </Link>
                )}
                <Link to="/dashboard" className="block text-gray-700">
                  My Account
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left text-gray-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block font-medium text-gray-700"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;