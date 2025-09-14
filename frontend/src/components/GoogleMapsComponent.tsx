import React, { useEffect, useRef } from 'react';

interface Pickup {
  id: string;
  storeName: string;
  lat: number;
  lng: number;
  foodType?: string;
  weight?: string;
  timeWindow?: string;
}

interface GoogleMapsComponentProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  pickups?: Pickup[];
  height?: string;
}

const GoogleMapsComponent: React.FC<GoogleMapsComponentProps> = ({
  apiKey,
  center = { lat: 42.3601, lng: -71.0589 },
  zoom = 13,
  pickups = [],
  height = '300px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    console.log('=== GoogleMapsComponent useEffect triggered ===');
    console.log('API Key:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'MISSING');
    console.log('Center:', center);
    console.log('Zoom:', zoom);
    console.log('Pickups:', pickups.length);
    
    const initMap = () => {
      console.log('=== initMap called ===');
      
      if (!mapRef.current) {
        console.error('❌ Map ref not found');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      console.log('✅ Map ref found');
      
      if (!window.google) {
        console.error('❌ Google Maps API not loaded - window.google is undefined');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      console.log('✅ window.google exists');
      
      if (!window.google.maps) {
        console.error('❌ Google Maps API not loaded - window.google.maps is undefined');
        setHasError(true);
        setIsLoading(false);
        return;
      }
      console.log('✅ window.google.maps exists');

      console.log('🗺️ Initializing Google Maps...');
      
      const map = new window.google.maps.Map(mapRef.current, {
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
        ]
      });

      mapInstanceRef.current = map;

      // Add markers for pickups
      pickups.forEach(pickup => {
        const marker = new window.google.maps.Marker({
          position: { lat: pickup.lat, lng: pickup.lng },
          map: map,
          title: pickup.storeName,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 12
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; color: #333;">${pickup.storeName}</h3>
              ${pickup.foodType ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">${pickup.foodType}</p>` : ''}
              ${pickup.weight ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">📦 ${pickup.weight}</p>` : ''}
              ${pickup.timeWindow ? `<p style="margin: 2px 0; color: #666; font-size: 14px;">⏰ ${pickup.timeWindow}</p>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      console.log('Google Maps initialized successfully');
      setIsLoading(false);
      setHasError(false);
    };

    const loadGoogleMaps = () => {
      console.log('=== loadGoogleMaps called ===');
      
      // Check if already loaded
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps already loaded, calling initMap');
        initMap();
        return;
      }
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        console.log('⚠️ Google Maps script already exists, waiting for load...');
        existingScript.addEventListener('load', () => {
          console.log('✅ Existing script loaded');
          initMap();
        });
        return;
      }

      console.log('📡 Loading Google Maps API...');
      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      console.log('Script URL:', scriptUrl);
      
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google Maps API script loaded successfully');
        console.log('window.google:', !!window.google);
        console.log('window.google.maps:', !!(window.google && window.google.maps));
        
        // Small delay to ensure everything is ready
        setTimeout(() => {
          initMap();
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('❌ Error loading Google Maps API script:', error);
        console.error('Script src:', script.src);
        setIsLoading(false);
        setHasError(true);
      };
      
      console.log('📝 Appending script to document head');
      document.head.appendChild(script);
    };

    if (apiKey) {
      console.log('✅ API key provided, calling loadGoogleMaps');
      loadGoogleMaps();
    } else {
      console.error('❌ Google Maps API key is required');
      setHasError(true);
      setIsLoading(false);
    }

    return () => {
      console.log('🧹 GoogleMapsComponent cleanup');
    };
  }, [apiKey, center, zoom, pickups]);

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