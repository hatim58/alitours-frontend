# Ali Tours & Travels API Documentation

## Overview

This document provides comprehensive documentation for the Ali Tours & Travels API. The API follows RESTful principles and provides endpoints for managing tour packages, bookings, customers, quotations, and more.

## Base URL

```
Production: https://api.alitourstravels.in/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All API endpoints require authentication using Bearer tokens.

### Authentication Header
```
Authorization: Bearer <your-jwt-token>
```

### Getting an Access Token

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `INTERNAL_ERROR` | 500 | Server error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

## API Endpoints

### Table of Contents

1. [Authentication](#authentication-endpoints)
2. [Tour Packages](#tour-packages)
3. [Bookings](#bookings)
4. [Customers](#customers)
5. [Quotations](#quotations)
6. [Invoices](#invoices)
7. [Reviews](#reviews)
8. [Slideshow](#slideshow)

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

Authenticate a user and receive an access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "phone": "+91 9876543210"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Register
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "address": "123 Main Street, City, State 123456"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_124",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### Refresh Token
**POST** `/auth/refresh`

Refresh an expired access token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

---

## Tour Packages

### Get All Packages
**GET** `/packages`

Retrieve all tour packages with optional filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `destination` (string): Filter by destination
- `duration` (string): Filter by duration (e.g., "1-3", "4-7", "8+")
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `search` (string): Search in name, destination, or description

**Example Request:**
```
GET /packages?destination=Shimla&duration=4-7&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "shimla-explorer",
        "name": "Shimla Winter Wonderland",
        "destination": "Shimla, Himachal Pradesh",
        "description": "Experience the magic of Shimla...",
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
          "Toy train ride from Kalka to Shimla"
        ],
        "includes": [
          "Accommodation in 3-star hotels",
          "Daily breakfast and dinner"
        ],
        "excludes": [
          "Airfare or train fare to/from Kalka",
          "Personal expenses"
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### Get Package by ID
**GET** `/packages/{id}`

Retrieve a specific tour package by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "shimla-explorer",
    "name": "Shimla Winter Wonderland",
    "destination": "Shimla, Himachal Pradesh",
    "description": "Experience the magic of Shimla...",
    "duration": 5,
    "price": 24999,
    "originalPrice": 29999,
    "discount": 17,
    "maxGuests": 12,
    "rating": 4.8,
    "reviews": 89,
    "image": "https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg",
    "gallery": [
      "https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg"
    ],
    "highlights": [
      "Visit the famous Mall Road and Ridge"
    ],
    "includes": [
      "Accommodation in 3-star hotels"
    ],
    "excludes": [
      "Airfare or train fare to/from Kalka"
    ],
    "itinerary": [
      {
        "title": "Arrival in Shimla",
        "description": "Arrive in Kalka and board the famous toy train...",
        "activities": [
          "Toy train journey",
          "Hotel check-in"
        ],
        "meals": "Dinner",
        "accommodation": "Hotel Willow Banks, Shimla"
      }
    ],
    "accommodation": [
      {
        "name": "Hotel Willow Banks, Shimla",
        "description": "A heritage hotel located on Mall Road...",
        "amenities": ["Room service", "Restaurant", "Wi-Fi"]
      }
    ]
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
  "description": "Explore the beauty of Kashmir...",
  "duration": 6,
  "price": 35999,
  "originalPrice": 39999,
  "maxGuests": 8,
  "image": "https://example.com/kashmir.jpg",
  "highlights": [
    "Dal Lake shikara ride",
    "Gulmarg cable car"
  ],
  "includes": [
    "Accommodation in houseboats",
    "All meals included"
  ],
  "excludes": [
    "Airfare to Srinagar",
    "Personal expenses"
  ],
  "itinerary": [
    {
      "title": "Arrival in Srinagar",
      "description": "Arrive and check into houseboat...",
      "activities": ["Airport pickup", "Houseboat check-in"],
      "meals": "Dinner",
      "accommodation": "Deluxe Houseboat"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "kashmir-paradise",
    "name": "Kashmir Paradise",
    "createdAt": "2024-05-20T10:30:00Z"
  }
}
```

---

## Bookings

### Get User Bookings
**GET** `/bookings`

Retrieve bookings for the authenticated user.

**Query Parameters:**
- `status` (string): Filter by status (pending, confirmed, cancelled)
- `page` (number): Page number
- `limit` (number): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "BK1001",
        "packageId": "shimla-explorer",
        "packageName": "Shimla Winter Wonderland",
        "userId": "user_123",
        "userName": "John Doe",
        "email": "user@example.com",
        "phone": "+91 9876543210",
        "travelDate": "2024-06-15",
        "guests": 2,
        "totalPrice": 49998,
        "status": "confirmed",
        "specialRequests": "Vegetarian meals preferred",
        "createdAt": "2024-05-20T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### Create Booking
**POST** `/bookings`

Create a new booking.

**Request Body:**
```json
{
  "packageId": "shimla-explorer",
  "travelDate": "2024-06-15",
  "guests": 2,
  "specialRequests": "Vegetarian meals preferred"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "BK1002",
    "packageId": "shimla-explorer",
    "packageName": "Shimla Winter Wonderland",
    "status": "pending",
    "totalPrice": 49998,
    "createdAt": "2024-05-20T10:30:00Z"
  }
}
```

### Update Booking Status (Admin Only)
**PATCH** `/bookings/{id}/status`

Update the status of a booking.

**Authentication:** Admin role required

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "BK1002",
    "status": "confirmed",
    "updatedAt": "2024-05-20T11:00:00Z"
  }
}
```

