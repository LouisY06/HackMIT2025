import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
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
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocalShipping,
  TrendingUp,
  CheckCircle,
  History,
  Assessment,
  Person,
  ExitToApp,
} from '@mui/icons-material';

const FoodBankDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Real data from API
  const [kpiData, setKpiData] = useState({
    todayDeliveries: 0,
    foodReceived: '0 lbs today',
    activeVolunteers: 0,
    co2Prevented: '0 lbs CO₂e prevented',
    mealsProvided: '0 meals provided',
    familiesHelped: '0 families helped',
  });

  const [recentDeliveries, setRecentDeliveries] = useState<any[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchFoodBankData();
  }, []);

  // Fetch real data from API
  const fetchFoodBankData = async () => {
    try {
      // Fetch completed packages (delivered to food bank)
      const response = await fetch('https://hackmit2025-production.up.railway.app/api/packages/available');
      const data = await response.json();
      
      if (data.success) {
        const allPackages = data.packages;
        const completedPackages = allPackages.filter((pkg: any) => pkg.status === 'completed');
        
        // Calculate metrics
        const todayCompleted = completedPackages.filter((pkg: any) => {
          const completedDate = new Date(pkg.pickup_completed_at || pkg.created_at);
          const today = new Date();
          return completedDate.toDateString() === today.toDateString();
        });
        
        const totalWeight = todayCompleted.reduce((sum: number, pkg: any) => sum + pkg.weight_lbs, 0);
        const mealsProvided = Math.round(totalWeight * 0.8); // ~0.8 meals per lb
        const co2Prevented = Math.round(totalWeight * 0.44); // ~0.44 lbs CO2 per lb food
        
        setKpiData({
          todayDeliveries: todayCompleted.length,
          foodReceived: `${totalWeight.toFixed(1)} lbs today`,
          activeVolunteers: new Set(completedPackages.map((pkg: any) => pkg.volunteer_id)).size,
          co2Prevented: `${co2Prevented} lbs CO₂e prevented`,
          mealsProvided: `${mealsProvided} meals provided`,
          familiesHelped: `${Math.round(mealsProvided / 3)} families helped`,
        });
        
        // Set recent deliveries
        setRecentDeliveries(completedPackages.slice(0, 5).map((pkg: any) => ({
          volunteer: pkg.volunteer_id ? `Volunteer ${pkg.volunteer_id.slice(0, 8)}` : 'Anonymous',
          store: pkg.store_name,
          weight: `${pkg.weight_lbs} lbs`,
          status: 'completed'
        })));
      }
    } catch (error) {
      console.error('Failed to fetch food bank data:', error);
    }
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
              sx={{
                bgcolor: '#4CAF50',
                color: 'white',
                px: 3,
                borderRadius: 2,
                '&:hover': { bgcolor: '#45a049' },
              }}
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
              sx={{ color: '#666', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/foodbank/global-impact')}
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
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome, Lisa Rodriguez!
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Cambridge Food Bank • Verify incoming food deliveries
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Card sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                {kpiData.todayDeliveries || 0}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
                Today's Deliveries
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: '#9C27B0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>F</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                {kpiData.foodReceived || '0 lbs today'}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
                Food Received
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: '#9C27B0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}>
                <Person sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                {kpiData.activeVolunteers || 0}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
                Active Volunteers
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 200px', minWidth: '200px', maxWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={40} style={{ color: '#4CAF50', marginBottom: '16px' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
                {kpiData.co2Prevented ? kpiData.co2Prevented.split(' ')[0] : '0'} lbs
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
                CO₂ Prevented
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Left Column - Scanner */}
          <Box sx={{ flex: '2 1 600px', minWidth: '500px' }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Package Delivery Management
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Manage incoming food deliveries with PIN verification system
                </Typography>

                {/* PIN Delivery Section */}
                <Box sx={{
                  width: '100%',
                  bgcolor: '#f8f9fa',
                  border: '2px solid #4CAF50',
                  borderRadius: 3,
                  p: 4,
                  mb: 3,
                  textAlign: 'center'
                }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 2 }}>
                      📦 PIN-Based Delivery System
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                      When volunteers arrive with packages, use the PIN verification system to confirm deliveries quickly and securely.
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/foodbank/delivery-confirm')}
                    sx={{ 
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45a049' },
                      borderRadius: 3,
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    📦 Confirm PIN Delivery
                  </Button>
                </Box>

                {/* Instructions */}
                <Box sx={{ backgroundColor: '#E3F2FD', borderRadius: 2, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976D2' }}>
                    📋 How it works:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#1976D2', minWidth: '20px' }}>1.</Typography>
                      Volunteer arrives with package
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#1976D2', minWidth: '20px' }}>2.</Typography>
                      Ask for <strong>Package ID</strong> and <strong>4-digit PIN</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#1976D2', minWidth: '20px' }}>3.</Typography>
                      Click "Confirm PIN Delivery" and enter the details
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography component="span" sx={{ fontWeight: 'bold', color: '#4CAF50', minWidth: '20px' }}>4.</Typography>
                      <strong>Package confirmed</strong> - delivery complete! ✅
                    </Typography>
                  </Box>
                </Box>

              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Quick Actions */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<History />}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                      onClick={() => navigate('/foodbank/delivery-log')}
                    >
                      View Delivery Log
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Assessment />}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                      onClick={() => navigate('/store/global-impact')}
                    >
                      Global Impact
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<QrCodeScanner />}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                      onClick={handleResetScanner}
                    >
                      Reset Scanner
                    </Button>
                  </Box>
                </CardContent>
              </Card>


              {/* How to Verify */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUp sx={{ color: '#4CAF50', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      How to Verify
                    </Typography>
                  </Box>
                  
                  <Box component="ol" sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Ask volunteer to show their delivery QR code
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Position code within scanner frame
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Wait for automatic verification
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Confirm package details match
                    </Typography>
                    <Typography component="li" variant="body2">
                      Welcome food delivery to your facility!
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Deliveries */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Recent Deliveries
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentDeliveries.map((delivery, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        bgcolor: '#f9f9f9',
                        borderRadius: 2
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {delivery.volunteer} • {delivery.store}
                          </Typography>
                        </Box>
                        <Chip 
                          label={delivery.weight} 
                          size="small"
                          sx={{ 
                            bgcolor: '#4CAF50', 
                            color: 'white',
                            fontWeight: 'bold'
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>


      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default FoodBankDashboard;

