import { PackageType } from '../types';

export const packages: PackageType[] = [
  {
    id: 'shimla-explorer',
    name: 'Shimla Winter Wonderland',
    destination: 'Shimla, Himachal Pradesh',
    destinationCity: 'Shimla',
    destinationCountry: 'India',
    fromCity: 'Delhi',
    description: 'Experience the magic of Shimla with our comprehensive tour package. Visit the historic Mall Road, enjoy the scenic beauty of Kufri, and take a heritage walk through the colonial architecture.',
    duration: 5,
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    maxGuests: 12,
    rating: 4.8,
    reviews: 89,
    destinationType: 'mountain',
    image: 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
    gallery: [
      'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg',
      'https://images.pexels.com/photos/2440021/pexels-photo-2440021.jpeg',
      'https://images.pexels.com/photos/2440019/pexels-photo-2440019.jpeg'
    ],
    highlights: [
      'Visit the famous Mall Road and Ridge',
      'Toy train ride from Kalka to Shimla',
      'Day trip to Kufri adventure park',
      'Heritage walking tour',
      'Visit to Jakhu Temple'
    ],
    includes: [
      'Accommodation in 3-star hotels',
      'Daily breakfast and dinner',
      'All transfers in AC vehicle',
      'Toy train tickets',
      'Sightseeing as per itinerary',
      'Professional guide services'
    ],
    excludes: [
      'Airfare or train fare to/from Kalka',
      'Personal expenses',
      'Adventure activities',
      'Lunch and additional meals',
      'Travel insurance'
    ],
    itinerary: [
      {
        title: 'Arrival in Shimla',
        description: 'Arrive in Kalka and board the famous toy train to Shimla. Check-in to your hotel and evening free for Mall Road visit.',
        activities: [
          'Toy train journey',
          'Hotel check-in',
          'Mall Road visit'
        ],
        meals: 'Dinner',
        accommodation: 'Hotel Willow Banks, Shimla',
        image: 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg'
      }
    ],
    accommodation: [
      {
        name: 'Hotel Willow Banks, Shimla',
        description: 'A heritage hotel located on Mall Road with modern amenities and mountain views.',
        amenities: ['Room service', 'Restaurant', 'Wi-Fi', 'Mountain view']
      }
    ]
  },
  {
    id: 'ladakh-adventure',
    name: 'Ladakh Adventure Explorer',
    destination: 'Leh-Ladakh',
    destinationCity: 'Leh',
    destinationCountry: 'India',
    fromCity: 'Delhi',
    description: 'Embark on an unforgettable journey through the breathtaking landscapes of Ladakh. Visit ancient monasteries, high-altitude lakes, and experience the unique culture.',
    duration: 7,
    price: 35999,
    originalPrice: 41999,
    discount: 14,
    maxGuests: 10,
    rating: 4.9,
    reviews: 76,
    destinationType: 'adventure',
    image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
    gallery: [
      'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg',
      'https://images.pexels.com/photos/2901215/pexels-photo-2901215.jpeg',
      'https://images.pexels.com/photos/2901218/pexels-photo-2901218.jpeg'
    ],
    highlights: [
      'Visit Pangong Lake',
      'Explore Nubra Valley',
      'Visit ancient monasteries',
      'Experience local culture',
      'Khardung La Pass visit'
    ],
    includes: [
      'Accommodation in hotels and camps',
      'All meals included',
      'SUV transfers',
      'Oxygen cylinders',
      'Inner line permits',
      'Local guide'
    ],
    excludes: [
      'Flights to/from Leh',
      'Personal expenses',
      'Additional activities',
      'Travel insurance',
      'Tips and gratuities'
    ],
    itinerary: [
      {
        title: 'Arrival in Leh',
        description: 'Arrive in Leh and rest for acclimatization. Evening visit to Leh Palace and market.',
        activities: [
          'Airport pickup',
          'Hotel check-in',
          'Rest and acclimatization',
          'Evening market visit'
        ],
        meals: 'All meals included',
        accommodation: 'Hotel Grand Dragon, Leh',
        image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg'
      }
    ],
    accommodation: [
      {
        name: 'Hotel Grand Dragon, Leh',
        description: 'Luxury hotel with oxygen-enriched rooms and mountain views.',
        amenities: ['Oxygen enriched rooms', 'Restaurant', 'Spa', 'Wi-Fi']
      }
    ]
  }
];