---

## Customers

### Get All Customers (Admin Only)
**GET** `/customers`

Retrieve all customers.

**Authentication:** Admin role required

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name, email, or phone
- `status` (string): Filter by status (active, inactive)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "CUST001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91 9876543210",
        "address": "123 Main Street, City",
        "gstNumber": "22AAAAA0000A1Z5",
        "balance": 0,
        "totalBookings": 3,
        "totalSpent": 125000,
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

### Create Customer (Admin Only)
**POST** `/customers`

Create a new customer.

**Authentication:** Admin role required

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+91 9876543211",
  "address": "456 Oak Street, City",
  "gstNumber": "22BBBBB0000B1Z5"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "CUST002",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "createdAt": "2024-05-20T10:30:00Z"
  }
}
```

---

## Quotations

### Get All Quotations (Admin Only)
**GET** `/quotations`

Retrieve all quotations.

**Authentication:** Admin role required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "quotations": [
      {
        "id": "QT001",
        "customerId": "CUST001",
        "customerName": "John Doe",
        "customerPhone": "+91 9876543210",
        "validUntil": "2024-06-15",
        "totalAmount": 125000,
        "status": "pending",
        "items": [
          {
            "description": "Shimla Package (5 Days)",
            "quantity": 2,
            "unitPrice": 25000,
            "amount": 50000
          }
        ],
        "terms": "50% advance payment required...",
        "createdAt": "2024-05-20T10:30:00Z"
      }
    ]
  }
}
```

### Create Quotation (Admin Only)
**POST** `/quotations`

Create a new quotation.

**Authentication:** Admin role required

**Request Body:**
```json
{
  "customerId": "CUST001",
  "validUntil": "2024-06-15",
  "items": [
    {
      "description": "Shimla Package (5 Days)",
      "quantity": 2,
      "unitPrice": 25000,
      "amount": 50000,
      "notes": "Including breakfast"
    }
  ],
  "terms": "50% advance payment required to confirm booking...",
  "notes": "Special discount applied"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "QT002",
    "customerId": "CUST001",
    "totalAmount": 50000,
    "status": "pending",
    "createdAt": "2024-05-20T10:30:00Z"
  }
}
```

---

## Invoices

### Get User Invoices
**GET** `/invoices`

