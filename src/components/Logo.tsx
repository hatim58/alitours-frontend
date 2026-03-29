import React from 'react';
import logo from '../assets/alitours3.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="Ali Tours & Travels"
        className={`h-12 w-auto object-contain max-h-full ${className}`}
      />
    </div>
  );
};

export default Logo;