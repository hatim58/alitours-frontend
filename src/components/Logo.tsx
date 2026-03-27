import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'text-primary-600' }) => {
  return (
    <div className="flex items-center">
      <img
        src="/src/assets/alitours.png"
        alt="Ali Tours & Travels"
        className="h-12 w-auto"
      />
    </div>
  );
};

export default Logo;