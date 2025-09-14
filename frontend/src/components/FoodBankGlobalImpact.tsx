import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Trophy } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  QrCodeScanner,
  LocalShipping,
  Assessment,
  ExitToApp,
  LocalShippingOutlined,
  WaterDrop,
  Home,
  People,
  Business,
  LocationCity,
  LocationOn,
  TrendingUp,
} from '@mui/icons-material';

const FoodBankGlobalImpact: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data - in real app this would come from API
  const globalData = {
    foodSaved: '58.0M',
    co2Prevented: '25.5M',
    mealsProvided: '2.3M',
    costSaved: '$1.2M',
  };

  const environmentalImpact = {
    milesNotDriven: '28.7M',
    waterSaved: '1450.0M',
    treesEquivalent: '531.7K',
    homesPowered: '1.6K',
  };

  const networkStats = {
    activeVolunteers: '12.5K',
    partnerStores: '850',
    foodBanks: '150',
    citiesServed: '25',
  };

  const recentMilestones = [
    'Reached 50M lbs food saved!',
    '2M meals milestone achieved',
    '10K volunteers joined the movement'
  ];

  const topVolunteers = [
    { name: 'James Wilson', location: 'Cambridge', points: 2100, deliveries: 42, initial: 'J' },
    { name: 'Alex Johnson', location: 'Boston', points: 1850, deliveries: 37, initial: 'A' },
    { name: 'Emily Davis', location: 'Somerville', points: 1650, deliveries: 33, initial: 'E' },
    { name: 'Marcus Chen', location: 'Cambridge', points: 1250, deliveries: 25, initial: 'M' },
    { name: 'Sarah Kim', location: 'Boston', points: 1100, deliveries: 22, initial: 'S' },
  ];

  const topStores = [
    { name: 'MIT Cafeteria', packages: 89, wasteReduced: 1250, co2Reduced: 550, initial: 'M' },
    { name: 'Harvard Dining', packages: 67, wasteReduced: 980, co2Reduced: 431, initial: 'H' },
    { name: 'Campus Café', packages: 54, wasteReduced: 750, co2Reduced: 330, initial: 'C' },
    { name: 'Flour Bakery', packages: 45, wasteReduced: 650, co2Reduced: 286, initial: 'F' },
    { name: 'Green Garden', packages: 38, wasteReduced: 580, co2Reduced: 255, initial: 'G' },
  ];

  const citiesImpact = [
    { name: 'Cambridge', initial: 'C', rank: 1, volunteers: '2.5K', partnerStores: 150, foodSaved: '12.5K lbs' },
    { name: 'Boston', initial: 'B', rank: 2, volunteers: '3.8K', partnerStores: 220, foodSaved: '18.9K lbs' },
    { name: 'Somerville', initial: 'S', rank: 3, volunteers: '1.2K', partnerStores: 85, foodSaved: '7.8K lbs' },
    { name: 'Newton', initial: 'N', rank: 4, volunteers: '900', partnerStores: 65, foodSaved: '5.2K lbs' },
    { name: 'Brookline', initial: 'B', rank: 5, volunteers: '800', partnerStores: 55, foodSaved: '4.1K lbs' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
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

          <Box sx={{ display: 'flex', gap: 2, mr: 'auto' }}>
            <Button
              startIcon={<QrCodeScanner />}
              sx={{ color: '#666', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/foodbank/dashboard')}
            >
              Scanner
            </Button>
            <Button
              startIcon={<LocalShipping />}
              sx={{ color: '#666', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/foodbank/delivery-log')}
            >
              Delivery Log
            </Button>
            <Button
              startIcon={<Assessment />}
              sx={{
                bgcolor: '#4CAF50',
                color: 'white',
                px: 3,
                borderRadius: 2,
                '&:hover': { bgcolor: '#45a049' },
              }}
            >
              Global Impact
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                Lisa Rodriguez
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Coordinator
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#9C27B0' }}>LR</Avatar>
            <IconButton onClick={() => navigate('/foodbank')}>
              <ExitToApp sx={{ color: '#666' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography sx={{ fontSize: 60, mb: 2 }}>🌍</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Global Impact Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
            See how the Reflourish community is transforming food waste into community impact across the world.
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 6, flexWrap: 'wrap' }}>
          <Card sx={{
            flex: '1 1 200px',
            minWidth: '200px',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Leaf size={24} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalData.foodSaved}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                lbs Food Saved
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            flex: '1 1 200px',
            minWidth: '200px',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #2196F3 0%, #9C27B0 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 24 }}>🌳</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalData.co2Prevented}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                lbs CO₂ Prevented
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            flex: '1 1 200px',
            minWidth: '200px',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #9C27B0 0%, #FF9800 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 24 }}>👥</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalData.mealsProvided}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Meals Provided
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            flex: '1 1 200px',
            minWidth: '200px',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FF9800 0%, #F44336 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 24 }}>🏠</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalData.costSaved}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Cost Saved
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: '1px solid #e0e0e0',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                minHeight: 60,
              },
              '& .Mui-selected': {
                color: '#4CAF50 !important',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#4CAF50',
                height: 3,
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Leaderboards" />
            <Tab label="Cities" />
            <Tab label="Trends" />
          </Tabs>
        </Card>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {/* Left Panel - Environmental Impact */}
            <Card sx={{ 
              flex: '1 1 400px', 
              minWidth: '400px',
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Environmental Impact
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                  Our collective contribution to the planet.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalShippingOutlined sx={{ fontSize: 32, color: '#4CAF50' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                        {environmentalImpact.milesNotDriven}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        miles not driven
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WaterDrop sx={{ fontSize: 32, color: '#2196F3' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                        {environmentalImpact.waterSaved}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        gallons water saved
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: 32 }}>🌳</Typography>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                        {environmentalImpact.treesEquivalent}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        trees planted equivalent
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Home sx={{ fontSize: 32, color: '#FF9800' }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                        {environmentalImpact.homesPowered}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        homes powered for a year
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Right Panel - Network Statistics & Recent Milestones */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Network Statistics */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Network Statistics
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                    Our growing community.
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                    <Box sx={{ 
                      bgcolor: '#e3f2fd', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center' 
                    }}>
                      <People sx={{ fontSize: 32, color: '#2196F3', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                        {networkStats.activeVolunteers}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Active Volunteers
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      bgcolor: '#e8f5e8', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center' 
                    }}>
                      <Business sx={{ fontSize: 32, color: '#4CAF50', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                        {networkStats.partnerStores}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Partner Stores
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      bgcolor: '#f3e5f5', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center' 
                    }}>
                      <Business sx={{ fontSize: 32, color: '#9C27B0', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                        {networkStats.foodBanks}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Food Banks
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      bgcolor: '#fff3e0', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center' 
                    }}>
                      <LocationCity sx={{ fontSize: 32, color: '#FF9800', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                        {networkStats.citiesServed}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Cities Served
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Milestones */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Recent Milestones
                  </Typography>
                  
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {recentMilestones.map((milestone, index) => (
                      <Typography 
                        key={index}
                        component="li" 
                        variant="body1" 
                        sx={{ mb: 1, color: '#333' }}
                      >
                        {milestone}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Leaderboards Tab */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {/* Top Volunteers */}
            <Card sx={{ 
              flex: '1 1 400px', 
              minWidth: '400px',
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Trophy size={24} style={{ marginRight: '8px' }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Top Volunteers
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                  Leading the charge in food rescue.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topVolunteers.map((volunteer, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: index === 0 ? '#f8f9fa' : 'transparent',
                      border: index === 0 ? '1px solid #e0e0e0' : 'none'
                    }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: '#9C27B0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {volunteer.initial}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {volunteer.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {volunteer.location}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                          {volunteer.points} pts
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {volunteer.deliveries} deliveries
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Top Partner Stores */}
            <Card sx={{ 
              flex: '1 1 400px', 
              minWidth: '400px',
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ fontSize: 24, color: '#2196F3', mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Top Partner Stores
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                  Leading businesses reducing waste.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {topStores.map((store, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: index === 0 ? '#f8f9fa' : 'transparent',
                      border: index === 0 ? '1px solid #e0e0e0' : 'none'
                    }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: '#2196F3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {store.initial}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {store.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {store.packages} packages
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                          {store.wasteReduced} lbs
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {store.co2Reduced} lbs CO₂e
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Cities Tab */}
        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ fontSize: 24, color: '#9C27B0', mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Cities Making an Impact
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                See how different cities are contributing to the movement
              </Typography>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: 3 
              }}>
                {citiesImpact.map((city, index) => (
                  <Card key={index} sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    p: 3,
                    border: '1px solid #f0f0f0'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#9C27B0', 
                        mr: 2,
                        width: 48,
                        height: 48,
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}>
                        {city.initial}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {city.name}
                        </Typography>
                        <Chip 
                          label={`#${city.rank} by impact`} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#f5f5f5', 
                            color: '#666',
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }} 
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography variant="body2">
                        Volunteers: <Typography component="span" sx={{ fontWeight: 'bold' }}>{city.volunteers}</Typography>
                      </Typography>
                      <Typography variant="body2">
                        Partner Stores: <Typography component="span" sx={{ fontWeight: 'bold' }}>{city.partnerStores}</Typography>
                      </Typography>
                      <Typography variant="body2">
                        Food Saved: <Typography component="span" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>{city.foodSaved}</Typography>
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Trends Tab */}
        {activeTab === 3 && (
          <Box>
            {/* Header Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ fontSize: 24, color: '#4CAF50', mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Growth Trends
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
              Platform growth and impact over time
            </Typography>

            {/* Main Chart Placeholder */}
            <Card sx={{ 
              borderRadius: 3, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
              mb: 4,
              minHeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <TrendingUp sx={{ fontSize: 80, color: '#ddd', mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#666' }}>
                  Interactive Charts Coming Soon!
                </Typography>
                <Typography variant="body1" sx={{ color: '#999' }}>
                  Growth trends, forecasting, and detailed analytics
                </Typography>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Card sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                bgcolor: '#e8f5e8',
                border: '1px solid #c8e6c9'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                    +23%
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                    Growth this month
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                bgcolor: '#e3f2fd',
                border: '1px solid #bbdefb'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565c0', mb: 1 }}>
                    1.2K
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
                    New volunteers this week
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{
                flex: '1 1 200px',
                minWidth: '200px',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                bgcolor: '#f3e5f5',
                border: '1px solid #e1bee7'
              }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2', mb: 1 }}>
                    89
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                    New stores this month
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FoodBankGlobalImpact;
