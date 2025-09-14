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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';
import { Gift, Trophy, Utensils, ShoppingBag, Coffee, CreditCard, MapPin, Smartphone, RotateCcw } from 'lucide-react';
import { auth } from '../config/firebase';

const VolunteerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(1250);
  const [completedPickups, setCompletedPickups] = useState(23);
  const [foodSaved, setFoodSaved] = useState(156); // in pounds
  const [co2Reduced, setCo2Reduced] = useState(89); // in kg
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [currentTasks, setCurrentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Distance calculation function using Haversine formula
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

  // Get user's current location
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

  // Fetch current tasks for the logged-in volunteer
  const fetchCurrentTasks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const response = await fetch(`http://localhost:5001/api/packages/volunteer/${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setCurrentTasks(data.packages);
      }
    } catch (error) {
      console.error('Error fetching current tasks:', error);
    }
  };

  // Fetch real package data
  React.useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Get user location first
        const location = await getUserLocation();
        setUserLocation(location);

        // Fetch available packages
        const response = await fetch('http://localhost:5001/api/packages/available');
        const data = await response.json();
        
        if (data.success) {
          // Convert package data to pickup format with real distance calculation
          const packagePickups = data.packages.map((pkg: any) => {
            let distance = "Distance unknown";
            
            if (pkg.store_lat && pkg.store_lng) {
              const calculatedDistance = calculateDistance(
                location.lat, 
                location.lng, 
                pkg.store_lat, 
                pkg.store_lng
              );
              distance = `${calculatedDistance.toFixed(1)} mi`;
            }
            
            return {
              id: pkg.id,
              name: pkg.store_name,
              address: pkg.store_address,
              distance: distance,
              items: [pkg.food_type],
              points: Math.floor(pkg.weight_lbs * 5) + 50,
              status: "available"
            };
          });
          
          // Sort by distance (closest first)
          packagePickups.sort((a: any, b: any) => {
            if (a.distance === "Distance unknown" && b.distance !== "Distance unknown") return 1;
            if (a.distance !== "Distance unknown" && b.distance === "Distance unknown") return -1;
            const aDist = parseFloat(a.distance);
            const bDist = parseFloat(b.distance);
            return aDist - bDist;
          });
          
          setPickupLocations(packagePickups);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Fallback to mock data
        setPickupLocations([
          {
            id: 1,
            name: "Whole Foods Market",
            address: "123 Main St, Cambridge, MA",
            distance: "0.8 mi",
            items: ["Bread", "Vegetables", "Dairy"],
            points: 50,
            status: "available"
          },
          {
            id: 2,
            name: "Trader Joe's",
            address: "456 Mass Ave, Cambridge, MA",
            distance: "1.2 mi",
            items: ["Fruits", "Bakery", "Prepared Foods"],
            points: 75,
            status: "available"
          },
          {
            id: 3,
            name: "Stop & Shop",
            address: "789 Broadway, Cambridge, MA",
            distance: "2.1 mi",
            items: ["Meat", "Dairy", "Produce"],
            points: 60,
            status: "in_progress"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
    fetchCurrentTasks();
  }, []);

  // Mock data for leaderboard
  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 2840, avatar: "SC" },
    { rank: 2, name: "Mike Johnson", points: 2650, avatar: "MJ" },
    { rank: 3, name: "You", points: 1250, avatar: "You" },
    { rank: 4, name: "Emma Wilson", points: 1180, avatar: "EW" },
    { rank: 5, name: "Alex Brown", points: 950, avatar: "AB" }
  ];

  // Mock data for rewards
  const rewards = [
    { id: 1, name: "Free Coffee", cost: 100, icon: "coffee" },
    { id: 2, name: "Gift Card $10", cost: 500, icon: "credit-card" },
    { id: 3, name: "Restaurant Voucher", cost: 750, icon: "utensils" },
    { id: 4, name: "Eco-friendly Tote", cost: 300, icon: "shopping-bag" }
  ];

  const handleQRScan = async (locationId: number) => {
    try {
      // Get current user from Firebase Auth
      const user = auth.currentUser;
      if (!user) {
        alert('Please log in to accept missions');
        return;
      }

      const response = await fetch(`http://localhost:5001/api/packages/${locationId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          volunteer_id: user.uid
        })
      });

      const data = await response.json();

      if (data.success) {
        alert(`Mission accepted! Package ${locationId} has been assigned to you.`);
        // Refresh both available packages and current tasks
        fetchCurrentTasks();
        window.location.reload();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error accepting mission:', error);
      alert('Failed to accept mission. Please try again.');
    }
  };

  const handleRedeemReward = (rewardId: number, cost: number) => {
    if (points >= cost) {
      setPoints(points - cost);
      console.log(`Redeemed reward ${rewardId}`);
    } else {
      alert("Not enough points!");
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 2 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        p: 2,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
            Volunteer Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Ready to make an impact?
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${points} points`} 
            color="primary" 
            sx={{ 
              backgroundColor: '#4CAF50', 
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }} 
          />
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Column - Pickup Locations */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Available Pickups
                </Typography>
                <Chip 
                  label={`${pickupLocations.length} packages`} 
                  size="small" 
                  variant="outlined"
                  sx={{ color: '#4CAF50', borderColor: '#4CAF50' }}
                />
              </Box>
              
              <List sx={{ 
                maxHeight: '400px', 
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
                {pickupLocations.map((location, index) => (
                  <React.Fragment key={location.id}>
                    <ListItem 
                      sx={{ 
                        backgroundColor: location.status === 'in_progress' ? '#fff3e0' : 'white',
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#4CAF50' }}>
                          <LocalShipping />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {location.name}
                            </Typography>
                            <Chip 
                              label={`${location.points} pts`} 
                              size="small" 
                              sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                <MapPin size={16} style={{ marginRight: '4px' }} /> {location.address} • {location.distance}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                              {location.items.map((item: string, idx: number) => (
                                <Chip key={idx} label={item} size="small" variant="outlined" />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                onClick={() => handleQRScan(location.id)}
                                sx={{ 
                                  backgroundColor: '#4CAF50',
                                  '&:hover': { backgroundColor: '#388E3C' }
                                }}
                                size="small"
                              >
                                <Smartphone size={16} style={{ marginRight: '4px' }} /> Scan QR
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                              >
                                <RotateCcw size={16} style={{ marginRight: '4px' }} /> Refresh
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pickupLocations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Quick Actions */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  backgroundColor: '#4CAF50',
                  mb: 2,
                  '&:hover': { backgroundColor: '#388E3C' }
                }}
              >
                <Smartphone size={16} style={{ marginRight: '4px' }} /> Scan QR Code
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate('/volunteer/find-pickups')}
              >
                <MapPin size={16} style={{ marginRight: '4px' }} /> Find Nearby Pickups
              </Button>
            </CardContent>
          </Card>

          {/* Current Tasks Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Current Tasks
                </Typography>
                <Chip 
                  label={`${currentTasks.length} assigned`} 
                  size="small" 
                  variant="outlined"
                  sx={{ color: '#FF9800', borderColor: '#FF9800' }}
                />
              </Box>
              
              {currentTasks.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  color: 'text.secondary'
                }}>
                  <LocalShipping sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No current tasks
                  </Typography>
                  <Typography variant="body2">
                    Accept a mission from the available pickups to get started!
                  </Typography>
                </Box>
              ) : (
                <List sx={{ 
                  maxHeight: '300px', 
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
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#a8a8a8',
                  },
                }}>
                  {currentTasks.map((task) => (
                    <ListItem key={task.id} sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 2, 
                      mb: 1,
                      backgroundColor: '#fff8e1',
                      '&:hover': {
                        backgroundColor: '#fff3c4'
                      }
                    }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          backgroundColor: '#FF9800',
                          width: 40,
                          height: 40
                        }}>
                          <LocalShipping />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {task.store_name}
                            </Typography>
                            <Chip 
                              label={task.status} 
                              size="small" 
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              📍 {task.store_address}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              📦 {task.food_type} • {task.weight_lbs} lbs
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              ⏰ Pickup: {new Date(task.pickup_window_start).toLocaleTimeString()} - {new Date(task.pickup_window_end).toLocaleTimeString()}
                            </Typography>
                            {task.special_instructions && (
                              <Typography variant="body2" color="text.secondary">
                                📝 {task.special_instructions}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <Box sx={{ ml: 2 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                              backgroundColor: '#45a049'
                            }
                          }}
                          onClick={() => {
                            // TODO: Implement task completion
                            alert('Task completion feature coming soon!');
                          }}
                        >
                          Complete
                        </Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Bottom Left - Impact Metrics */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Your Impact
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {completedPickups}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pickups Completed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {foodSaved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    lbs Food Saved
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                    {co2Reduced}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kg CO₂ Reduced
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    {Math.round(foodSaved * 0.8)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meals Provided
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bottom Right - Rewards & Leaderboard */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Rewards */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    <Gift size={20} style={{ marginRight: '8px' }} /> Rewards
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                  {rewards.map((reward) => (
                    <Card 
                      key={reward.id}
                      sx={{ 
                        p: 1, 
                        cursor: 'pointer',
                        border: points >= reward.cost ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                      onClick={() => handleRedeemReward(reward.id, reward.cost)}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                          {reward.icon === 'coffee' && '☕'}
                          {reward.icon === 'credit-card' && '💳'}
                          {reward.icon === 'utensils' && '🍴'}
                          {reward.icon === 'shopping-bag' && '🛍️'}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {reward.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reward.cost} pts
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
                
                {/* See More Rewards Button */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/volunteer/rewards')}
                    sx={{
                      color: '#4CAF50',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}
                  >
                    See More Rewards →
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    <Trophy size={20} style={{ marginRight: '8px' }} /> Top Volunteers
                  </Typography>
                </Box>
                <List sx={{ p: 0 }}>
                  {leaderboard.map((user) => (
                    <ListItem key={user.rank} sx={{ py: 0.5, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          fontSize: '0.75rem',
                          backgroundColor: user.rank <= 3 ? '#ff9800' : '#e0e0e0'
                        }}>
                          {user.rank}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`${user.points} points`}
                      />
                      {user.rank <= 3 && (
                        <Trophy size={20} style={{ color: '#ff9800' }} />
                      )}
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/volunteer/leaderboard')}
                    sx={{
                      color: '#9C27B0',
                      borderColor: '#9C27B0',
                      '&:hover': {
                        borderColor: '#7B1FA2',
                        backgroundColor: 'rgba(156, 39, 176, 0.04)'
                      }
                    }}
                  >
                    See More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VolunteerDashboard;
