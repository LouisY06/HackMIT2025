import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Leaf,
  Users,
  TrendingUp,
  Award,
  Gift,
  Trophy,
  ArrowRight,
  Star,
  Target,
  Zap,
  Heart,
  Globe,
  Coffee,
  ShoppingBag,
  CreditCard,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Building2,
  Truck,
  BarChart3,
  DollarSign,
  Clock,
} from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  IconButton,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Badge,
} from '@mui/material';
import { API_BASE_URL } from '../config/api';

const FoodBankDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Real data from API
  const [kpiData, setKpiData] = useState({
    todayDeliveries: 0,
    foodReceived: '0.0 lbs today',
    activeVolunteers: 0,
    co2Prevented: '0 lbs',
    mealsProvided: '0 meals provided',
    familiesHelped: '0 families helped',
  });

  const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);
  const [pendingDeliveries, setPendingDeliveries] = useState<any[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [pinValue, setPinValue] = useState('');
  
  // State for manual package confirmation
  const [manualPackageId, setManualPackageId] = useState('');
  const [manualPin, setManualPin] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchFoodBankData();
    fetchPendingDeliveries();
  }, []);

  // Fetch real data from API
  const fetchFoodBankData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/foodbank/dashboard`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setKpiData(data.kpi || kpiData);
          setRecentDeliveries(data.recent_deliveries || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch food bank data:', error);
    }
  };

  // Fetch pending deliveries
  const fetchPendingDeliveries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/foodbank/pending-deliveries`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPendingDeliveries(data.packages || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch pending deliveries:', error);
    }
  };

  // Handle delivery confirmation
  const handleConfirmDelivery = (deliveryPackage: any) => {
    setSelectedPackage(deliveryPackage);
    setConfirmDialogOpen(true);
  };

  const handlePinSubmit = async () => {
    if (!pinValue || !selectedPackage) {
      alert('Please enter a PIN');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${selectedPackage.id}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinValue,
          foodbank_id: 'foodbank_1' // TODO: Get actual food bank ID
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Order completed! The volunteer has received their points and the mission is now complete.');
        setConfirmDialogOpen(false);
        setPinValue('');
        setSelectedPackage(null);
        // Refresh data
        fetchFoodBankData();
        fetchPendingDeliveries();
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Network error. Please try again.');
    }
  };

  const handlePinCancel = () => {
    setConfirmDialogOpen(false);
    setPinValue('');
    setSelectedPackage(null);
  };

  // Handle manual package confirmation
  const handleManualConfirmDelivery = async () => {
    if (!manualPackageId || !manualPin) {
      alert('Please enter both Package ID and PIN');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/packages/${manualPackageId}/deliver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: manualPin,
          foodbank_id: 'foodbank_1' // TODO: Get actual food bank ID
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('✅ Order completed! The volunteer has received their points and the mission is now complete.');
        // Clear the form
        setManualPackageId('');
        setManualPin('');
        // Refresh data
        fetchFoodBankData();
        fetchPendingDeliveries();
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      alert('Network error. Please try again.');
    }
  };

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

  const handleLogout = () => {
    navigate('/foodbank');
  };

  const handleDeliveryLog = () => {
    navigate('/foodbank/delivery-log');
  };

  const handleGlobalImpact = () => {
    navigate('/foodbank/global-impact');
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/FoodbankLogin.png)',
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
      <Box>
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            p: { xs: 2, md: 3 },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 60 },
                    height: { xs: 40, sm: 60 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 size={28} color="white" />
                </Box>
                <Box>
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    Cambridge Food Bank
                  </Typography>
                  <Box sx={{ 
                    display: { xs: 'none', sm: 'flex' }, 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 300,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Verify incoming food deliveries
                    </Typography>
                    <Leaf size={20} color="rgba(255, 255, 255, 0.8)" />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <Chip
                  icon={<CheckCircle size={16} />}
                  label={`${kpiData.todayDeliveries} today`}
                  sx={{
                    backgroundColor: 'rgba(76, 175, 80, 0.2)', 
                    color: '#4CAF50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip
                  icon={<Users size={16} />}
                  label={`${kpiData.activeVolunteers} active`}
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.2)', 
                    color: '#2196F3',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
                <IconButton 
                  onClick={handleLogout}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <LogOut size={20} />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main KPI Cards */}
          <motion.div
            variants={itemVariants}
          >
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: { xs: 2, md: 3 }, 
              mb: 4 
            }}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <CheckCircle size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {kpiData.todayDeliveries}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Today's Deliveries
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <Package size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {kpiData.foodReceived.split(' ')[0]}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs Food Received
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <Users size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {kpiData.activeVolunteers}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Active Volunteers
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <Leaf size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {kpiData.co2Prevented.split(' ')[0]}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs CO₂ Prevented
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            {/* Main Content */}
            <Box>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  mb: 3
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <CheckCircle size={24} color="#4CAF50" />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Package Delivery Management
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                      Enter package details to confirm delivery
                    </Typography>
                    
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)',
                      border: '2px solid #4CAF50',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Package size={24} color="#4CAF50" />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                          Confirm Package Delivery
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                          fullWidth
                          label="Package ID"
                          placeholder="Enter package ID"
                          value={manualPackageId}
                          onChange={(e) => setManualPackageId(e.target.value)}
                          variant="outlined"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            },
                          }}
                        />
                        
                        <TextField
                          fullWidth
                          label="4-Digit PIN"
                          placeholder="Enter 4-digit PIN"
                          value={manualPin}
                          onChange={(e) => setManualPin(e.target.value)}
                          variant="outlined"
                          inputProps={{ maxLength: 4, pattern: '[0-9]*' }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                            },
                          }}
                        />
                        
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<CheckCircle size={20} />}
                            fullWidth
                            onClick={handleManualConfirmDelivery}
                            sx={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              py: 1.5,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)',
                              },
                            }}
                          >
                            Confirm Delivery
                          </Button>
                        </motion.div>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Sidebar */}
            <Box>
              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  mb: 3
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Truck size={18} />}
                          endIcon={<ArrowRight size={18} />}
                          onClick={handleDeliveryLog}
                          sx={{
                            borderColor: '#2196F3',
                            color: '#2196F3',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#1976D2',
                              background: 'rgba(33, 150, 243, 0.1)',
                            },
                          }}
                        >
                          View Delivery Log
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Globe size={18} />}
                          endIcon={<ArrowRight size={18} />}
                          onClick={handleGlobalImpact}
                          sx={{
                            borderColor: '#FF9800',
                            color: '#FF9800',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#F57C00',
                              background: 'rgba(255, 152, 0, 0.1)',
                            },
                          }}
                        >
                          Global Impact
                        </Button>
                      </motion.div>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pending Deliveries */}
              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  mb: 3
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <AlertCircle size={20} color="#FF9800" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Pending Deliveries ({pendingDeliveries.length})
                      </Typography>
                    </Box>
                    
                    {pendingDeliveries.length === 0 ? (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircle size={48} style={{ color: '#4CAF50', marginBottom: '12px' }} />
                        <Typography variant="h6" sx={{ color: '#666', mb: 1, opacity: 0.7 }}>
                          No pending deliveries
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          All packages have been confirmed
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {pendingDeliveries.map((delivery) => (
                          <motion.div
                            key={delivery.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card sx={{ 
                              mb: 2, 
                              border: '1px solid #e0e0e0',
                              '&:hover': { boxShadow: 2 }
                            }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                      {delivery.store_name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                      {delivery.food_type} • {delivery.weight_lbs} lbs
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                      From: {delivery.store_address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                      Volunteer: {delivery.volunteer_id ? delivery.volunteer_id.substring(0, 8) + '...' : 'Unknown'}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ ml: 2 }}>
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() => handleConfirmDelivery(delivery)}
                                      sx={{
                                        background: '#4CAF50',
                                        '&:hover': { background: '#45a049' },
                                        textTransform: 'none',
                                        borderRadius: 2
                                      }}
                                    >
                                      Confirm Delivery
                                    </Button>
                                  </Box>
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

              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Clock size={20} color="#666" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Recent Deliveries
                      </Typography>
                    </Box>
                    {recentDeliveries.length === 0 ? (
                      <Box sx={{ 
                        textAlign: 'center', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 4,
                        minHeight: '200px'
                      }}>
                        <Package size={48} style={{ color: '#ccc', marginBottom: '12px' }} />
                        <Typography variant="h6" sx={{ color: '#666', mb: 1, opacity: 0.7 }}>
                          No recent deliveries
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                          Deliveries will appear here once confirmed
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outlined"
                            onClick={handleDeliveryLog}
                            startIcon={<Truck size={16} />}
                            sx={{ 
                              borderColor: '#4CAF50', 
                              color: '#4CAF50',
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: '#45a049',
                                background: 'rgba(76, 175, 80, 0.1)',
                              },
                            }}
                          >
                            View All Deliveries
                          </Button>
                        </motion.div>
                      </Box>
                    ) : (
                      <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {recentDeliveries.map((delivery) => (
                          <motion.div
                            key={delivery.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card sx={{ 
                              mb: 2, 
                              border: '1px solid #e0e0e0',
                              '&:hover': { boxShadow: 2 }
                            }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                      {delivery.store_name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                                      {delivery.food_type} • {delivery.weight_lbs} lbs
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
                                      Confirmed: {new Date(delivery.delivered_at).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ ml: 2 }}>
                                    <CheckCircle size={20} color="#4CAF50" />
                                  </Box>
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
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* PIN Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handlePinCancel} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          📦 Confirm Package Delivery
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 2 }}>
          {selectedPackage && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {selectedPackage.store_name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {selectedPackage.food_type} • {selectedPackage.weight_lbs} lbs
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Enter the 4-digit PIN provided by the volunteer to confirm delivery.
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Delivery PIN"
            value={pinValue}
            onChange={(e) => setPinValue(e.target.value)}
            placeholder="Enter 4-digit PIN"
            type="password"
            inputProps={{ maxLength: 4 }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handlePinCancel} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handlePinSubmit}
            variant="contained"
            sx={{
              background: '#4CAF50',
              '&:hover': { background: '#45a049' },
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Confirm Delivery
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default FoodBankDashboard;