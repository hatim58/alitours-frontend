import { PackageType } from '../types';

export interface SearchFilters {
  fromCity?: string;
  destination?: string;
  travelDate?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  destinationType?: string;
}

export interface SearchResult {
  packages: PackageType[];
  total: number;
}

const CITY_SUGGESTIONS = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Indore',
  'Chandigarh',
];

const DESTINATION_SUGGESTIONS = [
  { city: 'Shimla', country: 'India' },
  { city: 'Leh', country: 'India' },
  { city: 'Manali', country: 'India' },
  { city: 'Goa', country: 'India' },
  { city: 'Kerala', country: 'India' },
  { city: 'Udaipur', country: 'India' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Bangkok', country: 'Thailand' },
  { city: 'Singapore', country: 'Singapore' },
  { city: 'Bali', country: 'Indonesia' },
  { city: 'Nepal', country: 'Nepal' },
  { city: 'Kathmandu', country: 'Nepal' },
];

export const getCitySuggestions = (query: string): string[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return CITY_SUGGESTIONS.filter(city =>
    city.toLowerCase().startsWith(lowerQuery)
  ).slice(0, 5);
};

export const getDestinationSuggestions = (query: string) => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();
  return DESTINATION_SUGGESTIONS.filter(dest =>
    dest.city.toLowerCase().startsWith(lowerQuery) ||
    dest.country.toLowerCase().startsWith(lowerQuery)
  ).slice(0, 5);
};

export const searchPackages = (
  packages: PackageType[],
  filters: SearchFilters
): SearchResult => {
  let results = [...packages];

  if (filters.fromCity) {
    const fromCityLower = filters.fromCity.toLowerCase();
    const exactMatches = results.filter(pkg =>
      pkg.fromCity?.toLowerCase() === fromCityLower
    );

    if (exactMatches.length > 0) {
      results = exactMatches;
    }
  }

  if (filters.destination) {
    const destLower = filters.destination.toLowerCase();
    results = results.filter(pkg => {
      const city = pkg.destinationCity?.toLowerCase() || '';
      const country = pkg.destinationCountry?.toLowerCase() || '';
      const fullDest = `${city} ${country}`;

      return (
        city.includes(destLower) ||
        country.includes(destLower) ||
        fullDest.includes(destLower) ||
        pkg.destination.toLowerCase().includes(destLower)
      );
    });
  }

  if (filters.minPrice !== undefined) {
    results = results.filter(pkg => pkg.price >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter(pkg => pkg.price <= filters.maxPrice!);
  }

  if (filters.duration !== undefined) {
    results = results.filter(pkg => pkg.duration === filters.duration);
  }

  if (filters.destinationType) {
    results = results.filter(pkg => pkg.destinationType === filters.destinationType);
  }

  return {
    packages: results,
    total: results.length,
  };
};

export const sortPackages = (
  packages: PackageType[],
  sortBy: 'price_low' | 'price_high' | 'popular' | 'rating'
): PackageType[] => {
  const sorted = [...packages];

  switch (sortBy) {
    case 'price_low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'popular':
      return sorted.sort((a, b) => b.reviews - a.reviews);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};

export const getUniqueDestinations = (packages: PackageType[]) => {
  const unique = new Map<string, { city: string; country: string }>();

  packages.forEach(pkg => {
    const key = `${pkg.destinationCity}-${pkg.destinationCountry}`;
    if (!unique.has(key)) {
      unique.set(key, {
        city: pkg.destinationCity,
        country: pkg.destinationCountry,
      });
    }
  });

  return Array.from(unique.values());
};

export const getTrendingDestinations = (packages: PackageType[]) => {
  return packages
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 6)
    .map(pkg => ({
      city: pkg.destinationCity,
      country: pkg.destinationCountry,
      image: pkg.image,
      packages: packages.filter(
        p =>
          p.destinationCity === pkg.destinationCity &&
          p.destinationCountry === pkg.destinationCountry
      ).length,
    }));
};

export const getPriceRange = (packages: PackageType[]) => {
  if (packages.length === 0) return { min: 0, max: 0 };

  const prices = packages.map(pkg => pkg.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

export const getDurationOptions = (packages: PackageType[]) => {
  const durations = new Set(packages.map(pkg => pkg.duration));
  return Array.from(durations).sort((a, b) => a - b);
};

export const getDestinationTypes = (packages: PackageType[]) => {
  const types = new Set(packages.map(pkg => pkg.destinationType).filter(Boolean));
  return Array.from(types) as string[];
};
