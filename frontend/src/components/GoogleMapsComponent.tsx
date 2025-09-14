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
<<<<<<< HEAD
            <div style="padding: 12px; max-width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">${pickup.storeName}</h3>
              
              ${pickup.foodType ? `<div style="margin: 4px 0; color: #666; font-size: 14px; display: flex; align-items: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; color: #848D58;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                ${pickup.foodType}
              </div>` : ''}
              
              ${pickup.weight ? `<div style="margin: 4px 0; color: #666; font-size: 14px; display: flex; align-items: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; color: #848D58;"><path d="M20 7h-9a4 4 0 0 1-7 0H1"/></svg>
                ${pickup.weight}
              </div>` : ''}
              
              ${pickup.timeWindow ? `<div style="margin: 4px 0 12px 0; color: #666; font-size: 14px; display: flex; align-items: center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; color: #848D58;"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                ${pickup.timeWindow}
              </div>` : ''}
              
              <!-- Travel Options -->
              <div style="margin: 12px 0; padding: 8px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #848D58;">
                <div style="font-size: 13px; font-weight: 600; color: #848D58; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#848D58" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  Get Directions
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button onclick="window.open('https://maps.google.com/maps?saddr=Current+Location&daddr=${pickup.lat},${pickup.lng}&dirflg=w', '_blank')" 
                    style="background: #4285F4; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 500;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 9h6l-3-3z"/>
                      <path d="m12 6 3 3-3 3"/>
                      <path d="M12 3v18"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Walk
                  </button>
                  <button onclick="window.open('https://maps.google.com/maps?saddr=Current+Location&daddr=${pickup.lat},${pickup.lng}&dirflg=d', '_blank')" 
                    style="background: #34A853; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 500;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10V6c0-2-2-2-2-2H8c0 0-2 0-2 2v4l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                      <circle cx="7" cy="17" r="2"/>
                      <path d="M9 17h6"/>
                      <circle cx="17" cy="17" r="2"/>
                    </svg>
                    Drive
                  </button>
                  <button onclick="window.open('https://maps.google.com/maps?saddr=Current+Location&daddr=${pickup.lat},${pickup.lng}&dirflg=r', '_blank')" 
                    style="background: #EA4335; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-weight: 500;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M8 6v6h8V6"/>
                      <path d="M4 6h16"/>
                      <path d="M4 18h16"/>
                      <path d="M8 18v-6"/>
                      <path d="M16 18v-6"/>
                    </svg>
                    Transit
                  </button>
                </div>
              </div>
              
=======
            <div style="padding: 8px; max-width: 220px;">
              <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${pickup.storeName}</h3>
              ${pickup.foodType ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">${pickup.foodType}</p>` : ''}
              ${pickup.weight ? `<p style="margin: 2px 0; color: #666; font-size: 14px; display: flex; align-items: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>${pickup.weight}</p>` : ''}
              ${pickup.timeWindow ? `<p style="margin: 2px 0 8px 0; color: #666; font-size: 14px; display: flex; align-items: center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>${pickup.timeWindow}</p>` : ''}
>>>>>>> aa69dfee09213b75afcd3830235c17f1c0c86a5b
              ${onAcceptMission ? `<button 
                id="accept-mission-${pickup.id}" 
                style="
                  background: linear-gradient(135deg, #848D58 0%, #6F7549 100%);
                  color: white;
                  border: none;
<<<<<<< HEAD
                  padding: 12px 16px;
                  border-radius: 8px;
=======
                  padding: 8px 16px;
                  border-radius: 6px;
>>>>>>> aa69dfee09213b75afcd3830235c17f1c0c86a5b
                  font-size: 14px;
                  font-weight: 600;
                  cursor: pointer;
                  width: 100%;
<<<<<<< HEAD
                  margin-top: 8px;
                  box-shadow: 0 2px 8px rgba(132, 141, 88, 0.3);
                  transition: all 0.2s ease;
                "
                onmouseover="this.style.background='linear-gradient(135deg, #6F7549 0%, #5A5F3A 100%)'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(132, 141, 88, 0.4)';"
                onmouseout="this.style.background='linear-gradient(135deg, #848D58 0%, #6F7549 100%)'; this.style.transform='translateY(0px)'; this.style.boxShadow='0 2px 8px rgba(132, 141, 88, 0.3)';"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
                Accept Mission
=======
                  margin-top: 4px;
                "
                onmouseover="this.style.background='linear-gradient(135deg, #6F7549 0%, #5A5F3A 100%)'"
                onmouseout="this.style.background='linear-gradient(135deg, #848D58 0%, #6F7549 100%)'"
              >
                🎯 Accept Mission
>>>>>>> aa69dfee09213b75afcd3830235c17f1c0c86a5b
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
        // Create a custom user location marker with pulse animation
        const userMarker = new (window as any).google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: map,
          title: 'Your Current Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="pulse" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style="stop-color:#2196F3;stop-opacity:0.8" />
                    <stop offset="70%" style="stop-color:#2196F3;stop-opacity:0.4" />
                    <stop offset="100%" style="stop-color:#2196F3;stop-opacity:0.1" />
                  </radialGradient>
                </defs>
                <circle cx="16" cy="16" r="15" fill="url(#pulse)" />
                <circle cx="16" cy="16" r="8" fill="#2196F3" stroke="white" stroke-width="3" />
                <circle cx="16" cy="16" r="4" fill="white" />
              </svg>
            `),
            scaledSize: new (window as any).google.maps.Size(32, 32),
            anchor: new (window as any).google.maps.Point(16, 16)
          },
          zIndex: 1000 // Ensure user marker appears on top
        });

        const userInfoWindow = new (window as any).google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; max-width: 200px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 style="margin: 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">Your Location</h3>
              </div>
              <p style="margin: 4px 0; color: #666; font-size: 14px; line-height: 1.4;">All distances and directions are calculated from this point.</p>
              <div style="margin-top: 8px; padding: 6px; background: #e3f2fd; border-radius: 6px; font-size: 12px; color: #1976d2; display: flex; align-items: center; gap: 4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                Tap restaurant markers to see travel options
              </div>
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