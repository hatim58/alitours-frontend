export interface LocationType {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export interface PackageType {
  id: string;
  name: string;
  locationId?: string;
  destination: string;
  destinationCity: string;
  destinationCountry: string;
  fromCity?: string;
  description: string;
  duration: number;
  price: number;
  originalPrice: number;
  discount: number;
  maxGuests: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDayType[];
  accommodation: AccommodationType[];
  destinationType?: 'adventure' | 'beach' | 'cultural' | 'mountain' | 'spiritual' | 'wildlife';
}

export interface ItineraryDayType {
  title: string;
  description: string;
  activities: string[];
  meals?: string;
  accommodation?: string;
  image?: string;
  notes?: string;
}

export interface AccommodationType {
  name: string;
  description: string;
  amenities: string[];
  images?: string[];
}

export interface TestimonialType {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  package: string;
  visitDate: string;
}

export interface BookingType {
  id: string;
  packageId: string;
  packageName: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: Date;
}

export interface UserType {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  registrationDate: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string | null;
  status: 'active' | 'inactive';
  notes?: string;
  role: 'user' | 'admin';
}

export interface ReviewType {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageId?: string;
  packageName?: string;
  rating: number;
  title: string;
  comment: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface SlideType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  type: 'package' | 'offer' | 'promotion';
  packageId?: string;
  offerDetails?: {
    originalPrice?: number;
    discountPrice?: number;
    discountPercentage?: number;
    validUntil?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}