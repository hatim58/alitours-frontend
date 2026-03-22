export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  balance: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  type: 'FLIGHT' | 'TRAIN' | 'HOTEL' | 'BUS' | 'TOUR';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  amount: number;
  paidAmount: number;
  bookingDate: Date;
  travelDate: Date;
  details: BookingDetails;
}

export interface BookingDetails {
  // Common fields
  passengers: Passenger[];
  specialRequests?: string;
  
  // Type-specific fields
  flightDetails?: FlightDetails;
  trainDetails?: TrainDetails;
  hotelDetails?: HotelDetails;
  busDetails?: BusDetails;
  tourDetails?: TourDetails;
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idType: 'AADHAR' | 'PAN' | 'PASSPORT';
  idNumber: string;
}

export interface FlightDetails {
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: Date;
  arrivalTime: Date;
  class: 'ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface TrainDetails {
  trainNumber: string;
  trainName: string;
  departure: string;
  arrival: string;
  departureTime: Date;
  arrivalTime: Date;
  class: string;
  coach: string;
  berth: string;
}

export interface HotelDetails {
  hotelName: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  roomType: string;
  numberOfRooms: number;
  mealPlan: string;
}

export interface BusDetails {
  operator: string;
  busType: string;
  departure: string;
  arrival: string;
  departureTime: Date;
  arrivalTime: Date;
  seatNumbers: string[];
}

export interface TourDetails {
  packageName: string;
  destination: string;
  duration: number;
  inclusions: string[];
  itinerary: TourDay[];
}

export interface TourDay {
  day: number;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface Quotation {
  id: string;
  customerId: string;
  packageName: string;
  tourRoute: string;
  duration: string;
  noOfTravellers: number;
  travelDate: Date;
  packageInclusion: string;
  packageExclusion: string;
  note: string;
  advancePolicy: string;
  cancellationPolicy: string;
  validUntil: Date;
  items: QuotationItem[];
  terms: string[];
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  createdAt: Date;
}

export interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  bookingId?: string;
  type: 'PAYMENT' | 'REFUND';
  amount: number;
  paymentMethod: string;
  reference: string;
  date: Date;
  notes?: string;
}

export interface LedgerEntry {
  id: string;
  customerId: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reference: string;
}