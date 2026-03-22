import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, Car, Train, Bike, User } from 'lucide-react';

interface LocationMapProps {
  className?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const commutesRef = useRef<any>(null);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');

    if (!window.google && !existingScript) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'}&callback=initCommutesMap&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      // Define the callback function globally
      (window as any).initCommutesMap = initializeCommutesWidget;

      document.head.appendChild(script);
    } else if (window.google) {
      initializeCommutesWidget();
    } else if (existingScript) {
      // Script is loading, wait for it
      (window as any).initCommutesMap = initializeCommutesWidget;
    }

    return () => {
      // Cleanup
      if (commutesRef.current) {
        commutesRef.current = null;
      }
    };
  }, []);

  const initializeCommutesWidget = () => {
    if (!mapRef.current || !window.google) return;

    const CONFIGURATION = {
      defaultTravelMode: "DRIVING",
      distanceMeasurementType: "METRIC",
      mapOptions: {
        center: { lat: 22.0825943, lng: 82.15543269999999 }, // Ali Tours & Travels location
        fullscreenControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        zoom: 16,
        zoomControl: true,
        maxZoom: 20,
        mapId: ""
      }
    };

    // Initialize the commutes widget
    commutesRef.current = new (window as any).Commutes(CONFIGURATION);
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center">
          <MapPin size={24} className="mr-3" />
          <div>
            <h3 className="text-lg font-semibold">Find Us & Plan Your Visit</h3>
            <p className="text-primary-100 text-sm">Calculate travel time to our office</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapRef}
          className="commutes"
          style={{ height: '400px', width: '100%' }}
        >
          <div className="commutes-map" aria-label="Map">
            <div className="map-view" style={{ backgroundColor: '#e5e3df', height: '100%' }}></div>
          </div>

          <div className="commutes-info">
            <div className="commutes-initial-state" style={{
              borderRadius: '8px',
              border: '1px solid #dadce0',
              display: 'flex',
              height: '98px',
              marginTop: '8px',
              padding: '0 16px',
              alignItems: 'center'
            }}>
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mr-4">
                <Navigation size={24} className="text-primary-600" />
              </div>
              <div className="flex-grow px-4">
                <h4 className="text-lg font-semibold mb-1">Estimate Travel Time</h4>
                <p className="text-sm text-gray-600">See travel time and directions to our office</p>
              </div>
              <button className="add-button bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
                <Navigation size={16} className="mr-2" />
                <span>Add Your Location</span>
              </button>
            </div>

            <div className="commutes-destinations" style={{ display: 'none' }}>
              <div className="destinations-container" style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '8px',
                whiteSpace: 'nowrap',
                width: '100%'
              }}>
                <div className="destination-list" style={{ display: 'flex', flexGrow: 1 }}></div>
                <button className="add-button bg-blue-50 border border-blue-200 text-blue-600 rounded-lg p-4 flex flex-col items-center justify-center min-w-40 hover:bg-blue-100 transition-colors">
                  <Navigation size={20} className="mb-2" />
                  <div className="text-sm font-medium">Add Location</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Mode Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
          <h5 className="text-sm font-semibold mb-2">Travel Modes</h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <Car size={14} className="mr-2 text-blue-600" />
              <span>Driving</span>
            </div>
            <div className="flex items-center">
              <Train size={14} className="mr-2 text-green-600" />
              <span>Public Transit</span>
            </div>
            <div className="flex items-center">
              <Bike size={14} className="mr-2 text-orange-600" />
              <span>Cycling</span>
            </div>
            <div className="flex items-center">
              <User size={14} className="mr-2 text-purple-600" />
              <span>Walking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Office Information */}
      <div className="p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <MapPin size={16} className="mr-2 text-primary-600" />
              Our Office Location
            </h4>
            <p className="text-sm text-gray-600">
              Bohra Complex, Shop No. 3<br />
              Near Hirazy Sales, Jwali Poll<br />
              Telipara Road, Bilaspur<br />
              Chhattisgarh - 495001, India
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Clock size={16} className="mr-2 text-primary-600" />
              Business Hours
            </h4>
            <div className="text-sm text-gray-600">
              <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
              <p>Sunday: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Click "Add Your Location" above to calculate travel time and get directions to our office
          </p>
        </div>
      </div>
      </div>

      {/* Modal for adding destinations */}
      <div className="commutes-modal-container fixed inset-0 bg-black bg-opacity-40 hidden items-center justify-center z-50">
      <div className="commutes-modal bg-white rounded-lg shadow-xl w-96 max-w-[90vw]">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Add Your Location</h3>
          
          <form id="destination-form" className="space-y-4">
            <div>
              <input
                type="text"
                id="destination-address-input"
                name="destination-address"
                placeholder="Enter your location or address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                autoComplete="off"
                required
              />
              <div className="error-message text-red-600 text-sm mt-1" role="alert"></div>
            </div>

            {/* Travel Mode Selection */}
            <div>
              <p className="text-sm font-medium mb-3">Select travel mode:</p>
              <div className="travel-modes grid grid-cols-4 gap-1">
                <input type="radio" name="travel-mode" id="driving-mode" value="DRIVING" className="sr-only" />
                <label htmlFor="driving-mode" className="flex flex-col items-center p-3 border border-gray-300 rounded-l-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Car size={20} className="mb-1" />
                  <span className="text-xs">Drive</span>
                </label>

                <input type="radio" name="travel-mode" id="transit-mode" value="TRANSIT" className="sr-only" />
                <label htmlFor="transit-mode" className="flex flex-col items-center p-3 border-t border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Train size={20} className="mb-1" />
                  <span className="text-xs">Transit</span>
                </label>

                <input type="radio" name="travel-mode" id="bicycling-mode" value="BICYCLING" className="sr-only" />
                <label htmlFor="bicycling-mode" className="flex flex-col items-center p-3 border-t border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                  <Bike size={20} className="mb-1" />
                  <span className="text-xs">Bike</span>
                </label>

                <input type="radio" name="travel-mode" id="walking-mode" value="WALKING" className="sr-only" />
                <label htmlFor="walking-mode" className="flex flex-col items-center p-3 border border-gray-300 rounded-r-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <User size={20} className="mb-1" />
                  <span className="text-xs">Walk</span>
                </label>
              </div>
            </div>
          </form>

          <div className="flex justify-between items-center mt-6">
            <button className="delete-destination-button text-red-600 hover:text-red-800 text-sm font-medium hidden">
              Delete
            </button>
            <div className="flex space-x-3">
              <button className="cancel-button px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                Cancel
              </button>
              <button className="add-destination-button bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium">
                Add Location
              </button>
              <button className="edit-destination-button bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium hidden">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

