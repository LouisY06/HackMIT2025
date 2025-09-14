import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Trophy, PartyPopper } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';

const VolunteerGlobalImpact: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // Default to "Overview"

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mr: 1 }}>
              Waste→Worth
            </Typography>
            <Typography sx={{ color: 'white' }}>🌿</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/dashboard')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Dashboard
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/find-pickups')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Find Tasks
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/rewards')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Rewards
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/volunteer/leaderboard')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Leaderboard
            </Button>
            <Button 
              color="inherit" 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              Global Impact
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Marcus Chen Level 3
            </Typography>
            <Chip 
              label="1250 pts" 
              sx={{ 
                backgroundColor: '#FFF9C4', 
                color: '#F57F17',
                fontWeight: 'bold'
              }} 
            />
            <IconButton onClick={handleLogout} color="inherit">
              🚪
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontSize: 80, mb: 2 }}>🌍</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Global Impact Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            See how the Waste→Worth community is transforming food waste into community impact across the world
          </Typography>
        </Box>

        {/* Key Metrics Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Leaf size={40} style={{ marginBottom: '16px' }} />
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                58.0M
              </Typography>
              <Typography variant="h6">
                lbs Food Saved
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography sx={{ fontSize: 40, mb: 2 }}>🌳</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                25.5M
              </Typography>
              <Typography variant="h6">
                lbs CO₂ Prevented
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography sx={{ fontSize: 40, mb: 2 }}>👥</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                2.3M
              </Typography>
              <Typography variant="h6">
                Meals Provided
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #673AB7 0%, #9575CD 100%)', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography sx={{ fontSize: 40, mb: 2 }}>🏪</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                $1.2M
              </Typography>
              <Typography variant="h6">
                Cost Saved
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="Overview" />
            <Tab label="Leaderboards" />
            <Tab label="Cities" />
            <Tab label="Trends" />
          </Tabs>
        </Box>

        {/* Content Below Tabs */}
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left Column - Environmental Impact */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Environmental Impact
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Our collective contribution to the planet
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Card sx={{ backgroundColor: '#E8F5E8', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: 30 }}>🚗</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    28.7M miles not driven
                  </Typography>
                </Box>
              </Card>

              <Card sx={{ backgroundColor: '#E3F2FD', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: 30 }}>💧</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    1450.0M gallons water saved
                  </Typography>
                </Box>
              </Card>

              <Card sx={{ backgroundColor: '#F3E5F5', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: 30 }}>🌲</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    531.7K trees planted equivalent
                  </Typography>
                </Box>
              </Card>

              <Card sx={{ backgroundColor: '#FFF8E1', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography sx={{ fontSize: 30 }}>🏠</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    1.6K homes powered for a year
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 1 }}>
            {/* Network Statistics */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Network Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Our growing community
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 4 }}>
              <Card sx={{ backgroundColor: '#E3F2FD', p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3', mb: 1 }}>
                  12.5K
                </Typography>
                <Typography variant="body2">
                  Active Volunteers
                </Typography>
              </Card>

              <Card sx={{ backgroundColor: '#E8F5E8', p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                  850
                </Typography>
                <Typography variant="body2">
                  Partner Stores
                </Typography>
              </Card>

              <Card sx={{ backgroundColor: '#F3E5F5', p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 1 }}>
                  150
                </Typography>
                <Typography variant="body2">
                  Food Banks
                </Typography>
              </Card>

              <Card sx={{ backgroundColor: '#FFF8E1', p: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800', mb: 1 }}>
                  25
                </Typography>
                <Typography variant="body2">
                  Cities Served
                </Typography>
              </Card>
            </Box>

            {/* Recent Milestones */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Recent Milestones
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Latest achievements from our community
            </Typography>
            
            <Card sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Trophy size={20} />
                  <Typography variant="body1">
                    Reached 50M lbs food saved!
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PartyPopper size={20} />
                  <Typography variant="body1">
                    2M meals milestone achieved
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PartyPopper size={20} />
                  <Typography variant="body1">
                    10K volunteers joined the movement
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VolunteerGlobalImpact;

