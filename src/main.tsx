import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { QuotationProvider } from './contexts/QuotationContext.tsx';
import { LocationProvider } from './contexts/LocationContext.tsx';
import { PackageProvider } from './contexts/PackageContext.tsx';
import { BookingProvider } from './contexts/BookingContext.tsx';
import { ReviewProvider } from './contexts/ReviewContext.tsx';
import { SlideshowProvider } from './contexts/SlideshowContext.tsx';
import { InvoiceProvider } from './contexts/InvoiceContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <InvoiceProvider>
        <SlideshowProvider>
          <QuotationProvider>
            <LocationProvider>
              <PackageProvider>
                <BookingProvider>
                  <ReviewProvider>
                    <App />
                  </ReviewProvider>
                </BookingProvider>
              </PackageProvider>
            </LocationProvider>
          </QuotationProvider>
        </SlideshowProvider>
      </InvoiceProvider>
    </AuthProvider>
  </StrictMode>
);