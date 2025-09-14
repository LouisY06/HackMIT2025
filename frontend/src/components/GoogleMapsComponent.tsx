import React, { useEffect, useRef } from 'react';
// import { Package, Clock } from 'lucide-react'; // Unused imports

interface Pickup {
  id: string;
  storeName: string;
  lat: number;
  lng: number;
  foodType?: string;
  weight?: string;
  timeWindow?: string;
  onAcceptMission?: (id: string, storeName: string) => void;
}

interface GoogleMapsComponentProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  pickups?: Pickup[];
  height?: string;
  userLocation?: { lat: number; lng: number };
  onAcceptMission?: (id: string, storeName: string) => void;
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
  apiKey,
  center = { lat: 42.3601, lng: -71.0589 },
  zoom = 13,
  pickups = [],
  height = '300px',
  userLocation,
  onAcceptMission
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    console.log('GoogleMapsComponent: API Key received:', apiKey ? 'Yes' : 'No');
    console.log('GoogleMapsComponent: API Key value:', apiKey);
    
    const initMap = () => {
      if (!mapRef.current) {
        console.log('GoogleMapsComponent: No map ref');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      if (!(window as any).google || !(window as any).google.maps) {
        console.log('GoogleMapsComponent: Google Maps not loaded');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        styles: [
          {
            "elementType": "labels.text",
            "stylers": [{ "visibility": "off" }]
          },
          {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#f5f5f2" }, { "visibility": "on" }]
          },
          {
            "featureType": "water",
            "stylers": [{ "color": "#a0d3d3" }]
          },
          {
            "featureType": "road",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "poi.park",
            "stylers": [{ "color": "#91b65d" }]
          }
        ],
        // Disable all UI controls
        mapTypeControl: false,           // Removes Map/Satellite buttons
        streetViewControl: false,        // Removes Pegman (Street View)
        fullscreenControl: false,        // Removes fullscreen button
        zoomControl: false,              // Removes zoom +/- buttons
        rotateControl: false,            // Removes rotate control
        scaleControl: false,             // Removes scale control
        panControl: false,               // Removes pan control
        gestureHandling: 'cooperative',  // Requires Ctrl+scroll for zoom
        disableDefaultUI: true           // Disables all default UI (including branding where possible)
      });

      mapInstanceRef.current = map;

      // Add markers for pickups
      pickups.forEach(pickup => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: pickup.lat, lng: pickup.lng },
          map: map,
          title: pickup.storeName,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 12
          }
        });

        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 220px;">
              <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${pickup.storeName}</h3>
              ${pickup.foodType ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">${pickup.foodType}</p>` : ''}
              ${pickup.weight ? `<p style="margin: 2px 0; color: #666; font-size: 14px; display: flex; align-items: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>${pickup.weight}</p>` : ''}
              ${pickup.timeWindow ? `<p style="margin: 2px 0 8px 0; color: #666; font-size: 14px; display: flex; align-items: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>${pickup.timeWindow}</p>` : ''}
              ${onAcceptMission ? `<button 
                id="accept-mission-${pickup.id}" 
                style="
                  background: linear-gradient(135deg, #848D58 0%, #6F7549 100%);
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: 600;
                  cursor: pointer;
                  width: 100%;
                  margin-top: 4px;
                "
                onmouseover="this.style.background='linear-gradient(135deg, #6F7549 0%, #5A5F3A 100%)'"
                onmouseout="this.style.background='linear-gradient(135deg, #848D58 0%, #6F7549 100%)'"
              >
                🎯 Accept Mission
              </button>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          
          // Add event listener for the Accept Mission button after a short delay
          // to ensure the DOM element exists
          if (onAcceptMission) {
            setTimeout(() => {
              const button = document.getElementById(`accept-mission-${pickup.id}`);
              if (button) {
                button.addEventListener('click', () => {
                  onAcceptMission(pickup.id, pickup.storeName);
                  infoWindow.close();
                });
              }
            }, 100);
          }
        });
      });

      // Add user location marker if provided
      if (userLocation) {
        const userMarker = new (window as any).google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map,
          title: 'Your Location',
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            fillColor: '#2196F3',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 10
          },
          zIndex: 1000 // Ensure user marker appears on top
        });

        const userInfoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 150px;">
              <h3 style="margin: 0 0 4px 0; color: #2196F3;">📍 Your Location</h3>
              <p style="margin: 2px 0; color: #666; font-size: 14px;">Distances calculated from here</p>
            </div>
          `
        });

        userMarker.addListener('click', () => {
          userInfoWindow.open(map, userMarker);
        });
      }

      setIsLoading(false);
      setHasError(false);
    };

    const loadGoogleMaps = () => {
      // Check if already loaded
      if ((window as any).google && (window as any).google.maps) {
        initMap();
        return;
      }
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          initMap();
        });
        return;
      }

      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          initMap();
        }, 100);
      };
      
      script.onerror = () => {
        setIsLoading(false);
        setHasError(true);
      };
      
      document.head.appendChild(script);
    };

    if (apiKey) {
      loadGoogleMaps();
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [apiKey, center, zoom, pickups, userLocation]);

  return (
    <div style={{ width: '100%', height: height, position: 'relative' }}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f0f0f0'
        }}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}
        >
          Loading Google Maps...
        </div>
      )}
      {hasError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            color: '#d32f2f'
          }}
        >
          Failed to load Google Maps<br />
          <small>Check console for details</small>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsComponent;