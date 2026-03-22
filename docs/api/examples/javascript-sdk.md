# JavaScript SDK Examples

## Installation

```bash
npm install @ali-tours/api-client
# or
yarn add @ali-tours/api-client
```

## Basic Setup

```javascript
import { AliToursAPI } from '@ali-tours/api-client';

const client = new AliToursAPI({
  baseURL: 'https://api.alitourstravels.in/v1',
  apiKey: 'your-api-key', // Optional for public endpoints
});
```

## Authentication

### Login

```javascript
try {
  const result = await client.auth.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  if (result.success) {
    // Store token for future requests
    client.setAuthToken(result.data.token);
    localStorage.setItem('authToken', result.data.token);
    
    console.log('Logged in as:', result.data.user.name);
  }
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Register

```javascript
try {
  const result = await client.auth.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    phone: '+91 9876543210',
    address: '123 Main Street, City'
  });
  
  if (result.success) {
    client.setAuthToken(result.data.token);
    console.log('Registration successful!');
  }
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

## Tour Packages

### Get All Packages

```javascript
// Basic usage
const packages = await client.packages.getAll();

// With filters
const filteredPackages = await client.packages.getAll({
  destination: 'Shimla',
  duration: '4-7',
  minPrice: 20000,
  maxPrice: 50000,
  page: 1,
  limit: 10
});

console.log(`Found ${filteredPackages.data.pagination.total} packages`);
```

### Get Package Details

```javascript
try {
  const package = await client.packages.getById('shimla-explorer');
  
  console.log('Package:', package.data.name);
  console.log('Duration:', package.data.duration, 'days');
  console.log('Price:', `₹${package.data.price.toLocaleString()}`);
  console.log('Rating:', package.data.rating);
} catch (error) {
  if (error.code === 'PACKAGE_NOT_FOUND') {
    console.log('Package not found');
  }
}
```

### Search Packages

```javascript
const searchResults = await client.packages.search({
  query: 'mountain adventure',
  filters: {
    destination: 'Himachal Pradesh',
    duration: { min: 5, max: 10 }
  },
  sort: { field: 'price', order: 'asc' }
});

searchResults.data.packages.forEach(pkg => {
  console.log(`${pkg.name} - ₹${pkg.price}`);
});
```

### Create Package (Admin Only)

```javascript
// Ensure you're authenticated as admin
const newPackage = await client.packages.create({
  name: 'Kashmir Paradise',
  destination: 'Srinagar, Kashmir',
  description: 'Explore the breathtaking beauty of Kashmir...',
  duration: 6,
  price: 35999,
  originalPrice: 39999,
  maxGuests: 8,
  image: 'https://example.com/kashmir.jpg',
  highlights: [
    'Dal Lake shikara ride',
    'Gulmarg cable car experience'
  ],
  includes: [
    'Accommodation in deluxe houseboats',
    'All meals included'
  ],
  excludes: [
    'Airfare to Srinagar',
    'Personal expenses'
  ],
  itinerary: [
    {
      title: 'Arrival in Srinagar',
      description: 'Arrive and check into houseboat...',
      activities: ['Airport pickup', 'Houseboat check-in'],
      meals: 'Dinner',
      accommodation: 'Deluxe Houseboat'
    }
  ]
});

console.log('Package created:', newPackage.data.id);
```

## Bookings

### Create Booking

```javascript
try {
  const booking = await client.bookings.create({
    packageId: 'shimla-explorer',
    travelDate: '2024-06-15',
    guests: 2,
    specialRequests: 'Vegetarian meals preferred',
    contactInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210'
    },
    passengers: [
      {
        name: 'John Doe',
        age: 35,
        gender: 'male',
        idType: 'passport',
        idNumber: 'A1234567'
      },
      {
        name: 'Jane Doe',
        age: 32,
        gender: 'female',
        idType: 'passport',
        idNumber: 'B7654321'
      }
    ]
  });
  
  console.log('Booking created:', booking.data.id);
  console.log('Total price:', `₹${booking.data.totalPrice}`);
  console.log('Status:', booking.data.status);
} catch (error) {
  if (error.code === 'PACKAGE_UNAVAILABLE') {
    console.log('Package not available for selected date');
    console.log('Available dates:', error.details.availableDates);
  }
}
```

### Get My Bookings

```javascript
const myBookings = await client.bookings.getMy({
  status: 'confirmed',
  sortBy: 'travelDate',
  sortOrder: 'asc'
});

myBookings.data.bookings.forEach(booking => {
  console.log(`${booking.packageName} - ${booking.travelDate}`);
});
```

