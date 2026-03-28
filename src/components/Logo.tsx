import React from 'react';
import logo from '../assets/alitours.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-12 w-auto' }) => {
  return (
    <div className="flex items-center">
      <img
        src={logo}
        alt="Ali Tours & Travels"
        className={className}
      />
    </div>
  );
};

export default Logo;