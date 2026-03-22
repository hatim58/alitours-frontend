# Ali Tours & Travels Documentation

Welcome to the comprehensive documentation for Ali Tours & Travels travel management system.

## 📚 Documentation Structure

### API Documentation
- **[API Overview](./api/README.md)** - Complete API reference
- **[Authentication](./api/authentication.md)** - Auth endpoints and security
- **[Tour Packages](./api/packages.md)** - Package management API
- **[Bookings](./api/bookings.md)** - Booking system API
- **[OpenAPI Specification](./api/openapi.yaml)** - Machine-readable API spec
- **[Tools & Setup](./api/tools-and-setup.md)** - Documentation tools guide

### Code Examples
- **[JavaScript SDK](./api/examples/javascript-sdk.md)** - Frontend integration examples
- **[Postman Collection](./api/postman/)** - Ready-to-use API testing

### Guides
- **[Getting Started](#getting-started)** - Quick start guide
- **[Development Setup](#development-setup)** - Local development
- **[Deployment](#deployment)** - Production deployment

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/ali-tours/website.git
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Demo Accounts

**Admin Account:**
- Email: `info@alitourstravels.in`
- Password: `Yaalimadad@53`

**User Account:**
- Email: `user@example.com`
- Password: `password123`

## 🏗️ Development Setup

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Payment Gateway
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_MERCHANT_NAME=Ali Tours & Travels

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Database Setup

1. **Connect to Supabase**
   - Click "Connect to Supabase" in the top right
   - Follow the setup wizard

2. **Run Migrations**
   ```bash
   # Migrations are automatically applied
   # Check supabase/migrations/ for SQL files
   ```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🏛️ Architecture Overview

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── management/     # Business logic components
├── contexts/           # React context providers
├── pages/              # Page components
│   ├── admin/         # Admin panel pages
│   └── ...            # Public pages
├── layouts/           # Layout components
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── data/              # Static data and mock data
```

### Key Technologies

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router Dom
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Build Tool**: Vite

### State Management

- **Authentication**: React Context (`AuthContext`)
- **Packages**: React Context (`PackageContext`)
- **Bookings**: React Context (`BookingContext`)
- **Reviews**: React Context (`ReviewContext`)
- **Invoices**: React Context (`InvoiceContext`)

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password requirements
- Session management

### Data Protection
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API communication

### Privacy Compliance
- GDPR-compliant data handling
- Privacy policy implementation
- User consent management
- Data retention policies

## 📱 Features Overview

### Customer Features
- **Package Browsing**: Search and filter tour packages
- **Booking System**: Multiple booking methods (Payment/WhatsApp/Email)
- **User Dashboard**: Manage bookings and profile
- **Invoice Downloads**: PDF invoice generation
- **Review System**: Submit and view reviews
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of business metrics
- **Package Management**: CRUD operations for tour packages
- **Booking Management**: Track and manage all bookings
- **Customer Management**: Customer database and analytics
- **Invoice System**: GST-compliant invoice generation
- **Quotation System**: Create and manage quotations
- **Review Moderation**: Approve/reject customer reviews
- **Slideshow Management**: Homepage banner management

### Business Features
- **GST Compliance**: Proper tax invoice generation
- **Payment Integration**: Razorpay payment gateway
- **WhatsApp Integration**: Direct customer communication
- **PDF Generation**: Invoices, quotations, reports
- **Excel Export**: Data export capabilities
- **Multi-channel Booking**: Payment, WhatsApp, Email options

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# The build files will be in the 'dist' directory
```

### Hosting Options

1. **Netlify** (Recommended)
   - Automatic deployments from Git
   - Custom domain support
   - Form handling
   - Serverless functions

2. **Vercel**
   - Excellent performance
   - Easy Git integration
   - Automatic HTTPS

3. **Traditional Web Hosting**
   - Upload `dist` folder contents
   - Configure server for SPA routing

### Environment Setup

**Production Environment Variables:**
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_RAZORPAY_KEY_ID=your_production_razorpay_key
VITE_API_BASE_URL=https://api.alitourstravels.in/v1
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── components/         # Component tests
├── pages/             # Page tests
├── contexts/          # Context tests
├── utils/             # Utility function tests
└── integration/       # Integration tests
```

## 📊 Monitoring and Analytics

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Error rate tracking
- User journey analytics

### Business Metrics
- Booking conversion rates
- Popular packages tracking
- Customer satisfaction scores
- Revenue analytics

## 🔧 Maintenance

### Regular Tasks
- **Security Updates**: Keep dependencies updated
- **Performance Monitoring**: Track Core Web Vitals
- **Content Updates**: Update package information
- **Backup Management**: Regular data backups

### Troubleshooting

**Common Issues:**

1. **Build Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Type Errors**
   ```bash
   # Run type checking
   npx tsc --noEmit
   ```

3. **Styling Issues**
   ```bash
   # Rebuild Tailwind
   npm run build:css
   ```

## 📞 Support

### Contact Information
- **Email**: dev@alitourstravels.in
- **Phone**: +91 78691-47222
- **Business Hours**: Monday-Saturday, 9 AM - 7 PM

### Development Team
- **CodeHaven Software**
- **Hatim Husain**: +91 62658-11158
- **Yusuf Patnawala**: +91 78691-47222

### Resources
- **GitHub Repository**: [Link to repository]
- **Live Demo**: https://fluffy-malabi-ded2a3.netlify.app
- **API Documentation**: [Link to API docs]
- **Design System**: [Link to design guide]

---

*This documentation is maintained by the Ali Tours & Travels development team. Last updated: May 2024*