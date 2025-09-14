import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface AddressMapPreviewProps {
  address: string;
  apiKey: string;
  height?: string;
}

const AddressMapPreview: React.FC<AddressMapPreviewProps> = ({
  address,
  apiKey,
  height = '200px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!address || !apiKey) return;

    const geocodeAddress = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        if (!(window as any).google || !(window as any).google.maps) {
          throw new Error('Google Maps not loaded');
        }

        const geocoder = new (window as any).google.maps.Geocoder();
        
        geocoder.geocode({ address: address }, (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            setCoordinates({ lat, lng });
            updateMap(lat, lng);
            setIsLoading(false);
          } else {
            console.error('Geocoding failed:', status);
            setHasError(true);
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error geocoding address:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    const updateMap = (lat: number, lng: number) => {
      if (!mapRef.current) return;

      // Create or update map
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
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
      } else {
        mapInstanceRef.current.setCenter({ lat, lng });
      }

      // Clear existing markers
      if (mapInstanceRef.current.markers) {
        mapInstanceRef.current.markers.forEach((marker: any) => marker.setMap(null));
      }

      // Add new marker
      const marker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: address,
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          fillColor: '#4CAF50',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          scale: 12
        }
      });

      // Store markers for cleanup
      if (!mapInstanceRef.current.markers) {
        mapInstanceRef.current.markers = [];
      }
      mapInstanceRef.current.markers.push(marker);

      // Add info window
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 4px 0; color: #333; font-size: 14px;">${address}</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">Location confirmed</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });
    };

    const loadGoogleMaps = () => {
      if ((window as any).google && (window as any).google.maps) {
        geocodeAddress();
        return;
      }

      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          geocodeAddress();
        });
        return;
      }

      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setTimeout(() => {
          geocodeAddress();
        }, 100);
      };
      
      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [address, apiKey]);

  if (!address) {
    return (
      <Box sx={{ 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        border: '2px dashed #ddd'
      }}>
        <Typography variant="body2" color="text.secondary">
          Enter an address to see location preview
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height }}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f0f0f0'
        }}
      />
      
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2">Finding location...</Typography>
        </Box>
      )}
      
      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            color: '#d32f2f'
          }}
        >
          <Typography variant="body2">
            Could not find location
          </Typography>
          <Typography variant="caption" display="block">
            Please check the address
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AddressMapPreview;
