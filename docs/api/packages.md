# Tour Packages API

## Overview

The Tour Packages API allows you to manage tour packages, including creating, updating, retrieving, and deleting packages. This API supports both public access for viewing packages and admin access for management.

## Endpoints

### Get All Packages

**GET** `/packages`

Retrieve a list of all tour packages with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 10, max: 100) | `?limit=20` |
| `search` | string | Search in name, destination, description | `?search=shimla` |
| `destination` | string | Filter by destination | `?destination=Shimla` |
| `duration` | string | Filter by duration range | `?duration=4-7` |
| `minPrice` | number | Minimum price filter | `?minPrice=20000` |
| `maxPrice` | number | Maximum price filter | `?maxPrice=50000` |
| `sortBy` | string | Sort field (price, rating, duration) | `?sortBy=price` |
| `sortOrder` | string | Sort order (asc, desc) | `?sortOrder=asc` |

**Example Request:**
```bash
GET /packages?destination=Shimla&duration=4-7&minPrice=20000&maxPrice=40000&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "shimla-explorer",
        "name": "Shimla Winter Wonderland",
        "destination": "Shimla, Himachal Pradesh",
        "description": "Experience the magic of Shimla with our comprehensive tour package...",
        "duration": 5,
        "price": 24999,
        "originalPrice": 29999,
        "discount": 17,
        "maxGuests": 12,
        "rating": 4.8,
        "reviews": 89,
        "image": "https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg",
        "highlights": [
          "Visit the famous Mall Road and Ridge",
          "Toy train ride from Kalka to Shimla",
          "Day trip to Kufri adventure park"
        ],
        "includes": [
          "Accommodation in 3-star hotels",
          "Daily breakfast and dinner",
          "All transfers in AC vehicle"
        ],
        "excludes": [
          "Airfare or train fare to/from Kalka",
          "Personal expenses",
          "Adventure activities"
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-05-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "appliedFilters": {
        "destination": "Shimla",
        "duration": "4-7",
        "priceRange": "20000-40000"
      },
      "availableDestinations": ["Shimla", "Ladakh", "Kashmir"],
      "priceRange": {
        "min": 15000,
        "max": 75000
      }
    }
  }
}
```

### Get Package by ID

**GET** `/packages/{id}`

Retrieve detailed information about a specific tour package.

**Path Parameters:**
- `id` (string, required): Package ID

**Example Request:**
```bash
GET /packages/shimla-explorer
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "shimla-explorer",
    "name": "Shimla Winter Wonderland",
    "destination": "Shimla, Himachal Pradesh",
    "description": "Experience the magic of Shimla with our comprehensive tour package...",
    "duration": 5,
    "price": 24999,
    "originalPrice": 29999,
    "discount": 17,
    "maxGuests": 12,
    "rating": 4.8,
    "reviews": 89,
    "image": "https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg",
    "gallery": [
      "https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg",
      "https://images.pexels.com/photos/2440021/pexels-photo-2440021.jpeg"
    ],
    "highlights": [
      "Visit the famous Mall Road and Ridge",
      "Toy train ride from Kalka to Shimla"
    ],
    "includes": [
      "Accommodation in 3-star hotels",
      "Daily breakfast and dinner"
    ],
    "excludes": [
      "Airfare or train fare to/from Kalka",
      "Personal expenses"
    ],
    "itinerary": [
      {
        "title": "Arrival in Shimla",
        "description": "Arrive in Kalka and board the famous toy train to Shimla...",
        "activities": [
          "Toy train journey",
          "Hotel check-in",
          "Mall Road visit"
        ],
        "meals": "Dinner",
        "accommodation": "Hotel Willow Banks, Shimla",
        "image": "https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg",
        "notes": "Rest day for acclimatization"
      }
    ],
    "accommodation": [
      {
        "name": "Hotel Willow Banks, Shimla",
        "description": "A heritage hotel located on Mall Road with modern amenities...",
        "amenities": [
          "Room service",
          "Restaurant",
          "Wi-Fi",
          "Mountain view"
        ],
        "images": [
          "https://example.com/hotel1.jpg"
        ]
      }
    ],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-05-20T10:30:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "PACKAGE_NOT_FOUND",
    "message": "Package with ID 'invalid-id' not found"
  }
}
```

### Create Package (Admin Only)

**POST** `/packages`

Create a new tour package.

**Authentication:** Admin role required