### Cancel Booking

```javascript
try {
  const result = await client.bookings.cancel('BK1001', {
    reason: 'Change in travel plans',
    refundRequested: true
  });
  
  console.log('Booking cancelled');
  console.log('Refund amount:', `₹${result.data.cancellationDetails.refundAmount}`);
} catch (error) {
  console.error('Cancellation failed:', error.message);
}
```

## Reviews

### Submit Review

```javascript
const review = await client.reviews.submit({
  packageId: 'shimla-explorer',
  rating: 5,
  title: 'Amazing Experience!',
  comment: 'Had a wonderful time in Shimla. The itinerary was perfect and the guide was very knowledgeable.'
});

console.log('Review submitted for approval');
```

### Get Package Reviews

```javascript
const reviews = await client.packages.getReviews('shimla-explorer', {
  page: 1,
  limit: 10
});

console.log(`Average rating: ${reviews.data.averageRating}`);
reviews.data.reviews.forEach(review => {
  console.log(`${review.userName}: ${review.rating}/5 - ${review.title}`);
});
```

## Error Handling

### Global Error Handler

```javascript
client.onError((error) => {
  console.error('API Error:', error);
  
  switch (error.code) {
    case 'UNAUTHORIZED':
      // Redirect to login
      window.location.href = '/login';
      break;
    case 'RATE_LIMIT_EXCEEDED':
      // Show rate limit message
      showNotification('Too many requests. Please try again later.');
      break;
    case 'NETWORK_ERROR':
      // Show offline message
      showNotification('Network error. Please check your connection.');
      break;
    default:
      showNotification('An error occurred. Please try again.');
  }
});
```

### Specific Error Handling

```javascript
try {
  const booking = await client.bookings.create(bookingData);
} catch (error) {
  switch (error.code) {
    case 'PACKAGE_UNAVAILABLE':
      console.log('Package not available for selected date');
      console.log('Available dates:', error.details.availableDates);
      break;
    case 'VALIDATION_ERROR':
      console.log('Validation errors:', error.details);
      break;
    case 'INSUFFICIENT_BALANCE':
      console.log('Insufficient balance for booking');
      break;
    default:
      console.error('Unexpected error:', error.message);
  }
}
```

## Advanced Usage

### Pagination Helper

```javascript
async function getAllPackages() {
  let allPackages = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await client.packages.getAll({ page, limit: 50 });
    allPackages = [...allPackages, ...response.data.packages];
    
    hasMore = response.data.pagination.hasNext;
    page++;
  }
  
  return allPackages;
}
```

### Batch Operations

```javascript
// Create multiple bookings
const bookingPromises = bookingDataArray.map(data => 
  client.bookings.create(data)
);

try {
  const results = await Promise.allSettled(bookingPromises);
  
  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');
  
  console.log(`${successful.length} bookings created successfully`);
  console.log(`${failed.length} bookings failed`);
} catch (error) {
  console.error('Batch operation failed:', error);
}
```

### Real-time Updates (WebSocket)

```javascript
// Connect to real-time updates
const socket = client.realtime.connect();

// Listen for booking updates
socket.on('booking.updated', (data) => {
  console.log('Booking updated:', data.bookingId, data.newStatus);
  updateBookingInUI(data);
});

// Listen for new reviews
socket.on('review.submitted', (data) => {
  console.log('New review submitted:', data.packageId);
  refreshReviews(data.packageId);
});
```

### Caching

```javascript
// Enable caching for better performance
const client = new AliToursAPI({
  baseURL: 'https://api.alitourstravels.in/v1',
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    storage: 'localStorage' // or 'memory'
  }
});

// Cache will automatically handle repeated requests
const packages1 = await client.packages.getAll(); // API call
const packages2 = await client.packages.getAll(); // Cached response
```

## React Integration

### Custom Hook

```typescript
// hooks/usePackages.ts
import { useState, useEffect } from 'react';
import { AliToursAPI } from '@ali-tours/api-client';

export const usePackages = (filters = {}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await client.packages.getAll(filters);
        setPackages(response.data.packages);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [JSON.stringify(filters)]);

  return { packages, loading, error };
};
```

### Component Usage

```tsx
// components/PackageList.tsx
import React from 'react';
import { usePackages } from '../hooks/usePackages';

const PackageList: React.FC = () => {
  const { packages, loading, error } = usePackages({
    destination: 'Shimla',
    limit: 10
  });

  if (loading) return <div>Loading packages...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>{pkg.destination}</p>
          <p>₹{pkg.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};
```

## Testing

