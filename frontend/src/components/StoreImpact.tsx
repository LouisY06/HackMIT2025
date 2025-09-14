import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Package, DollarSign, Recycle, Home, BarChart3, TrendingUp, LogOut, Users, Trees, Droplets, Store } from 'lucide-react';
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
} from '@mui/material';

const StoreImpact: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - in real app, this would come from API
  const impactData = {
    foodSaved: 5.2,
    co2Prevented: 2.3,
    mealsProvided: 12,
    costSaved: 3.9,
    carbonFootprint: 2.3,
    waterSaved: 130,
    wasteDiverted: 5.2,
    volunteersEngaged: 8,
    deliveriesCompleted: 0,
    communityRanking: 3,
  };

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
                    Impact Dashboard
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
                      Your sustainability metrics
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

          {/* KPI Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, mb: 4 }}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Package size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {impactData.foodSaved}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs Food Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Leaf size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {impactData.co2Prevented}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs CO₂ Prevented
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Users size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {impactData.mealsProvided}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Meals Provided
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <DollarSign size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${impactData.costSaved}
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
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: '1px solid #e0e0e0' }}>
              <Tab 
                label="Overview" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: activeTab === 0 ? 'bold' : 'normal',
                  color: activeTab === 0 ? '#4CAF50' : '#666',
                  '&.Mui-selected': { color: '#4CAF50' }
                }} 
              />
              <Tab 
                label="Trends" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: activeTab === 1 ? 'bold' : 'normal',
                  color: activeTab === 1 ? '#4CAF50' : '#666',
                  '&.Mui-selected': { color: '#4CAF50' }
                }} 
              />
              <Tab 
                label="Achievements" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: activeTab === 2 ? 'bold' : 'normal',
                  color: activeTab === 2 ? '#4CAF50' : '#666',
                  '&.Mui-selected': { color: '#4CAF50' }
                }} 
              />
              <Tab 
                label="Details" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: activeTab === 3 ? 'bold' : 'normal',
                  color: activeTab === 3 ? '#4CAF50' : '#666',
                  '&.Mui-selected': { color: '#4CAF50' }
                }} 
              />
            </Tabs>
          </Box>

          {/* Overview Tab Content */}
          {activeTab === 0 && (
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {/* Environmental Impact Section */}
              <Card sx={{ flex: '1 1 400px', minWidth: '400px', borderRadius: 4, bgcolor: '#f8f9fa' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Trees size={24} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Environmental Impact
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Your contribution to a greener planet
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Carbon Footprint */}
                    <Card sx={{ borderRadius: 3, bgcolor: 'white', p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Leaf size={24} style={{ color: '#4CAF50' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                            Carbon Footprint Reduced
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 0.5 }}>
                            {impactData.carbonFootprint} lbs CO₂e
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4CAF50' }}>
                            Equivalent to 3 miles not driven
                          </Typography>
                        </Box>
                      </Box>
                    </Card>

                    {/* Water Saved */}
                    <Card sx={{ borderRadius: 3, bgcolor: 'white', p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Droplets size={24} style={{ color: '#2196F3' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                            Water Saved
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3', mb: 0.5 }}>
                            {impactData.waterSaved} gallons
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#2196F3' }}>
                            Equivalent to 2 showers
                          </Typography>
                        </Box>
                      </Box>
                    </Card>

                    {/* Waste Diverted */}
                    <Card sx={{ borderRadius: 3, bgcolor: 'white', p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Recycle size={24} style={{ color: '#9C27B0' }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                            Waste Diverted
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 0.5 }}>
                            {impactData.wasteDiverted} lbs
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#9C27B0' }}>
                            From Landfills
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                </CardContent>
              </Card>

              {/* Community Impact Section */}
              <Card sx={{ flex: '1 1 400px', minWidth: '400px', borderRadius: 4, bgcolor: '#f8f9fa' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Users size={24} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                        Community Impact
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        How you're helping your local community
                      </Typography>
                    </Box>
                  </Box>

                  {/* Main Metric */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h1" sx={{ fontWeight: 'bold', color: '#2196F3', mb: 1 }}>
                      {impactData.mealsProvided}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                      Meals Provided to families in need
                    </Typography>
                  </Box>

                  {/* Secondary Metrics */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Card sx={{ flex: 1, borderRadius: 3, bgcolor: 'white', p: 2, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                        {impactData.volunteersEngaged}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Volunteers Engaged
                      </Typography>
                    </Card>
                    <Card sx={{ flex: 1, borderRadius: 3, bgcolor: 'white', p: 2, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                        {impactData.deliveriesCompleted}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Deliveries Completed
                      </Typography>
                    </Card>
                  </Box>

                  {/* Community Ranking */}
                  <Card sx={{ borderRadius: 3, bgcolor: 'white', p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                      Community Ranking
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                        #{impactData.communityRanking} in Cambridge
                      </Typography>
                      <Typography 
                        sx={{ 
                          bgcolor: '#FF9800', 
                          color: 'white', 
                          px: 2, 
                          py: 0.5, 
                          borderRadius: 3,
                          fontSize: 14,
                          fontWeight: 'bold'
                        }}
                      >
                        Top Contributor
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Based on food diverted this month
                    </Typography>
                  </Card>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Other Tabs Content */}
          {activeTab === 1 && (
            <Card sx={{ borderRadius: 4, bgcolor: '#f8f9fa', p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Trends
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Trend analysis and charts will be displayed here. Coming soon!
              </Typography>
            </Card>
          )}

          {activeTab === 2 && (
            <Card sx={{ borderRadius: 4, bgcolor: '#f8f9fa', p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Achievements
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Achievement badges and milestones will be displayed here. Coming soon!
              </Typography>
            </Card>
          )}

          {activeTab === 3 && (
            <Card sx={{ borderRadius: 4, bgcolor: '#f8f9fa', p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Details
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Detailed breakdown of all metrics and calculations will be displayed here. Coming soon!
              </Typography>
            </Card>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default StoreImpact;