**Request Body:**
```json
{
  "name": "Kashmir Paradise",
  "destination": "Srinagar, Kashmir",
  "description": "Explore the breathtaking beauty of Kashmir with our specially curated package...",
  "duration": 6,
  "price": 35999,
  "originalPrice": 39999,
  "maxGuests": 8,
  "image": "https://example.com/kashmir-main.jpg",
  "gallery": [
    "https://example.com/kashmir1.jpg",
    "https://example.com/kashmir2.jpg"
  ],
  "highlights": [
    "Dal Lake shikara ride",
    "Gulmarg cable car experience",
    "Pahalgam valley visit"
  ],
  "includes": [
    "Accommodation in deluxe houseboats",
    "All meals included",
    "Airport transfers",
    "Sightseeing as per itinerary"
  ],
  "excludes": [
    "Airfare to Srinagar",
    "Personal expenses",
    "Adventure activities",
    "Travel insurance"
  ],
  "itinerary": [
    {
      "title": "Arrival in Srinagar",
      "description": "Arrive at Srinagar airport and transfer to houseboat...",
      "activities": [
        "Airport pickup",
        "Houseboat check-in",
        "Dal Lake evening walk"
      ],
      "meals": "Dinner",
      "accommodation": "Deluxe Houseboat on Dal Lake",
      "image": "https://example.com/day1.jpg",
      "notes": "Rest and acclimatization day"
    }
  ],
  "accommodation": [
    {
      "name": "Deluxe Houseboat, Dal Lake",
      "description": "Traditional Kashmiri houseboat with modern amenities...",
      "amenities": [
        "Traditional Kashmiri decor",
        "Modern bathrooms",
        "Complimentary Wi-Fi",
        "Lake view"
      ]
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "kashmir-paradise",
    "name": "Kashmir Paradise",
    "destination": "Srinagar, Kashmir",
    "price": 35999,
    "rating": 4.5,
    "reviews": 0,
    "createdAt": "2024-05-20T10:30:00Z"
  }
}
```

### Update Package (Admin Only)

**PUT** `/packages/{id}`

Update an existing tour package.

**Authentication:** Admin role required

**Path Parameters:**
- `id` (string, required): Package ID

**Request Body:** Same as Create Package

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "kashmir-paradise",
    "name": "Kashmir Paradise Updated",
    "updatedAt": "2024-05-20T11:00:00Z"
  }
}
```

### Delete Package (Admin Only)

**DELETE** `/packages/{id}`

Delete a tour package.

**Authentication:** Admin role required

**Path Parameters:**
- `id` (string, required): Package ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Package deleted successfully"
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": {
    "code": "PACKAGE_HAS_BOOKINGS",
    "message": "Cannot delete package with existing bookings",
    "details": {
      "activeBookings": 5
    }
  }
}
```

## Package Search

### Advanced Search

**GET** `/packages/search`

Advanced search with multiple filters and sorting options.

**Query Parameters:**
```bash
GET /packages/search?q=shimla&filters[destination]=Himachal&filters[duration][min]=3&filters[duration][max]=7&sort=price:asc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "packages": [...],
    "searchMeta": {
      "query": "shimla",
      "totalResults": 15,
      "searchTime": "0.045s",
      "suggestions": ["Shimla", "Manali", "Dharamshala"]
    }
  }
}
```

### Get Popular Packages

**GET** `/packages/popular`

Get the most popular packages based on bookings and ratings.

**Query Parameters:**
- `limit` (number): Number of packages to return (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "packages": [...],
    "criteria": {
      "basedOn": ["bookings", "ratings", "reviews"],
      "period": "last_30_days"
    }
  }
}
```

## Package Analytics (Admin Only)

### Get Package Statistics

**GET** `/packages/{id}/analytics`

Get detailed analytics for a specific package.

**Authentication:** Admin role required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "packageId": "shimla-explorer",
    "analytics": {
      "totalBookings": 156,
      "totalRevenue": 3899844,
      "averageRating": 4.8,
      "conversionRate": 12.5,
      "viewsToBookings": {
        "views": 2500,
        "bookings": 156,
        "rate": 6.24
      },
      "monthlyTrends": [
        {
          "month": "2024-04",
          "bookings": 25,
          "revenue": 624975
        }
      ],
      "customerSegments": {
        "families": 60,
        "couples": 35,
        "solo": 5
      }
    }
  }
}
```

## Validation Rules

### Package Creation/Update

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | 3-100 characters |
| `destination` | string | Yes | 3-100 characters |
| `description` | string | Yes | 50-2000 characters |
| `duration` | number | Yes | 1-30 days |
| `price` | number | Yes | > 0 |
| `originalPrice` | number | No | >= price |
| `maxGuests` | number | Yes | 1-50 |
| `image` | string | Yes | Valid URL |
| `gallery` | array | No | Array of valid URLs |
| `highlights` | array | Yes | 1-10 items, each 10-200 chars |
| `includes` | array | Yes | 1-20 items, each 10-200 chars |
| `excludes` | array | Yes | 1-20 items, each 10-200 chars |