### Unit Tests

```javascript
// tests/api.test.js
import { AliToursAPI } from '@ali-tours/api-client';

describe('Ali Tours API Client', () => {
  let client;
  
  beforeEach(() => {
    client = new AliToursAPI({
      baseURL: 'http://localhost:3000/api/v1'
    });
  });

  describe('Packages', () => {
    it('should fetch all packages', async () => {
      const response = await client.packages.getAll();
      
      expect(response.success).toBe(true);
      expect(Array.isArray(response.data.packages)).toBe(true);
    });

    it('should filter packages by destination', async () => {
      const response = await client.packages.getAll({
        destination: 'Shimla'
      });
      
      response.data.packages.forEach(pkg => {
        expect(pkg.destination).toContain('Shimla');
      });
    });
  });

  describe('Bookings', () => {
    it('should create a booking', async () => {
      // Login first
      await client.auth.login({
        email: 'user@example.com',
        password: 'password123'
      });

      const booking = await client.bookings.create({
        packageId: 'shimla-explorer',
        travelDate: '2024-06-15',
        guests: 2,
        contactInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+91 9876543210'
        },
        passengers: [
          {
            name: 'Test User',
            age: 30,
            gender: 'male',
            idType: 'passport',
            idNumber: 'A1234567'
          }
        ]
      });

      expect(booking.success).toBe(true);
      expect(booking.data.id).toBeDefined();
    });
  });
});
```

## Performance Optimization

### Request Batching

```javascript
// Batch multiple requests
const batchRequests = await client.batch([
  { method: 'GET', endpoint: '/packages' },
  { method: 'GET', endpoint: '/bookings' },
  { method: 'GET', endpoint: '/reviews' }
]);

const [packages, bookings, reviews] = batchRequests;
```

### Request Caching

```javascript
// Configure caching
const client = new AliToursAPI({
  baseURL: 'https://api.alitourstravels.in/v1',
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    exclude: ['/auth/*', '/bookings'] // Don't cache auth or bookings
  }
});
```

### Request Retry

```javascript
// Configure automatic retries
const client = new AliToursAPI({
  baseURL: 'https://api.alitourstravels.in/v1',
  retry: {
    attempts: 3,
    delay: 1000, // 1 second
    backoff: 'exponential'
  }
});
```

## TypeScript Support

### Type Definitions

```typescript
import { 
  Package, 
  Booking, 
  CreateBookingRequest, 
  User,
  APIResponse 
} from '@ali-tours/api-client/types';

// Typed API client
const client = new AliToursAPI({
  baseURL: 'https://api.alitourstravels.in/v1'
});

// Type-safe requests
const packages: APIResponse<Package[]> = await client.packages.getAll();
const booking: APIResponse<Booking> = await client.bookings.create(bookingData);
```

### Custom Types

```typescript
// types/api.ts
export interface PackageFilters {
  destination?: string;
  duration?: '1-3' | '4-7' | '8+';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface BookingFormData {
  packageId: string;
  travelDate: string;
  guests: number;
  specialRequests?: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  passengers: Passenger[];
}
```

## Environment Configuration

### Development

```javascript
// config/development.js
export const config = {
  apiBaseURL: 'http://localhost:3000/api/v1',
  timeout: 10000,
  retries: 3,
  cache: {
    enabled: true,
    ttl: 60000 // 1 minute for development
  }
};
```

### Production

```javascript
// config/production.js
export const config = {
  apiBaseURL: 'https://api.alitourstravels.in/v1',
  timeout: 30000,
  retries: 5,
  cache: {
    enabled: true,
    ttl: 300000 // 5 minutes for production
  }
};
```

## Monitoring and Analytics

### Request Logging

```javascript
client.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
  return config;
});

client.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`API Error: ${error.response?.status} ${error.config?.url}`);
    return Promise.reject(error);
  }
);
```

### Performance Tracking

```javascript
// Track API performance
const performanceTracker = {
  startTime: null,
  
  start() {
    this.startTime = performance.now();
  },
  
  end(endpoint) {
    const duration = performance.now() - this.startTime;
    console.log(`${endpoint} took ${duration.toFixed(2)}ms`);
    
    // Send to analytics
    analytics.track('api_request_duration', {
      endpoint,
      duration,
      timestamp: new Date().toISOString()
    });
  }
};

// Use with requests
performanceTracker.start();
const packages = await client.packages.getAll();
performanceTracker.end('/packages');
```

This JavaScript SDK provides a complete interface for interacting with your Ali Tours & Travels API, with proper error handling, TypeScript support, and performance optimization features!