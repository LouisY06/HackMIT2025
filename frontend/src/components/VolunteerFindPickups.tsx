import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { 
  ArrowBack, 
  FilterList, 
  LocationOn, 
  Person,
  Logout 
} from '@mui/icons-material';
import { Package, Leaf, Timer } from 'lucide-react';
import GoogleMapsComponent from './GoogleMapsComponent';
import { auth } from '../config/firebase';
// Removed PinEntryModal import - now using direct assignment
import { API_BASE_URL, API_ENDPOINTS, apiCall } from '../config/api';

const VolunteerFindPickups: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [foodType, setFoodType] = useState('All Types');
  const [maxDistance, setMaxDistance] = useState('Any Distance');
  const [sortBy, setSortBy] = useState('Distance');
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  // Removed PIN modal states - now using direct assignment for accepting missions

  // Function to calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Function to get user's current location
  const getUserLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Could not get location:', error);
          // Default to Cambridge, MA if location access is denied
          resolve({
            lat: 42.3601,
            lng: -71.0589
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Fetch packages from API
  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Get user's location first
        const location = await getUserLocation();
        setUserLocation(location);

        const response = await fetch(`${API_BASE_URL}/api/packages/available`);
        const data = await response.json();
        
        
        if (data.success) {
          // Convert package data to pickup format for display with real distance calculation
          const packagePickups = data.packages.map((pkg: any, index: number) => {
            let distance = 0;
            let distanceText = "Distance unknown";
            
            // Only calculate distance if we have store location data
            if (pkg.store_lat && pkg.store_lng) {
              distance = calculateDistance(location.lat, location.lng, pkg.store_lat, pkg.store_lng);
              distanceText = `${distance.toFixed(1)} mi`;
            }
            
            // Format time window
            const timeWindow = `${pkg.pickup_window_start} - ${pkg.pickup_window_end}`;
            
            // Calculate points based on weight (heavier packages = more points)
            const points = Math.floor(pkg.weight_lbs * 5) + 50;
            
            // Calculate CO2 saved (rough estimate: 1 lb food = 0.5 lbs CO2)
            const co2Saved = (pkg.weight_lbs * 0.5).toFixed(1);
            
            return {
              id: pkg.id,
              storeName: pkg.store_name,
              storeInitial: pkg.store_name.charAt(0).toUpperCase(),
              points: points,
              distance: distanceText,
              timeWindow: timeWindow,
              foodType: pkg.food_type,
              instruction: pkg.special_instructions || "Handle with care",
              weight: `${pkg.weight_lbs} lbs`,
              duration: "~30 min",
              co2Saved: `${co2Saved} lbs CO₂e saved`,
              destination: "Cambridge Food Bank",
              destinationAddress: "1234 Main St, Cambridge, MA",
              expiresSoon: Math.random() > 0.7, // 30% chance of expiring soon
              timeLeft: Math.random() > 0.7 ? "Expires soon" : "2h left",
              lat: pkg.store_lat,
              lng: pkg.store_lng,
              address: pkg.store_address,
              distanceValue: distance, // Store raw distance value for sorting
              packageId: pkg.id,
              qrCodeData: pkg.qr_code_data
            };
          });
          
          // Sort packages by distance (only those with location data first)
          packagePickups.sort((a: any, b: any) => {
            if (a.distanceValue === 0 && b.distanceValue > 0) return 1;
            if (a.distanceValue > 0 && b.distanceValue === 0) return -1;
            return a.distanceValue - b.distanceValue;
          });
          
          setStores(packagePickups);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Fallback to mock data if API fails
        setStores([
          {
            id: 1,
            storeName: "Flour Bakery",
            storeInitial: "F",
            points: 104,
            distance: "0.9 mi",
            timeWindow: "2:00 PM - 6:00 PM",
            foodType: "Pastries & Bread",
            instruction: "Handle with care - contains delicate pastries",
            weight: "5.2 lbs",
            duration: "~30 min",
            co2Saved: "2.3 lbs CO₂e saved",
            destination: "Cambridge Food Bank",
            destinationAddress: "1234 Main St, Cambridge, MA",
            expiresSoon: true,
            timeLeft: "Expires soon",
            lat: 42.3601,
            lng: -71.0589
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Use stores state instead of hardcoded data
  const availablePickups = stores;

  // Convert pickup data for Google Maps component
  const mapPickups = availablePickups
    .filter(pickup => pickup.lat && pickup.lng) // Only include packages with location data
    .map(pickup => ({
      id: pickup.id.toString(),
      storeName: pickup.storeName,
      lat: pickup.lat,
      lng: pickup.lng,
      foodType: pickup.foodType,
      weight: pickup.weight,
      timeWindow: pickup.timeWindow
    }));

  const handleAcceptMission = async (pickupId: number, storeName?: string) => {
    // Get current user from Firebase Auth
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to accept missions');
      return;
    }

    try {
      // Directly assign the package to the volunteer
      const result = await apiCall(API_ENDPOINTS.ASSIGN_PACKAGE(pickupId), {
        method: 'POST',
        body: JSON.stringify({ volunteer_id: user.uid })
      });

      if (result.success) {
        alert(`🎯 Mission accepted! Package ${pickupId} has been added to your tasks.`);
        // Refresh the packages list to remove this package from available list
        window.location.reload();
      } else {
        alert(`Failed to accept mission: ${result.error}`);
      }
    } catch (error) {
      console.error('Error accepting mission:', error);
      alert('Network error. Please try again.');
    }
  };

  // Removed PIN verification handlers - now using direct assignment

  const handleViewDetails = (pickupId: number) => {
    console.log(`Viewing details for mission ${pickupId}`);
    // Navigate to detailed mission view
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header/Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar sx={{ 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 0 },
          py: { xs: 1, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: { sm: 4 } }}>
            <img 
              src="/LogoOutlined.png" 
              alt="Reflourish Logo" 
              style={{ 
                height: '48px', 
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            flex: 1,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/dashboard')}
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Find Tasks
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/rewards')}
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Rewards
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/leaderboard')}
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Leaderboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/global-impact')}
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Global Impact
            </Button>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: 'row', sm: 'row' }
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'white',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Marcus Chen Level 3
            </Typography>
            <Chip 
              label="1250 pts" 
              sx={{ 
                backgroundColor: '#FFF9C4', 
                color: '#F57F17',
                fontWeight: 'bold',
                fontSize: { xs: '0.7rem', sm: '0.8125rem' }
              }} 
            />
            <IconButton onClick={handleLogout} color="inherit" size="small">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1,
        minHeight: 0,
        flexDirection: { xs: 'column', lg: 'row' }
      }}>
        {/* Left Sidebar - Filters and Map */}
        <Box sx={{ 
          width: { xs: '100%', lg: '350px' }, 
          backgroundColor: 'white', 
          p: { xs: 2, sm: 3 }, 
          borderRight: { lg: '1px solid #e0e0e0' },
          borderBottom: { xs: '1px solid #e0e0e0', lg: 'none' },
          maxHeight: { xs: '50vh', lg: 'auto' },
          overflowY: { xs: 'auto', lg: 'visible' }
        }}>
          {/* Filters Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterList sx={{ mr: 1, color: '#4CAF50' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Filters
              </Typography>
            </Box>

            <TextField
              fullWidth
              placeholder="🔍 Store or food type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr' },
              gap: 2,
              mb: 2
            }}>
              <FormControl fullWidth>
                <InputLabel>Food Type</InputLabel>
                <Select
                  value={foodType}
                  label="Food Type"
                  onChange={(e) => setFoodType(e.target.value)}
                  size="small"
                >
                  <MenuItem value="All Types">All Types</MenuItem>
                  <MenuItem value="Pastries & Bread">Pastries & Bread</MenuItem>
                  <MenuItem value="Prepared Meals">Prepared Meals</MenuItem>
                  <MenuItem value="Produce">Produce</MenuItem>
                  <MenuItem value="Dairy">Dairy</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Max Distance</InputLabel>
                <Select
                  value={maxDistance}
                  label="Max Distance"
                  onChange={(e) => setMaxDistance(e.target.value)}
                  size="small"
                >
                  <MenuItem value="Any Distance">Any Distance</MenuItem>
                  <MenuItem value="1 mile">1 mile</MenuItem>
                  <MenuItem value="3 miles">3 miles</MenuItem>
                  <MenuItem value="5 miles">5 miles</MenuItem>
                  <MenuItem value="10 miles">10 miles</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
              >
                <MenuItem value="Distance">Distance</MenuItem>
                <MenuItem value="Points">Points</MenuItem>
                <MenuItem value="Time">Time</MenuItem>
                <MenuItem value="Weight">Weight</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Location Info */}
          {userLocation && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: '#4CAF50', fontSize: '1.2rem' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  Your Location
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                Distances calculated from your current location
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </Typography>
            </Box>
          )}

          {/* Map View Section - Hidden on mobile to save space */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: '#4CAF50' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Map View
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 1
              }}>
                <Typography>Loading packages...</Typography>
              </Box>
            ) : (
              <GoogleMapsComponent
                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
                center={userLocation || { lat: 42.3601, lng: -71.0589 }}
                zoom={13}
                pickups={mapPickups}
                height="300px"
                userLocation={userLocation || undefined}
              />
            )}
          </Box>
        </Box>

        {/* Right Main Content - Available Pickups */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Fixed Header */}
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: 0, flexShrink: 0 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.3rem', sm: '1.5rem' }
            }}>
              {availablePickups.length} Packages Available
            </Typography>
          </Box>

          {/* Scrollable Content */}
          <Box sx={{ 
            flex: 1,
            p: { xs: 2, sm: 3 },
            pt: 1,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: '#a8a8a8',
              },
            },
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
            {availablePickups.map((pickup) => (
              <Card key={pickup.id} sx={{ boxShadow: 2 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    {/* Store Avatar and Header Info */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Avatar sx={{ backgroundColor: '#2196F3', width: 48, height: 48 }}>
                        {pickup.storeInitial}
                      </Avatar>
                      <Box sx={{ flex: { xs: 1, sm: 'none' } }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                          {pickup.storeName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pickup.distance} • {pickup.timeWindow}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`+${pickup.points} points`}
                        sx={{ 
                          backgroundColor: '#4CAF50', 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                        }}
                      />
                    </Box>

                    {/* Main Content */}
                    <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip label={pickup.foodType} size="small" variant="outlined" />
                      </Box>

                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                        {pickup.instruction}
                      </Typography>

                      {/* Metrics */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 2, sm: 3 }, 
                        mb: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          <Package size={16} style={{ marginRight: '4px' }} /> {pickup.weight}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Timer size={16} style={{ marginRight: '4px' }} /> {pickup.duration}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <Leaf size={16} style={{ marginRight: '4px' }} /> {pickup.co2Saved}
                        </Typography>
                      </Box>

                      {/* Delivery Destination */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          Delivery destination
                        </Typography>
                        <Typography variant="body2">
                          {pickup.destination}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pickup.destinationAddress}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'row' }
                      }}>
                        <Button
                          variant="contained"
                          fullWidth={window.innerWidth < 600}
                          sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': { backgroundColor: '#388E3C' }
                          }}
                          onClick={() => handleAcceptMission(pickup.id, pickup.storeName)}
                        >
                          Accept Mission
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth={window.innerWidth < 600}
                          onClick={() => handleViewDetails(pickup.id)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* PIN Entry Modal removed - now using direct assignment */}
    </Box>
  );
};

export default VolunteerFindPickups;