// Define the Commutes class globally for the Google Maps callback
declare global {
  interface Window {
    google: any;
    initCommutesMap: () => void;
  }
}

// Commutes widget class
class CommutesWidget {
  private map: any;
  private destinations: any[] = [];
  private activeDestinationIndex?: number;
  private origin: { lat: number; lng: number };
  private markerIndex = 0;

  constructor(configuration: any) {
    this.origin = configuration.mapOptions.center;
    this.initializeMap(configuration);
    this.initializeEventListeners();
  }

  private initializeMap(configuration: any) {
    const mapElement = document.querySelector('.map-view');
    if (!mapElement) return;

    this.map = new window.google.maps.Map(mapElement, configuration.mapOptions);
    
    // Add origin marker
    new window.google.maps.Marker({
      position: this.origin,
      map: this.map,
      title: 'Ali Tours & Travels Office',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#EA4335',
        fillOpacity: 1,
        strokeColor: '#C5221F',
        strokeWeight: 2
      }
    });
  }

  private initializeEventListeners() {
    const addButtons = document.querySelectorAll('.add-button');
    const modal = document.querySelector('.commutes-modal-container');
    const cancelButton = document.querySelector('.cancel-button');
    const addDestinationButton = document.querySelector('.add-destination-button');

    addButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.showModal();
      });
    });

    cancelButton?.addEventListener('click', () => {
      this.hideModal();
    });

    addDestinationButton?.addEventListener('click', () => {
      this.addDestination();
    });

    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideModal();
      }
    });
  }

  private showModal() {
    const modal = document.querySelector('.commutes-modal-container');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      
      // Focus on input
      const input = document.getElementById('destination-address-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }

      // Set default travel mode
      const drivingMode = document.getElementById('driving-mode') as HTMLInputElement;
      if (drivingMode) {
        drivingMode.checked = true;
      }
    }
  }

  private hideModal() {
    const modal = document.querySelector('.commutes-modal-container');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      
      // Reset form
      const form = document.getElementById('destination-form') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }
  }

  private addDestination() {
    const input = document.getElementById('destination-address-input') as HTMLInputElement;
    const travelModeInput = document.querySelector('input[name="travel-mode"]:checked') as HTMLInputElement;
    
    if (!input.value.trim()) {
      this.showError('Please enter a destination');
      return;
    }

    // In a real implementation, you would use Google Places API to geocode the address
    // For now, we'll show a success message
    alert(`Travel time calculation would be implemented here for: ${input.value} via ${travelModeInput?.value || 'driving'}`);
    this.hideModal();
  }

  private showError(message: string) {
    const errorElement = document.querySelector('.error-message');
    const input = document.getElementById('destination-address-input');
    
    if (errorElement) {
      errorElement.textContent = message;
    }
    if (input) {
      input.classList.add('border-red-500');
    }
  }
}

export default LocationMap;