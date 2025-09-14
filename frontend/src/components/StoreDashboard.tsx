import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Leaf,
  DollarSign,
  Clock,
  Utensils,
  TrendingUp,
  Award,
  Gift,
  Trophy,
  Users,
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
  Store,
} from 'lucide-react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  Grid,
  Divider,
  Badge,
} from '@mui/material';

const StoreDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [storeData] = useState({
    name: "Flour Bakery",
    owner: "Sarah Williams",
    activePackages: 1,
    todaysPickups: 0,
    wasteDiverted: 5.2,
    costSaved: 3.9,
    co2Prevented: 2.3,
    mealsProvided: 12,
    familiesHelped: 0,
    volunteersHelped: 12,
    foodBanksServed: 3,
    avgPickupTime: 18,
  });

  const handleLogout = () => {
    navigate('/store');
  };

  const handleCreatePackage = () => {
    navigate('/store/create-package');
  };

  const handleViewPackages = () => {
    navigate('/store/packages');
  };

  const handleImpactReport = () => {
    navigate('/store/impact');
  };

  const handleGlobalImpact = () => {
    navigate('/store/global-impact');
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
                  <Store size={28} color="white" />
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
                    Store Dashboard
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
                      Making a difference through food waste reduction
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
                  icon={<Package size={16} />}
                  label={`${storeData.activePackages} active`}
                  sx={{
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    px: 1,
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
                <Chip
                  icon={<DollarSign size={16} />}
                  label={`$${storeData.costSaved} saved`}
                  variant="outlined"
                  sx={{
                    borderColor: '#848D58',
                    color: '#848D58',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    '& .MuiChip-icon': { color: '#848D58' },
                  }}
                />
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, mb: 4 }}>

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
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '2rem', md: '3rem' } }}>
                            {storeData.activePackages}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Active Packages
                          </Typography>
                        </Box>
                        <Box sx={{ '& svg': { width: { xs: 24, md: 40 }, height: { xs: 24, md: 40 } } }}>
                          <Package size={40} style={{ opacity: 0.8 }} />
                        </Box>
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
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '2rem', md: '3rem' } }}>
                            {storeData.todaysPickups}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Today's Pickups
                          </Typography>
                        </Box>
                        <Box sx={{ '& svg': { width: { xs: 24, md: 40 }, height: { xs: 24, md: 40 } } }}>
                          <Clock size={40} style={{ opacity: 0.8 }} />
                        </Box>
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
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '2rem', md: '3rem' } }}>
                            {storeData.wasteDiverted}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            lbs Waste Diverted
                          </Typography>
                        </Box>
                        <Box sx={{ '& svg': { width: { xs: 24, md: 40 }, height: { xs: 24, md: 40 } } }}>
                          <Leaf size={40} style={{ opacity: 0.8 }} />
                        </Box>
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
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '2rem', md: '3rem' } }}>
                            ${storeData.costSaved}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                            Cost Saved
                          </Typography>
                        </Box>
                        <Box sx={{ '& svg': { width: { xs: 24, md: 40 }, height: { xs: 24, md: 40 } } }}>
                          <DollarSign size={40} style={{ opacity: 0.8 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Box>
          </motion.div>

          {/* Main Content */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: { xs: 3, lg: 4 } }}>
            {/* Quick Actions */}
            <Box>
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
                    border: '1px solid rgba(132, 141, 88, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Zap size={24} color="#848D58" />
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                        }}
                      >
                        Quick Actions
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<Package size={18} />}
                          endIcon={<ArrowRight size={18} />}
                          onClick={handleCreatePackage}
                          sx={{
                            background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #6F7549 0%, #5A5F3A 100%)',
                            },
                          }}
                        >
                          Create Package
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<ShoppingBag size={18} />}
                          endIcon={<ArrowRight size={18} />}
                          onClick={handleViewPackages}
                          sx={{
                            borderColor: '#848D58',
                            color: '#848D58',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#6F7549',
                              background: 'rgba(132, 141, 88, 0.1)',
                            },
                          }}
                        >
                          View Packages
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<TrendingUp size={18} />}
                          endIcon={<ArrowRight size={18} />}
                          onClick={handleImpactReport}
                          sx={{
                            borderColor: '#848D58',
                            color: '#848D58',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#6F7549',
                              background: 'rgba(132, 141, 88, 0.1)',
                            },
                          }}
                        >
                          Impact Report
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
                            borderColor: '#848D58',
                            color: '#848D58',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#6F7549',
                              background: 'rgba(132, 141, 88, 0.1)',
                            },
                          }}
                        >
                          Global Impact
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<Target size={18} />}
                          endIcon={<ArrowRight size={18} />}
                          onClick={() => navigate('/store/ai-insights')}
                          sx={{
                            borderColor: '#848D58',
                            color: '#848D58',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              borderColor: '#6F7549',
                              background: 'rgba(132, 141, 88, 0.1)',
                            },
                          }}
                        >
                          AI Insights
                        </Button>
                      </motion.div>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Sidebar */}
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Environmental Impact */}
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
                      border: '1px solid rgba(76, 175, 80, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Leaf size={24} color="#4CAF50" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Environmental Impact
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                              CO₂ Prevented
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                              {storeData.co2Prevented} lbs
                            </Typography>
                          </Box>
                          <Globe size={24} style={{ color: '#4CAF50', opacity: 0.7 }} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                              Meals Provided
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                              {storeData.mealsProvided}
                            </Typography>
                          </Box>
                          <Heart size={24} style={{ color: '#2196F3', opacity: 0.7 }} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                              Families Helped
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                              {storeData.familiesHelped}
                            </Typography>
                          </Box>
                          <Users size={24} style={{ color: '#9C27B0', opacity: 0.7 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
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
                        <Package size={24} color="#848D58" />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Recent Activity
                        </Typography>
                      </Box>
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
                          No recent activity
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                          Create your first package to get started!
                        </Typography>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outlined"
                            onClick={handleViewPackages}
                            startIcon={<Package size={16} />}
                            sx={{ 
                              borderColor: '#848D58', 
                              color: '#848D58',
                              borderRadius: 2,
                              '&:hover': {
                                borderColor: '#6F7549',
                                background: 'rgba(132, 141, 88, 0.1)',
                              },
                            }}
                          >
                            View All Packages
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

    </Box>
  );
};

export default StoreDashboard;
