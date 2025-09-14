import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
            <Leaf size={20} style={{ marginRight: '8px' }} /> Waste→Worth
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button onClick={() => navigate('/store/dashboard')} sx={{ color: '#666' }}>
              <Home size={16} style={{ marginRight: '4px' }} /> Dashboard
            </Button>
            <Button onClick={() => navigate('/store/create-package')} sx={{ color: '#666' }}>
              + Create Package
            </Button>
            <Button onClick={() => navigate('/store/packages')} sx={{ color: '#666' }}>
              <Package size={16} style={{ marginRight: '4px' }} /> Packages
            </Button>
            <Button onClick={() => navigate('/store/impact')} sx={{ color: '#666' }}>
              <BarChart3 size={16} style={{ marginRight: '4px' }} /> Impact
            </Button>
            <Button sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              <TrendingUp size={16} style={{ marginRight: '4px' }} /> Global Impact
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Sarah Williams
          </Typography>
          <Button sx={{ color: '#666' }}>
            Partner
          </Button>
          <Button onClick={() => navigate('/store')} sx={{ color: '#666' }}>
            <LogOut size={16} style={{ marginRight: '4px' }} /> Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2,
              }}
            >
              <Globe size={40} style={{ color: 'white' }} />
            </Box>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            Global Impact Dashboard
          </Typography>
          <Typography variant="h6" sx={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
            See how the Waste→Worth community is transforming food waste into community impact across the world.
          </Typography>
        </Box>

        {/* Global KPI Cards */}
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
                {globalData.foodSaved}M
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
                <Trees size={24} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalData.co2Prevented}M
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
            background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
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
                <Users size={24} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                {globalData.mealsProvided}M
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
            background: 'linear-gradient(135deg, #673AB7 0%, #E91E63 100%)',
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
                <Store size={24} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                ${globalData.costSaved}M
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Cost Saved
              </Typography>
            </CardContent>
          </Card>
        </Box>

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
              label="Leaderboards" 
              sx={{ 
                textTransform: 'none',
                fontWeight: activeTab === 1 ? 'bold' : 'normal',
                color: activeTab === 1 ? '#4CAF50' : '#666',
                '&.Mui-selected': { color: '#4CAF50' }
              }} 
            />
            <Tab 
              label="Cities" 
              sx={{ 
                textTransform: 'none',
                fontWeight: activeTab === 2 ? 'bold' : 'normal',
                color: activeTab === 2 ? '#4CAF50' : '#666',
                '&.Mui-selected': { color: '#4CAF50' }
              }} 
            />
            <Tab 
              label="Trends" 
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
            <Card sx={{ flex: '1 1 400px', minWidth: '400px', borderRadius: 4, bgcolor: 'white' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                    Environmental Impact
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Our collective contribution to the planet
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Miles Not Driven */}
                  <Card sx={{ borderRadius: 3, bgcolor: '#E8F5E8', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Car size={24} style={{ color: '#4CAF50' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {globalData.milesNotDriven}M miles not driven
                      </Typography>
                    </Box>
                  </Card>

                  {/* Water Saved */}
                  <Card sx={{ borderRadius: 3, bgcolor: '#E3F2FD', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Droplets size={24} style={{ color: '#2196F3' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {globalData.waterSaved}M gallons water saved
                      </Typography>
                    </Box>
                  </Card>

                  {/* Trees Equivalent */}
                  <Card sx={{ borderRadius: 3, bgcolor: '#F3E5F5', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TreePine size={24} style={{ color: '#9C27B0' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {globalData.treesEquivalent}K trees planted equivalent
                      </Typography>
                    </Box>
                  </Card>

                  {/* Homes Powered */}
                  <Card sx={{ borderRadius: 3, bgcolor: '#FFF8E1', p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Building size={24} style={{ color: '#FF9800' }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {globalData.homesPowered}K homes powered for a year
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              </CardContent>
            </Card>

            {/* Right Column */}
            <Box sx={{ flex: '1 1 400px', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Network Statistics Section */}
              <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                      Network Statistics
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Our growing community
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Card sx={{ borderRadius: 3, bgcolor: '#E3F2FD', p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3', mb: 0.5 }}>
                        {globalData.activeVolunteers}K
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Active Volunteers
                      </Typography>
                    </Card>
                    <Card sx={{ borderRadius: 3, bgcolor: '#E8F5E8', p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 0.5 }}>
                        {globalData.partnerStores}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Partner Stores
                      </Typography>
                    </Card>
                    <Card sx={{ borderRadius: 3, bgcolor: '#F3E5F5', p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 0.5 }}>
                        {globalData.foodBanks}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Food Banks
                      </Typography>
                    </Card>
                    <Card sx={{ borderRadius: 3, bgcolor: '#FFF8E1', p: 2, textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800', mb: 0.5 }}>
                        {globalData.citiesServed}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Cities Served
                      </Typography>
                    </Card>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Milestones Section */}
              <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}>
                    Recent Milestones
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: '#4CAF50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trophy size={12} style={{ color: 'white' }} />
                      </Box>
                      <Typography variant="body1" sx={{ color: '#333' }}>
                        Reached 50M lbs food saved!
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: '#2196F3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trophy size={12} style={{ color: 'white' }} />
                      </Box>
                      <Typography variant="body1" sx={{ color: '#333' }}>
                        2M meals milestone achieved
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: '#9C27B0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trophy size={12} style={{ color: 'white' }} />
                      </Box>
                      <Typography variant="body1" sx={{ color: '#333' }}>
                        10K volunteers joined the movement
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* Other Tabs Content */}
        {activeTab === 1 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'white', p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Leaderboards
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Store and volunteer leaderboards will be displayed here. Coming soon!
            </Typography>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'white', p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Cities
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              City-wise impact statistics and maps will be displayed here. Coming soon!
            </Typography>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 4, bgcolor: 'white', p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Trends
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Trend analysis and growth charts will be displayed here. Coming soon!
            </Typography>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default StoreGlobalImpact;
