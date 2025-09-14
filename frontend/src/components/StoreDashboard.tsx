import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Leaf, DollarSign, Clock } from 'lucide-react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
// Icons removed - using text placeholders

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

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
              Waste→Worth
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => navigate('/store/dashboard')}
              variant="contained"
              sx={{
                color: 'white',
                backgroundColor: '#4CAF50',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
              }}
            >
              Dashboard
            </Button>
            <Button
              onClick={handleCreatePackage}
              variant="text"
              sx={{
                color: '#666',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Create Package
            </Button>
            <Button
              onClick={handleViewPackages}
              variant="text"
              sx={{
                color: '#666',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Packages
            </Button>
            <Button
              onClick={handleImpactReport}
              variant="text"
              sx={{
                color: '#666',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Impact
            </Button>
            <Button
              onClick={handleGlobalImpact}
              variant="text"
              sx={{
                color: '#666',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              Global Impact
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {storeData.owner}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Partner
            </Typography>
          </Box>
          <IconButton onClick={handleLogout}>
            [Logout]
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back, {storeData.owner}!
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            {storeData.name} • Making a difference through food waste reduction
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Package size={40} style={{ color: '#2196F3', marginBottom: '8px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {storeData.activePackages}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Active Packages
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }}>[✓]</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {storeData.todaysPickups}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Today's Pickups
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Leaf size={40} style={{ color: '#4CAF50', marginBottom: '8px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {storeData.wasteDiverted} lbs
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Waste Diverted
                </Typography>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card sx={{ height: '100%', borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <DollarSign size={40} style={{ color: '#FF9800', marginBottom: '8px' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ${storeData.costSaved}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Cost Saved
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Left Column */}
          <Box sx={{ flex: '2 1 600px', minWidth: '300px' }}>
            {/* Quick Actions */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Typography>[+]</Typography>}
                      onClick={handleCreatePackage}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Create Package
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          List new surplus food for pickup
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Typography>[👁]</Typography>}
                      onClick={handleViewPackages}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        borderColor: '#2196F3',
                        color: '#2196F3',
                        '&:hover': {
                          borderColor: '#1976D2',
                          backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          View Packages
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Manage all listed packages
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Typography>[📊]</Typography>}
                      onClick={handleImpactReport}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        borderColor: '#9C27B0',
                        color: '#9C27B0',
                        '&:hover': {
                          borderColor: '#7B1FA2',
                          backgroundColor: 'rgba(156, 39, 176, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Impact Report
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          View sustainability metrics
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Typography>[📈]</Typography>}
                      onClick={handleGlobalImpact}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.04)',
                        },
                      }}
                    >
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          Global Impact
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          See platform-wide impact
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Your Environmental Impact
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  See how {storeData.name} is making a difference
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                      {storeData.co2Prevented} lbs
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      CO₂e prevented
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3', mb: 1 }}>
                      {storeData.mealsProvided}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      meals provided
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 1 }}>
                      {storeData.familiesHelped}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      families helped
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            {/* Recent Activity */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Recent Activity
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Latest activity on your packages
                </Typography>
                
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Package size={80} style={{ color: '#ccc', marginBottom: '16px' }} />
                  <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                    No recent activity
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    Create your first package to get started
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleViewPackages}
                    sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
                  >
                    View All Packages
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Typography sx={{ color: '#666', fontSize: 24 }}>[👥]</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Community Impact
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ color: '#4CAF50' }}>[🚚]</Typography>
                    <Typography variant="body1">
                      Volunteers helped {storeData.volunteersHelped}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ color: '#2196F3' }}>[🍽️]</Typography>
                    <Typography variant="body1">
                      Food banks served {storeData.foodBanksServed}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Clock size={16} style={{ color: '#FF9800' }} />
                    <Typography variant="body1">
                      Average pickup time {storeData.avgPickupTime} min
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StoreDashboard;