Retrieve invoices for the authenticated user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "INV001",
        "invoiceNumber": "ALI240501001",
        "bookingId": "BK1001",
        "packageName": "Shimla Winter Wonderland",
        "amount": 47618,
        "gstAmount": 2380,
        "totalAmount": 49998,
        "gstRate": 5,
        "invoiceDate": "2024-05-01",
        "status": "generated",
        "downloadUrl": "/invoices/INV001/download"
      }
    ]
  }
}
```

### Download Invoice PDF
**GET** `/invoices/{id}/download`

Download invoice as PDF.

**Response (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="Invoice-ALI240501001.pdf"`

---

## Reviews

### Get Package Reviews
**GET** `/packages/{packageId}/reviews`

Get approved reviews for a specific package.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "REV001",
        "userId": "user_123",
        "userName": "John Doe",
        "packageId": "shimla-explorer",
        "packageName": "Shimla Winter Wonderland",
        "rating": 5,
        "title": "Amazing Experience!",
        "comment": "Had a wonderful time in Shimla...",
        "isVerified": true,
        "status": "approved",
        "createdAt": "2024-05-15T10:30:00Z"
      }
    ],
    "averageRating": 4.8,
    "totalReviews": 89
  }
}
```

### Submit Review
**POST** `/reviews`

Submit a new review.

**Request Body:**
```json
{
  "packageId": "shimla-explorer",
  "rating": 5,
  "title": "Amazing Experience!",
  "comment": "Had a wonderful time in Shimla. The itinerary was perfect and the guide was very knowledgeable."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "REV002",
    "status": "pending",
    "message": "Review submitted successfully and is pending approval"
  }
}
```

---

## Slideshow

### Get Active Slides
**GET** `/slideshow`

Get all active slideshow slides.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": "slide-1",
        "title": "Discover Paradise in Andaman",
        "subtitle": "Exclusive Island Adventures",
        "description": "Experience pristine beaches...",
        "image": "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
        "buttonText": "Explore Packages",
        "buttonLink": "/packages",
        "type": "package",
        "order": 1,
        "isActive": true
      }
    ]
  }
}
```

---

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour
- **Admin users**: 5000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1621234567
```

## Webhooks

### Booking Status Updates

When a booking status changes, a webhook is sent to registered endpoints.

**Webhook Payload:**
```json
{
  "event": "booking.status_changed",
  "data": {
    "bookingId": "BK1001",
    "oldStatus": "pending",
    "newStatus": "confirmed",
    "timestamp": "2024-05-20T10:30:00Z"
  }
}
```

## SDK Examples

### JavaScript/Node.js

```javascript
const AliToursAPI = require('@ali-tours/api-client');

const client = new AliToursAPI({
  baseURL: 'https://api.alitourstravels.in/v1',
  apiKey: 'your-api-key'
});

// Get all packages
const packages = await client.packages.getAll({
  destination: 'Shimla',
  page: 1,
  limit: 10
});

// Create a booking
const booking = await client.bookings.create({
  packageId: 'shimla-explorer',
  travelDate: '2024-06-15',
  guests: 2
});
```

### Python

```python
from ali_tours_api import AliToursClient

client = AliToursClient(
    base_url='https://api.alitourstravels.in/v1',
    api_key='your-api-key'
)

# Get all packages
packages = client.packages.get_all(
    destination='Shimla',
    page=1,
    limit=10
)

# Create a booking
booking = client.bookings.create({
    'packageId': 'shimla-explorer',
    'travelDate': '2024-06-15',
    'guests': 2
})
```

## Testing

### Postman Collection

Import our Postman collection for easy API testing:
[Download Postman Collection](./postman/Ali-Tours-API.postman_collection.json)

### Test Environment

Use our test environment for development:
```
Base URL: https://api-test.alitourstravels.in/v1
Test API Key: test_key_123456789
```

## Changelog

### Version 1.0.0 (2024-05-20)
- Initial API release
- Authentication endpoints
- Tour packages CRUD
- Booking management
- Customer management
- Quotation system
- Invoice generation
- Review system
- Slideshow management

---

*For support or questions about the API, contact: dev@alitourstravels.in*