## Rate Limiting

- **Public endpoints**: 100 requests per hour per IP
- **Authenticated users**: 1000 requests per hour
- **Admin users**: 5000 requests per hour

## Caching

- **Package list**: Cached for 5 minutes
- **Individual packages**: Cached for 15 minutes
- **Popular packages**: Cached for 1 hour

Cache headers:
```
Cache-Control: public, max-age=300
ETag: "package-list-v1-hash"
```

## Webhooks

### Package Events

Subscribe to package-related events:

**Events:**
- `package.created`
- `package.updated`
- `package.deleted`
- `package.booking_received`

**Webhook Payload:**
```json
{
  "event": "package.created",
  "data": {
    "packageId": "new-package-id",
    "packageName": "New Package Name",
    "createdBy": "admin_user_id",
    "timestamp": "2024-05-20T10:30:00Z"
  }
}
```

## Implementation Examples

### Frontend (React)

```typescript
// packages.service.ts
interface PackageFilters {
  destination?: string;
  duration?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

class PackagesService {
  async getPackages(filters: PackageFilters = {}, page = 1, limit = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    });

    const response = await fetch(`/api/packages?${params}`);
    return response.json();
  }

  async getPackageById(id: string) {
    const response = await fetch(`/api/packages/${id}`);
    return response.json();
  }

  async createPackage(packageData: CreatePackageRequest) {
    const response = await fetch('/api/packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(packageData)
    });
    return response.json();
  }
}
```

### Backend (Node.js/Express)

```javascript
// routes/packages.js
const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validatePackage } = require('../middleware/validation');
const PackageService = require('../services/PackageService');

const router = express.Router();

// Get all packages (public)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      destination,
      duration,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      search,
      destination,
      duration,
      priceRange: minPrice || maxPrice ? { min: minPrice, max: maxPrice } : undefined
    };

    const result = await PackageService.getPackages({
      filters,
      pagination: { page: parseInt(page), limit: parseInt(limit) },
      sort: { field: sortBy, order: sortOrder }
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve packages'
      }
    });
  }
});

// Create package (admin only)
router.post('/', authenticateToken, requireAdmin, validatePackage, async (req, res) => {
  try {
    const package = await PackageService.createPackage(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CREATION_FAILED',
        message: error.message
      }
    });
  }
});

module.exports = router;
```

## Testing

### Unit Tests

```javascript
// tests/packages.test.js
describe('Packages API', () => {
  describe('GET /packages', () => {
    it('should return paginated packages', async () => {
      const response = await request(app)
        .get('/api/packages?page=1&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.packages).toHaveLength(5);
      expect(response.body.data.pagination.page).toBe(1);
    });

    it('should filter packages by destination', async () => {
      const response = await request(app)
        .get('/api/packages?destination=Shimla')
        .expect(200);

      response.body.data.packages.forEach(pkg => {
        expect(pkg.destination).toContain('Shimla');
      });
    });
  });

  describe('POST /packages', () => {
    it('should create package with admin auth', async () => {
      const packageData = {
        name: 'Test Package',
        destination: 'Test Destination',
        // ... other required fields
      };

      const response = await request(app)
        .post('/api/packages')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(packageData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Package');
    });

    it('should reject creation without admin auth', async () => {
      const response = await request(app)
        .post('/api/packages')
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });
});
```

## Performance Considerations

### Optimization Strategies

1. **Database Indexing**
   - Index on `destination`, `price`, `rating`
   - Composite index on `(destination, price)`
   - Full-text search index on `name`, `description`

2. **Caching Strategy**
   - Redis cache for popular packages
   - CDN caching for package images
   - Application-level caching for search results

3. **Pagination**
   - Cursor-based pagination for large datasets
   - Limit maximum page size to 100

4. **Image Optimization**
   - Serve images through CDN
   - Multiple image sizes for different use cases
   - WebP format support

## Monitoring and Logging

### Metrics to Track

- API response times
- Error rates by endpoint
- Most popular packages
- Search query patterns
- Cache hit rates

### Logging Format

```json
{
  "timestamp": "2024-05-20T10:30:00Z",
  "level": "info",
  "method": "GET",
  "url": "/packages",
  "statusCode": 200,
  "responseTime": 45,
  "userId": "user_123",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```