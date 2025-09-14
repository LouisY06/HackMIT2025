import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Package, Trophy, Home, BarChart3, TrendingUp, LogOut, Globe, Trees, Users, Store, Car, Droplets, TreePine, Building } from 'lucide-react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

const StoreGlobalImpact: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - in real app, this would come from API
  const globalData = {
    foodSaved: 58.0,
    co2Prevented: 25.5,
    mealsProvided: 2.3,
    costSaved: 1.2,
    milesNotDriven: 28.7,
    waterSaved: 1450.0,
    treesEquivalent: 531.7,
    homesPowered: 1.6,
    activeVolunteers: 12.5,
    partnerStores: 850,
    foodBanks: 150,
    citiesServed: 25,
  };

  // Cities leaderboard data
  const citiesData = [
    { rank: 1, city: 'Cambridge, MA', population: 118403, totalWaste: 2847, wastePerCapita: 24.04 },
    { rank: 2, city: 'Berkeley, CA', population: 124321, totalWaste: 2956, wastePerCapita: 23.78 },
    { rank: 3, city: 'Portland, OR', population: 650380, totalWaste: 15234, wastePerCapita: 23.43 },
    { rank: 4, city: 'Austin, TX', population: 978908, totalWaste: 22156, wastePerCapita: 22.63 },
    { rank: 5, city: 'Seattle, WA', population: 753675, totalWaste: 16892, wastePerCapita: 22.42 },
    { rank: 6, city: 'San Francisco, CA', population: 873965, totalWaste: 19234, wastePerCapita: 22.01 },
    { rank: 7, city: 'Denver, CO', population: 715522, totalWaste: 15432, wastePerCapita: 21.57 },
    { rank: 8, city: 'Boston, MA', population: 695506, totalWaste: 14876, wastePerCapita: 21.39 },
    { rank: 9, city: 'Minneapolis, MN', population: 429954, totalWaste: 9123, wastePerCapita: 21.22 },
    { rank: 10, city: 'Madison, WI', population: 269840, totalWaste: 5698, wastePerCapita: 21.12 },
  ];

  // Trends data for the chart
  const trendsData = [
    { month: 'Jan 2024', waste: 145000 },
    { month: 'Feb 2024', waste: 152000 },
    { month: 'Mar 2024', waste: 168000 },
    { month: 'Apr 2024', waste: 175000 },
    { month: 'May 2024', waste: 189000 },
    { month: 'Jun 2024', waste: 198000 },
    { month: 'Jul 2024', waste: 212000 },
    { month: 'Aug 2024', waste: 225000 },
    { month: 'Sep 2024', waste: 238000 },
    { month: 'Oct 2024', waste: 247000 },
    { month: 'Nov 2024', waste: 258000 },
    { month: 'Dec 2024', waste: 267000 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/RestLogin.png)',
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
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
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
                      fontSize: { xs: '1.5rem', sm: '2.125rem' },
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
                    <Globe size={20} color="rgba(255, 255, 255, 0.8)" />
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
                <IconButton
                  onClick={() => navigate('/')}
                  size="small"
                  sx={{
                    background: 'rgba(132, 141, 88, 0.1)',
                    color: '#848D58',
                    '&:hover': {
                      background: 'rgba(132, 141, 88, 0.2)',
                    },
                  }}
                >
                  <LogOut size={18} />
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, mb: 4 }}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4ECDC4 0%, #44B7B8 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Package size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {globalData.foodSaved}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs Food Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Leaf size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {globalData.co2Prevented}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs CO₂ Prevented
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Users size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {globalData.mealsProvided}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Meals Provided
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Trophy size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${globalData.costSaved}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
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
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
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
                      transition: 'all 0.3s ease',
                      background: activeTab === index 
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
                        : 'transparent',
                      color: activeTab === index ? 'white' : 'rgba(255, 255, 255, 0.7)',
                      boxShadow: activeTab === index 
                        ? '0 4px 12px rgba(76, 175, 80, 0.3)' 
                        : 'none',
                      '&:hover': {
                        background: activeTab === index 
                          ? 'linear-gradient(135deg, #45a049 0%, #388e3c 100%)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: activeTab === index ? 'white' : 'rgba(255, 255, 255, 0.9)',
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
                  border: '1px solid rgba(132, 141, 88, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Miles Not Driven
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                            {globalData.milesNotDriven}M miles
                          </Typography>
                        </Box>
                        <Car size={24} style={{ color: '#4CAF50', opacity: 0.7 }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Water Saved
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                            {globalData.waterSaved}M gallons
                          </Typography>
                        </Box>
                        <Droplets size={24} style={{ color: '#2196F3', opacity: 0.7 }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Trees Equivalent
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                            {globalData.treesEquivalent}K trees
                          </Typography>
                        </Box>
                        <TreePine size={24} style={{ color: '#9C27B0', opacity: 0.7 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Network Statistics */}
                <Card sx={{ 
                  borderRadius: 4, 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(132, 141, 88, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Building size={24} color="#848D58" />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Network Statistics
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                      Our growing community
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Active Volunteers
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                            {globalData.activeVolunteers}K
                          </Typography>
                        </Box>
                        <Users size={24} style={{ color: '#4CAF50', opacity: 0.7 }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Partner Stores
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                            {globalData.partnerStores}
                          </Typography>
                        </Box>
                        <Store size={24} style={{ color: '#2196F3', opacity: 0.7 }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Food Banks
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                            {globalData.foodBanks}
                          </Typography>
                        </Box>
                        <Building size={24} style={{ color: '#9C27B0', opacity: 0.7 }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            Cities Served
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                            {globalData.citiesServed}
                          </Typography>
                        </Box>
                        <Globe size={24} style={{ color: '#FF9800', opacity: 0.7 }} />
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
              <Card sx={{ 
                borderRadius: 4, 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(132, 141, 88, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                <Box sx={{ p: 4, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Trophy size={24} color="#FF9800" />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Global Cities Leaderboard
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#666' }}>
                    Cities ranked by total waste collected and waste collected per capita
                  </Typography>
                </Box>
                
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', py: 2 }}>Rank</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', py: 2 }}>City</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', py: 2 }}>Population</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', py: 2 }}>Total Waste Collected</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#333', py: 2 }}>Waste per Capita</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {citiesData.map((city, index) => (
                        <TableRow
                          key={city.city}
                          component={motion.tr}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          sx={{
                            '&:hover': {
                              bgcolor: 'rgba(76, 175, 80, 0.05)',
                            },
                            bgcolor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {city.rank <= 3 && (
                                <Box
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    background: city.rank === 1 
                                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                                      : city.rank === 2
                                      ? 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)'
                                      : 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
                                    color: 'white',
                                  }}
                                >
                                  {city.rank}
                                </Box>
                              )}
                              {city.rank > 3 && (
                                <Chip 
                                  label={city.rank} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#f5f5f5',
                                    fontWeight: 'bold',
                                    minWidth: 24,
                                  }} 
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                              {city.city}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {city.population.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                              {city.totalWaste.toLocaleString()} lbs
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196F3' }}>
                              {city.wastePerCapita} lbs/person
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
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
                border: '1px solid rgba(132, 141, 88, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                p: 4 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <TrendingUp size={24} color="#2196F3" />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                    Global Waste Collection Trends
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                    Aggregate Waste Collected Over Time
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                    Total waste collected across all partner cities (lbs)
                  </Typography>
                  
                  {/* Chart Container */}
                  <Box sx={{ 
                    position: 'relative',
                    height: 400,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 3,
                    bgcolor: '#fafafa'
                  }}>
                    {/* Y-axis labels */}
                    <Box sx={{ 
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 60,
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      justifyContent: 'space-between',
                      py: 2
                    }}>
                      {[300000, 250000, 200000, 150000, 100000, 50000, 0].map((value) => (
                        <Typography key={value} variant="caption" sx={{ color: '#666', fontSize: '10px' }}>
                          {value.toLocaleString()}
                        </Typography>
                      ))}
                    </Box>
                    
                    {/* Chart area */}
                    <Box sx={{ 
                      ml: 8,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'end',
                      gap: 1,
                      pb: 4
                    }}>
                      {trendsData.map((data, index) => {
                        const maxValue = 300000;
                        const height = (data.waste / maxValue) * 100;
                        return (
                          <motion.div
                            key={data.month}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            style={{
                              flex: 1,
                              background: `linear-gradient(to top, #4CAF50 0%, #81C784 100%)`,
                              borderRadius: '4px 4px 0 0',
                              position: 'relative',
                              cursor: 'pointer',
                              minHeight: '2px'
                            }}
                            whileHover={{ 
                              background: 'linear-gradient(to top, #45a049 0%, #66BB6A 100%)',
                              transform: 'scaleY(1.05)'
                            }}
                          >
                            <Box sx={{
                              position: 'absolute',
                              bottom: '100%',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              mb: 1,
                              opacity: 0,
                              transition: 'opacity 0.2s',
                              bgcolor: 'rgba(0, 0, 0, 0.8)',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '10px',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                opacity: 1
                              }
                            }}>
                              {data.waste.toLocaleString()} lbs
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Box>
                    
                    {/* X-axis labels */}
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 60,
                      right: 0,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {trendsData.map((data, index) => (
                        <Box key={data.month} sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ 
                            color: '#666', 
                            fontSize: '9px',
                            transform: 'rotate(-45deg)',
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}>
                            {data.month}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Chart Statistics */}
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: 2, 
                    mt: 4 
                  }}>
                    <Card sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Total Growth</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>+84%</Typography>
                    </Card>
                    <Card sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Average Monthly</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3' }}>208K lbs</Typography>
                    </Card>
                    <Card sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>Peak Month</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF9800' }}>Dec 2024</Typography>
                    </Card>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default StoreGlobalImpact;