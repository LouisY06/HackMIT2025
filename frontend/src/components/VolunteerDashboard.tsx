import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Badge,
} from '@mui/material';
import { LocalShipping } from '@mui/icons-material';

const VolunteerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [points, setPoints] = useState(1250);
  const [completedPickups, setCompletedPickups] = useState(23);
  const [foodSaved, setFoodSaved] = useState(156); // in pounds
  const [co2Reduced, setCo2Reduced] = useState(89); // in kg

  // Mock data for pickup locations
  const pickupLocations = [
    {
      id: 1,
      name: "Whole Foods Market",
      address: "123 Main St, Cambridge, MA",
      distance: "0.8 mi",
      items: ["Bread", "Vegetables", "Dairy"],
      points: 50,
      status: "available"
    },
    {
      id: 2,
      name: "Trader Joe's",
      address: "456 Mass Ave, Cambridge, MA",
      distance: "1.2 mi",
      items: ["Fruits", "Bakery", "Prepared Foods"],
      points: 75,
      status: "available"
    },
    {
      id: 3,
      name: "Stop & Shop",
      address: "789 Broadway, Cambridge, MA",
      distance: "2.1 mi",
      items: ["Meat", "Dairy", "Produce"],
      points: 60,
      status: "in_progress"
    }
  ];

  // Mock data for leaderboard
  const leaderboard = [
    { rank: 1, name: "Sarah Chen", points: 2840, avatar: "SC" },
    { rank: 2, name: "Mike Johnson", points: 2650, avatar: "MJ" },
    { rank: 3, name: "You", points: 1250, avatar: "You" },
    { rank: 4, name: "Emma Wilson", points: 1180, avatar: "EW" },
    { rank: 5, name: "Alex Brown", points: 950, avatar: "AB" }
  ];

  // Mock data for rewards
  const rewards = [
    { id: 1, name: "Free Coffee", cost: 100, icon: "☕" },
    { id: 2, name: "Gift Card $10", cost: 500, icon: "💳" },
    { id: 3, name: "Restaurant Voucher", cost: 750, icon: "🍽️" },
    { id: 4, name: "Eco-friendly Tote", cost: 300, icon: "🛍️" }
  ];

  const handleQRScan = (locationId: number) => {
    // Mock QR scan functionality
    console.log(`Scanning QR code for location ${locationId}`);
    // In real app, this would open camera for QR scanning
  };

  const handleRedeemReward = (rewardId: number, cost: number) => {
    if (points >= cost) {
      setPoints(points - cost);
      console.log(`Redeemed reward ${rewardId}`);
    } else {
      alert("Not enough points!");
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', p: 2 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        p: 2,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
            Volunteer Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Ready to make an impact?
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${points} points`} 
            color="primary" 
            sx={{ 
              backgroundColor: '#4CAF50', 
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }} 
          />
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Column - Pickup Locations */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Available Pickups
                </Typography>
              </Box>
              
              <List>
                {pickupLocations.map((location, index) => (
                  <React.Fragment key={location.id}>
                    <ListItem 
                      sx={{ 
                        backgroundColor: location.status === 'in_progress' ? '#fff3e0' : 'white',
                        borderRadius: 2,
                        mb: 1,
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#4CAF50' }}>
                          <LocalShipping />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {location.name}
                            </Typography>
                            <Chip 
                              label={`${location.points} pts`} 
                              size="small" 
                              sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                📍 {location.address} • {location.distance}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                              {location.items.map((item, idx) => (
                                <Chip key={idx} label={item} size="small" variant="outlined" />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                onClick={() => handleQRScan(location.id)}
                                sx={{ 
                                  backgroundColor: '#4CAF50',
                                  '&:hover': { backgroundColor: '#388E3C' }
                                }}
                                size="small"
                              >
                                📱 Scan QR
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                              >
                                🔄 Refresh
                              </Button>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < pickupLocations.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column - Quick Actions */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Quick Actions
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  backgroundColor: '#4CAF50',
                  mb: 2,
                  '&:hover': { backgroundColor: '#388E3C' }
                }}
              >
                📱 Scan QR Code
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                onClick={() => navigate('/volunteer/find-pickups')}
              >
                📍 Find Nearby Pickups
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Bottom Left - Impact Metrics */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Your Impact
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e8', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                    {completedPickups}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pickups Completed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {foodSaved}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    lbs Food Saved
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f3e5f5', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
                    {co2Reduced}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kg CO₂ Reduced
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff3e0', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    {Math.round(foodSaved * 0.8)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meals Provided
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bottom Right - Rewards & Leaderboard */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Rewards */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    🎁 Rewards
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                  {rewards.map((reward) => (
                    <Card 
                      key={reward.id}
                      sx={{ 
                        p: 1, 
                        cursor: 'pointer',
                        border: points >= reward.cost ? '2px solid #4CAF50' : '1px solid #e0e0e0',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                      onClick={() => handleRedeemReward(reward.id, reward.cost)}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                          {reward.icon}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {reward.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reward.cost} pts
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    🏆 Leaderboard
                  </Typography>
                </Box>
                <List dense>
                  {leaderboard.map((user, index) => (
                    <ListItem key={user.rank} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            backgroundColor: user.rank <= 3 ? '#ff9800' : '#4CAF50',
                            width: 32,
                            height: 32,
                            fontSize: '0.8rem'
                          }}
                        >
                          {user.rank}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`${user.points} points`}
                      />
                      {user.rank <= 3 && (
                        <Typography sx={{ color: '#ff9800', fontSize: 20 }}>🏆</Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VolunteerDashboard;
