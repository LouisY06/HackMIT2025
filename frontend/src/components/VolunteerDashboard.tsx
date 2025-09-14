import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Container,
  Grid,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Truck,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Gift,
  Trophy,
  Leaf,
  Users,
  Package,
  ArrowRight,
  Star,
  Target,
  Zap,
  Heart,
  Globe,
  Coffee,
  ShoppingBag,
  CreditCard,
  Utensils,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { auth } from '../config/firebase';
import { API_BASE_URL } from '../config/api';

const VolunteerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    points: 1250,
    completedPickups: 23,
    foodSaved: 156,
    co2Reduced: 89,
    rank: 3,
  });
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [currentTasks, setCurrentTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // PIN entry states for pickup confirmation
  const [pinEntryOpen, setPinEntryOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [pinValue, setPinValue] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Delivery info modal states
  const [deliveryInfoOpen, setDeliveryInfoOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Distance calculation
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

  // Fetch current tasks only
  const fetchCurrentTasks = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const tasksResponse = await fetch(`${API_BASE_URL}/api/packages/volunteer/${user.uid}`);
      const tasksData = await tasksResponse.json();
      
      if (tasksData.success) {
        // Show both assigned and picked_up tasks
        const activeTasks = tasksData.packages.filter((task: any) => 
          task.status === 'assigned' || task.status === 'picked_up'
        );
        setCurrentTasks(activeTasks);
      }
    } catch (error) {
      console.error('Error fetching current tasks:', error);
    }
  };

  // Fetch data
  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get user location
      const location = await getUserLocation();
      setUserLocation(location);

      // Fetch available packages
      const packagesResponse = await fetch(`${API_BASE_URL}/api/packages/available`);
      const packagesData = await packagesResponse.json();
      
      if (packagesData.success) {
        const formattedPackages = packagesData.packages.map((pkg: any) => {
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
          };
        });
        
        formattedPackages.sort((a: any, b: any) => {
          const aDist = parseFloat(a.distance);
          const bDist = parseFloat(b.distance);
          if (isNaN(aDist)) return 1;
          if (isNaN(bDist)) return -1;
          return aDist - bDist;
        });
        
        setAvailablePackages(formattedPackages);
      }

      // Fetch current tasks
      const tasksResponse = await fetch(`${API_BASE_URL}/api/packages/volunteer/${user.uid}`);
      const tasksData = await tasksResponse.json();
      
      if (tasksData.success) {
        // Show both assigned and picked_up tasks
        const activeTasks = tasksData.packages.filter((task: any) => 
          task.status === 'assigned' || task.status === 'picked_up'
        );
        setCurrentTasks(activeTasks);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // Set fallback data
      setAvailablePackages([
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
        },
        {
          id: 2,
          storeName: "Trader Joe's",
          address: "456 Mass Ave, Cambridge, MA",
          distance: "1.2 mi",
          foodType: "Prepared Foods",
          weight: 8,
          points: 90,
          urgency: 'medium',
          pickupWindow: { start: new Date(), end: new Date(Date.now() + 3 * 60 * 60 * 1000) },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // PIN entry functions for pickup confirmation
  const handleEnterPin = (packageId: number) => {
    setSelectedPackageId(packageId);
    setPinEntryOpen(true);
  };

  const handlePinSubmit = async () => {
    if (!pinValue || !selectedPackageId) {
      alert('Please enter a PIN');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to confirm pickup');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${selectedPackageId}/pickup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinValue,
          volunteer_id: user.uid
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Package pickup confirmed! Now deliver to food bank.');
        setPinEntryOpen(false);
        setPinValue('');
        setSelectedPackageId(null);
        // Refresh only current tasks to update status
        fetchCurrentTasks();
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Error confirming pickup:', error);
      alert('Network error. Please try again.');
    }
  };

  const handlePinCancel = () => {
    setPinEntryOpen(false);
    setPinValue('');
    setSelectedPackageId(null);
  };

  const handleShowDeliveryInfo = (task: any) => {
    setSelectedTask(task);
    setDeliveryInfoOpen(true);
  };

  const handleCloseDeliveryInfo = () => {
    setDeliveryInfoOpen(false);
    setSelectedTask(null);
  };

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

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw size={48} color="#848D58" />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundImage: 'url(/VolunteerLogin.png)',
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
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Truck size={28} color="white" />
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
                    Volunteer Dashboard
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
                      Ready to make an impact today?
                    </Typography>
                    <Leaf size={20} color="rgba(255, 255, 255, 0.8)" />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Chip
                    icon={<Star size={18} />}
                    label={`${userStats.points} points`}
                    sx={{
                      background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      px: 1,
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Chip
                    icon={<Trophy size={18} />}
                    label={`Rank #${userStats.rank}`}
                    variant="outlined"
                    sx={{
                      borderColor: '#848D58',
                      color: '#848D58',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#848D58' },
                    }}
                  />
                </motion.div>
                <IconButton
                  onClick={() => navigate('/')}
                  sx={{
                    background: 'rgba(132, 141, 88, 0.1)',
                    color: '#848D58',
                    '&:hover': {
                      background: 'rgba(132, 141, 88, 0.2)',
                    },
                  }}
                >
                  <LogOut size={20} />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
              <Box>
                <motion.div
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    boxShadow: "0 8px 25px rgba(132, 141, 88, 0.15)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {userStats.completedPickups}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Completed Pickups
                          </Typography>
                        </Box>
                        <CheckCircle size={40} style={{ opacity: 0.8 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>

              <Box>
                <motion.div
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    boxShadow: "0 8px 25px rgba(132, 141, 88, 0.15)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    sx={{ 
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                      color: 'white',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {userStats.foodSaved}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            lbs Food Saved
                          </Typography>
                        </Box>
                        <Leaf size={40} style={{ opacity: 0.8 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>

              <Box>
                <motion.div
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    boxShadow: "0 8px 25px rgba(132, 141, 88, 0.15)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                      color: 'white',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {userStats.co2Reduced}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            kg CO₂ Reduced
                          </Typography>
                        </Box>
                        <Globe size={40} style={{ opacity: 0.8 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>

              <Box>
                <motion.div
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    boxShadow: "0 8px 25px rgba(132, 141, 88, 0.15)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                      color: 'white',
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {Math.round(userStats.foodSaved * 0.8)}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Meals Provided
                          </Typography>
                        </Box>
                        <Heart size={40} style={{ opacity: 0.8 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Main Content */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            {/* Available Pickups */}
            <Box>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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
                        <Package size={24} color="#848D58" />
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700,
                            fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                          }}
                        >
                          Available Pickups
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${availablePackages.length} packages`}
                        variant="outlined"
                        sx={{ borderColor: '#848D58', color: '#848D58', fontWeight: 600 }}
                      />
                    </Box>
                    
                    <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                      {availablePackages.map((pkg, index) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Card
                            sx={{ 
                              mb: 2,
                              borderRadius: 2,
                              border: `2px solid ${getUrgencyColor(pkg.urgency)}20`,
                              background: 'white',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                boxShadow: `0 4px 20px ${getUrgencyColor(pkg.urgency)}20`,
                              },
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                    {pkg.storeName}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <MapPin size={16} color="#666" />
                                    <Typography variant="body2" color="text.secondary">
                                      {pkg.address} • {pkg.distance}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Chip 
                                      icon={getUrgencyIcon(pkg.urgency)}
                                      label={pkg.urgency}
                                      size="small" 
                                      sx={{
                                        backgroundColor: `${getUrgencyColor(pkg.urgency)}15`,
                                        color: getUrgencyColor(pkg.urgency),
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                      }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                      {pkg.foodType} • {pkg.weight} lbs
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={`${pkg.points} pts`}
                                  sx={{
                                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="contained"
                                    onClick={() => navigate('/volunteer/find-pickups')}
                                    sx={{ 
                                      background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                                      borderRadius: 2,
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, #6F7549 0%, #5A5F3A 100%)',
                                      },
                                    }}
                                  >
                                    <Package size={16} style={{ marginRight: '4px' }} /> Accept Mission
                                  </Button>
                                </motion.div>
                                <Button
                                  variant="outlined"
                                  startIcon={<MapPin size={18} />}
                                  sx={{
                                    borderColor: '#848D58',
                                    color: '#848D58',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                  }}
                                >
                                  View Details
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Sidebar */}
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Current Tasks */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card
                    sx={{ 
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 152, 0, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Target size={24} color="#FF9800" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Current Tasks
                        </Typography>
                        <Chip 
                          label={currentTasks.length}
                          size="small" 
                          sx={{
                            backgroundColor: '#FF980020',
                            color: '#FF9800',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      
                      {currentTasks.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                          <Package size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                          <Typography variant="h6" sx={{ mb: 1, opacity: 0.7 }}>
                            No active tasks
                          </Typography>
                          <Typography variant="body2">
                            Accept a mission to get started!
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                          {currentTasks.map((task, index) => (
                            <motion.div
                              key={task.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card
                                sx={{
                                  mb: 2,
                                  background: task.status === 'assigned' 
                                    ? 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)'
                                    : 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
                                  border: task.status === 'assigned' 
                                    ? '1px solid #FFB74D' 
                                    : '1px solid #81C784',
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                    {task.store_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {task.food_type} • {task.weight_lbs} lbs
                                  </Typography>
                                  <Box sx={{ ml: 2 }}>
                                    {task.status === 'assigned' ? (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                          backgroundColor: '#4CAF50',
                                          '&:hover': {
                                            backgroundColor: '#45a049'
                                          }
                                        }}
                                        onClick={() => handleEnterPin(task.id)}
                                      >
                                        Enter PIN
                                      </Button>
                                    ) : task.status === 'picked_up' ? (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                          backgroundColor: '#FF9800',
                                          '&:hover': {
                                            backgroundColor: '#F57C00'
                                          }
                                        }}
                                        onClick={() => handleShowDeliveryInfo(task)}
                                      >
                                        Deliver to Food Bank
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                          backgroundColor: '#9E9E9E',
                                          '&:hover': {
                                            backgroundColor: '#757575'
                                          }
                                        }}
                                      >
                                        Completed
                                      </Button>
                                    )}
                                  </Box>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(132, 141, 88, 0.1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Zap size={24} color="#848D58" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Quick Actions
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            startIcon={<MapPin size={18} />}
                            endIcon={<ArrowRight size={18} />}
                            onClick={() => navigate('/volunteer/find-pickups')}
                            sx={{
                              background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              py: 1.5,
                            }}
                          >
                            Find Nearby Pickups
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Gift size={18} />}
                            endIcon={<ArrowRight size={18} />}
                            onClick={() => navigate('/volunteer/rewards')}
                            sx={{
                              borderColor: '#848D58',
                              color: '#848D58',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              py: 1.5,
                            }}
                          >
                            View Rewards
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<Trophy size={18} />}
                            endIcon={<ArrowRight size={18} />}
                            onClick={() => navigate('/volunteer/leaderboard')}
                            sx={{
                              borderColor: '#848D58',
                              color: '#848D58',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              py: 1.5,
                            }}
                          >
                            Leaderboard
                          </Button>
                        </motion.div>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* PIN Entry Modal for Pickup Confirmation */}
      <Dialog open={pinEntryOpen} onClose={handlePinCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          🔢 Enter Pickup PIN
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
            Enter the 4-digit PIN provided by the store to confirm package pickup.
          </Typography>
          <TextField
            fullWidth
            label="Pickup PIN"
            value={pinValue}
            onChange={(e) => setPinValue(e.target.value)}
            placeholder="Enter 4-digit PIN"
            inputProps={{ 
              maxLength: 4,
              style: { 
                textAlign: 'center', 
                fontSize: '1.5rem',
                fontFamily: 'monospace'
              }
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
            The store should provide this PIN when you arrive for pickup.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button 
            onClick={handlePinCancel}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePinSubmit}
            variant="contained"
            sx={{ 
              minWidth: 100,
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
            disabled={!pinValue || pinValue.length !== 4}
          >
            Confirm Pickup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delivery Information Modal */}
      <Dialog open={deliveryInfoOpen} onClose={handleCloseDeliveryInfo} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#FF9800', color: 'white' }}>
          📦 Delivery Information
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedTask && (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                Package ready for delivery!
              </Typography>
              
              <Card sx={{ mb: 3, backgroundColor: '#FFF8E1', border: '2px solid #FF9800' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#F57C00', mb: 1 }}>
                        📋 Order Number:
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          color: '#F57C00',
                          backgroundColor: 'white',
                          padding: '8px 16px',
                          borderRadius: 2,
                          border: '2px solid #FF9800'
                        }}
                      >
                        #{selectedTask.id}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#F57C00', mb: 1 }}>
                        🔢 Delivery PIN:
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          color: '#F57C00',
                          letterSpacing: '0.3em',
                          backgroundColor: 'white',
                          padding: '12px 20px',
                          borderRadius: 2,
                          border: '2px solid #FF9800'
                        }}
                      >
                        {selectedTask.pickup_pin}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976D2', textAlign: 'center' }}>
                  📋 Delivery Instructions:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                  1. **Go to the food bank** with the package
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                  2. **Give them the Order Number**: #{selectedTask.id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
                  3. **Give them the PIN**: {selectedTask.pickup_pin}
                </Typography>
                <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 'bold', textAlign: 'center' }}>
                  4. **Food bank confirms** → Mission completed! ✅
                </Typography>
              </Box>

              <Card sx={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Package Details:
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Store:</strong> {selectedTask.store_name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Food Type:</strong> {selectedTask.food_type}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Weight:</strong> {selectedTask.weight_lbs} lbs
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button 
            onClick={handleCloseDeliveryInfo}
            variant="contained"
            sx={{ 
              minWidth: 120,
              backgroundColor: '#FF9800',
              '&:hover': { backgroundColor: '#F57C00' }
            }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VolunteerDashboard;