import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ItineraryDayType } from '../types';

interface ItineraryProps {
  itinerary: ItineraryDayType[];
}

const Itinerary: React.FC<ItineraryProps> = ({ itinerary }) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0); // Initially expand day 1
  
  const toggleDay = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null);
    } else {
      setExpandedDay(index);
    }
  };
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Your Day-by-Day Itinerary</h3>
      
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleDay(index)}
              className={`w-full flex items-center justify-between p-4 text-left font-medium focus:outline-none ${
                expandedDay === index ? 'bg-primary-50 text-primary-700' : 'bg-white'
              }`}
            >
              <div className="flex items-center">
                <div className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </div>
                <span>Day {index + 1}: {day.title}</span>
              </div>
              {expandedDay === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            
            {expandedDay === index && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {day.image && (
                    <div className="md:col-span-1">
                      <img 
                        src={day.image} 
                        alt={day.title} 
                        className="w-full h-48 md:h-full object-cover rounded-lg" 
                      />
                    </div>
                  )}
                  <div className={day.image ? "md:col-span-3" : "md:col-span-4"}>
                    <p className="text-gray-600 mb-4">{day.description}</p>
                    
                    {day.activities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Activities:</h4>
                        <ul className="space-y-2">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-start">
                              <div className="text-primary-600 mr-2">•</div>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {day.meals && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Meals:</h4>
                        <p className="text-gray-600">{day.meals}</p>
                      </div>
                    )}
                    
                    {day.accommodation && (
                      <div>
                        <h4 className="font-semibold mb-2">Accommodation:</h4>
                        <p className="text-gray-600">{day.accommodation}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {day.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mt-2">
                    <strong>Note:</strong> {day.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Itinerary;