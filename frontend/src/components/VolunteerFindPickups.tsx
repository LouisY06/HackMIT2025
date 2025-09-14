import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  IconButton,
} from '@mui/material';
import { 
  ArrowLeft,
  MapPin,
  Search,
  Filter,
  Package,
  Clock,
  Truck,
  Navigation,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
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
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  // Removed PIN modal states - now using direct assignment for accepting missions

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user location
  const getUserLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ lat: 42.3601, lng: -71.0589 }); // Default to Cambridge, MA
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          resolve({ lat: 42.3601, lng: -71.0589 }); // Fallback
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const location = await getUserLocation();
        setUserLocation(location);

        const response = await fetch(`${API_BASE_URL}/api/packages/available`);
        const data = await response.json();
        
        if (data.success) {
          const formattedPackages = data.packages.map((pkg: any) => {
            let distance = "Unknown";
            if (pkg.store_lat && pkg.store_lng) {
              const dist = calculateDistance(location.lat, location.lng, pkg.store_lat, pkg.store_lng);
              distance = `${dist.toFixed(1)} mi`;
            }
            
            return {
              id: pkg.id,
              storeName: pkg.store_name,
              address: pkg.store_address,
              distance,
              foodType: pkg.food_type,
              weight: pkg.weight_lbs,
              points: Math.floor(pkg.weight_lbs * 5) + 50,
              urgency: pkg.urgency || 'medium',
              pickupWindow: {
                start: pkg.pickup_window_start,
                end: pkg.pickup_window_end,
              },
              lat: pkg.store_lat,
              lng: pkg.store_lng,
            };
          });
          
          formattedPackages.sort((a: any, b: any) => {
            const aDist = parseFloat(a.distance);
            const bDist = parseFloat(b.distance);
            if (isNaN(aDist)) return 1;
            if (isNaN(bDist)) return -1;
            return aDist - bDist;
          });
          
          setPackages(formattedPackages);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Fallback data
        setPackages([
          {
            id: 1,
            storeName: "Whole Foods Market",
            address: "123 Main St, Cambridge, MA",
            distance: "0.8 mi",
            foodType: "Mixed Produce",
            weight: 12,
            points: 110,
            urgency: 'high',
            pickupWindow: { start: new Date(), end: new Date(Date.now() + 2 * 60 * 60 * 1000) },
            lat: 42.3601,
            lng: -71.0589,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFoodType = foodType === 'All Types' || pkg.foodType.includes(foodType);
    const matchesDistance = maxDistance === 'Any Distance' || 
                           (parseFloat(pkg.distance) <= parseFloat(maxDistance));
    
    return matchesSearch && matchesFoodType && matchesDistance;
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'Distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'Points':
        return b.points - a.points;
      case 'Urgency':
        const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder];
      default:
        return 0;
    }
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#2196f3';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle size={16} />;
      case 'medium': return <Clock size={16} />;
      case 'low': return <CheckCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

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
        await fetchPackages();
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

  return (
    <Box
      sx={{
        backgroundImage: 'url(/CourierLogin.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        position: 'relative',
        pb: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            p: 3,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => navigate('/volunteer/dashboard')}
                  sx={{
                    background: 'rgba(132, 141, 88, 0.1)',
                    color: '#848D58',
                    '&:hover': {
                      background: 'rgba(132, 141, 88, 0.2)',
                    },
                  }}
                >
                  <ArrowLeft size={24} />
                </IconButton>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MapPin size={24} color="white" />
                </Box>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Open Maps
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 300,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Discover food rescue opportunities near you
                    </Typography>
                    <MapPin size={20} color="rgba(255, 255, 255, 0.8)" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Filters */}
          <Card
            sx={{
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 141, 88, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Filter size={24} color="#848D58" />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  }}
                >
                  Filter & Search
                </Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <TextField
                  label="Search location or store"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8, color: '#848D58' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#848D58',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#848D58',
                    },
                  }}
                />
                
                <FormControl>
                  <InputLabel>Food Type</InputLabel>
                  <Select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    label="Food Type"
                  >
                    <MenuItem value="All Types">All Types</MenuItem>
                    <MenuItem value="Produce">Produce</MenuItem>
                    <MenuItem value="Prepared Foods">Prepared Foods</MenuItem>
                    <MenuItem value="Bakery">Bakery</MenuItem>
                    <MenuItem value="Dairy">Dairy</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <InputLabel>Max Distance</InputLabel>
                  <Select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    label="Max Distance"
                  >
                    <MenuItem value="Any Distance">Any Distance</MenuItem>
                    <MenuItem value="1">Within 1 mile</MenuItem>
                    <MenuItem value="3">Within 3 miles</MenuItem>
                    <MenuItem value="5">Within 5 miles</MenuItem>
                    <MenuItem value="10">Within 10 miles</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="Distance">Distance</MenuItem>
                    <MenuItem value="Points">Points</MenuItem>
                    <MenuItem value="Urgency">Urgency</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Full Map View */}
          <Box>
            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(132, 141, 88, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MapPin size={24} color="#848D58" />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                        Open Map
                    </Typography>
                  </Box>
                  <Chip
                    label={`${sortedPackages.length} locations`}
                    variant="outlined"
                    sx={{ borderColor: '#848D58', color: '#848D58', fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ height: 600, borderRadius: 2, overflow: 'hidden' }}>
                  <GoogleMapsComponent
                    apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
                    pickups={sortedPackages.map(pkg => ({
                      id: pkg.id.toString(),
                      storeName: pkg.storeName,
                      lat: pkg.lat || 42.3601,
                      lng: pkg.lng || -71.0589,
                      foodType: pkg.foodType,
                      weight: `${pkg.weight} lbs`,
                      timeWindow: `${new Date(pkg.pickupWindow.start).toLocaleTimeString()} - ${new Date(pkg.pickupWindow.end).toLocaleTimeString()}`,
                    }))}
                    userLocation={userLocation || undefined}
                    height="600px"
                    onAcceptMission={(id, storeName) => handleAcceptMission(parseInt(id), storeName)}
                  />
                </Box>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                    Click on any restaurant marker to see details and accept missions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </motion.div>
      </Container>

      {/* PIN Entry Modal removed - now using direct assignment */}
    </Box>
  );
};

export default VolunteerFindPickups;