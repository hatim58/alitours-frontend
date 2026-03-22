import React from 'react';
import { Quote, Star } from 'lucide-react';
import { TestimonialType } from '../types';

interface TestimonialCardProps {
  testimonial: TestimonialType;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="w-12 h-12 rounded-full object-cover mr-4" 
          />
          <div>
            <h3 className="font-semibold">{testimonial.name}</h3>
            <p className="text-sm text-gray-500">{testimonial.location}</p>
          </div>
        </div>
        <Quote className="text-primary-200" size={32} />
      </div>
      
      <div className="flex mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={16} 
            className={star <= testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic mb-3">"{testimonial.text}"</p>
      
      <div className="text-sm text-gray-500">
        <span>Visited: {testimonial.visitDate}</span>
        <span className="mx-2">•</span>
        <span>{testimonial.package}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;