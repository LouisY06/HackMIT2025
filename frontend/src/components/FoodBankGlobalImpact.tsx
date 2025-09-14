import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Package, 
  Leaf, 
  Trees,
  Users,
  Store,
  Car,
  Droplets,
  TreePine,
  Building,
  TrendingUp,
  Trophy,
  Globe,
  LogOut,
  BarChart3,
  Building2,
  DollarSign
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const FoodBankGlobalImpact: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - in real app this would come from API
  const globalData = {
    foodSaved: '58.0',
    co2Prevented: '25.5',
    mealsProvided: '2.3',
    costSaved: '1.2',
    milesNotDriven: '28.7',
    waterSaved: '1450.0',
    treesEquivalent: '531.7',
    homesPowered: '1.6',
    activeVolunteers: '12.5',
    partnerStores: '850',
    foodBanks: '150',
    citiesServed: '25',
  };

  const topVolunteers = [
    { name: 'James Wilson', location: 'Cambridge', points: 2100, deliveries: 42, initial: 'J' },
    { name: 'Alex Johnson', location: 'Boston', points: 1850, deliveries: 37, initial: 'A' },
    { name: 'Emily Davis', location: 'Somerville', points: 1650, deliveries: 33, initial: 'E' },
    { name: 'Marcus Chen', location: 'Cambridge', points: 1250, deliveries: 25, initial: 'M' },
    { name: 'Sarah Kim', location: 'Boston', points: 1100, deliveries: 22, initial: 'S' },
  ];

  const topStores = [
    { name: 'MIT Cafeteria', packages: 89, weight: 245.2, location: 'Cambridge' },
    { name: 'Harvard Square Market', packages: 76, weight: 198.5, location: 'Cambridge' },
    { name: 'Boston University Dining', packages: 65, weight: 167.8, location: 'Boston' },
    { name: 'Northeastern Café', packages: 54, weight: 142.1, location: 'Boston' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
                <IconButton 
                  onClick={() => navigate('/foodbank/dashboard')}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ArrowLeft size={24} />
                </IconButton>
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
                  <Globe size={28} color="white" />
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
                    Global Impact Dashboard
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
                      See how our Waste→Worth community is transforming food waste
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
                  icon={<Users size={16} />}
                  label={`${globalData.activeVolunteers}K volunteers`}
                  sx={{
                    backgroundColor: 'rgba(76, 175, 80, 0.2)', 
                    color: '#4CAF50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip
                  icon={<Store size={16} />}
                  label={`${globalData.partnerStores} stores`}
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.2)', 
                    color: '#2196F3',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
                <IconButton 
                  onClick={() => navigate('/foodbank/dashboard')}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Global Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
                  background: 'linear-gradient(135deg, #4ECDC4 0%, #44B7B8 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <Package size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {globalData.foodSaved}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs Food Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <Leaf size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {globalData.co2Prevented}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs CO₂ Prevented
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: 'white' }}>
                    <Users size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      {globalData.mealsProvided}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Meals Provided
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', py: { xs: 3, sm: 4 }, color: '#333' }}>
                    <Trophy size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.8rem', sm: '3rem' } }}>
                      ${globalData.costSaved}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      Cost Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </motion.div>

          {/* Tab Navigation */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                p: 1,
                borderRadius: 3,
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: '100%',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              {['Overview', 'Leaderboard', 'Trends'].map((label, index) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={() => setActiveTab(index)}
                    sx={{
                      width: '100%',
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: activeTab === index ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      background: activeTab === index
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                        : 'transparent',
                      '&:hover': {
                        background: activeTab === index
                          ? 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    {label}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </Box>

          {/* Overview Tab Content */}
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4, mb: 4 }}>
                {/* Environmental Impact */}
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Trees size={24} color="#4CAF50" />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Environmental Impact
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                      Our collective contribution to the planet
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: '#E8F5E8' }}>
                        <Car size={30} color="#4CAF50" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                            {globalData.milesNotDriven}M miles not driven
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                            Equivalent carbon savings
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: '#E3F2FD' }}>
                        <Droplets size={30} color="#2196F3" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
                            {globalData.waterSaved}M gallons saved
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#2196F3' }}>
                            Water conservation impact
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: '#F3E5F5' }}>
                        <TreePine size={30} color="#9C27B0" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#6A1B9A' }}>
                            {globalData.treesEquivalent}K trees equivalent
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#9C27B0' }}>
                            Carbon absorption capacity
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Network Statistics */}
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Building size={24} color="#FF9800" />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Network Statistics
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                      Our growing community
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: '#FFF3E0' }}>
                        <Users size={30} color="#FF9800" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#E65100' }}>
                            {globalData.activeVolunteers}K
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#FF9800' }}>
                            Active Volunteers
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: '#E8F5E8' }}>
                        <Store size={30} color="#4CAF50" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                            {globalData.partnerStores}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                            Partner Stores
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: '#E3F2FD' }}>
                        <Building2 size={30} color="#2196F3" />
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
                            {globalData.foodBanks}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#2196F3' }}>
                            Food Banks
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          )}

          {/* Leaderboard Tab Content */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
                {/* Top Volunteers */}
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Trophy size={24} color="#FFD700" />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Top Volunteers
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {topVolunteers.map((volunteer, index) => (
                        <Box key={volunteer.name} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderRadius: 2, 
                          background: index === 0 ? '#FFF9C4' : '#F5F5F5',
                          border: index === 0 ? '2px solid #FFD700' : '1px solid #E0E0E0'
                        }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            color: index === 0 ? '#F57F17' : '#666',
                            minWidth: '20px'
                          }}>
                            #{index + 1}
                          </Typography>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            background: index === 0 ? '#FFD700' : '#4CAF50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {volunteer.initial}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                              {volunteer.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {volunteer.location} • {volunteer.deliveries} deliveries
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 'bold', 
                            color: index === 0 ? '#F57F17' : '#4CAF50'
                          }}>
                            {volunteer.points} pts
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>

                {/* Top Stores */}
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Store size={24} color="#2196F3" />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Top Performing Stores
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {topStores.map((store, index) => (
                        <Box key={store.name} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          p: 2, 
                          borderRadius: 2, 
                          background: index === 0 ? '#E3F2FD' : '#F5F5F5',
                          border: index === 0 ? '2px solid #2196F3' : '1px solid #E0E0E0'
                        }}>
                          <Typography sx={{ 
                            fontWeight: 'bold', 
                            color: index === 0 ? '#1976D2' : '#666',
                            minWidth: '20px'
                          }}>
                            #{index + 1}
                          </Typography>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: 2, 
                            background: index === 0 ? '#2196F3' : '#4CAF50',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}>
                            <Store size={20} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                              {store.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {store.location} • {store.weight} lbs donated
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ 
                            fontWeight: 'bold', 
                            color: index === 0 ? '#1976D2' : '#4CAF50'
                          }}>
                            {store.packages}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          )}

          {/* Trends Tab Content */}
          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ 
                borderRadius: 4, 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <TrendingUp size={24} color="#4CAF50" />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Global Waste Collection Trends
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                    Aggregate waste collected over time (lbs)
                  </Typography>
                  
                  {/* Simulated Line Graph */}
                  <Box sx={{ position: 'relative', height: '400px', mb: 4 }}>
                    {/* Y-axis labels */}
                    <Box sx={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column-reverse', 
                      justifyContent: 'space-between',
                      pr: 2,
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <Typography variant="caption">0</Typography>
                      <Typography variant="caption">50,000</Typography>
                      <Typography variant="caption">100,000</Typography>
                      <Typography variant="caption">150,000</Typography>
                      <Typography variant="caption">200,000</Typography>
                      <Typography variant="caption">250,000</Typography>
                    </Box>

                    {/* Chart area */}
                    <Box sx={{ 
                      ml: 6, 
                      height: '100%', 
                      border: '2px solid #E0E0E0',
                      borderRadius: 2,
                      position: 'relative',
                      background: 'linear-gradient(to top, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)'
                    }}>
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map((line) => (
                        <Box
                          key={line}
                          sx={{
                            position: 'absolute',
                            top: `${line * 20}%`,
                            left: 0,
                            right: 0,
                            height: '1px',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      ))}

                      {/* Data points and line simulation */}
                      <svg
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                      >
                        {/* Line path */}
                        <path
                          d="M 50 300 Q 100 280 150 250 Q 200 220 250 200 Q 300 180 350 160 Q 400 140 450 120 Q 500 100 550 80"
                          stroke="#4CAF50"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                        />
                        
                        {/* Data points */}
                        {[
                          { x: 50, y: 300, month: 'Jan 2024', value: '145K' },
                          { x: 150, y: 250, month: 'Mar 2024', value: '168K' },
                          { x: 250, y: 200, month: 'May 2024', value: '189K' },
                          { x: 350, y: 160, month: 'Jul 2024', value: '212K' },
                          { x: 450, y: 120, month: 'Sep 2024', value: '238K' },
                          { x: 550, y: 80, month: 'Nov 2024', value: '258K' },
                        ].map((point, index) => (
                          <g key={index}>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="6"
                              fill="#4CAF50"
                              stroke="white"
                              strokeWidth="2"
                            />
                            {/* Hover effect placeholder */}
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="12"
                              fill="transparent"
                              className="hover-point"
                              style={{ cursor: 'pointer' }}
                            />
                          </g>
                        ))}
                      </svg>
                    </Box>

                    {/* X-axis labels */}
                    <Box sx={{ 
                      ml: 6,
                      mt: 2,
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <Typography variant="caption">Jan 2024</Typography>
                      <Typography variant="caption">Mar 2024</Typography>
                      <Typography variant="caption">May 2024</Typography>
                      <Typography variant="caption">Jul 2024</Typography>
                      <Typography variant="caption">Sep 2024</Typography>
                      <Typography variant="caption">Nov 2024</Typography>
                    </Box>
                  </Box>

                  {/* Chart Statistics */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: 2, 
                    mt: 4 
                  }}>
                    <Card sx={{ p: 2, bgcolor: '#E8F5E8', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#2E7D32', mb: 0.5 }}>Total Growth</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>+84%</Typography>
                    </Card>
                    <Card sx={{ p: 2, bgcolor: '#E3F2FD', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#1565C0', mb: 0.5 }}>Average Monthly</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3' }}>208K lbs</Typography>
                    </Card>
                    <Card sx={{ p: 2, bgcolor: '#FFF3E0', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#E65100', mb: 0.5 }}>Peak Month</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF9800' }}>Nov 2024</Typography>
                    </Card>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default FoodBankGlobalImpact;