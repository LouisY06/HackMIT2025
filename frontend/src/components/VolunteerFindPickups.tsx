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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { 
  ArrowBack, 
  FilterList, 
  LocationOn, 
  Person,
  Logout 
} from '@mui/icons-material';

const VolunteerFindPickups: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [foodType, setFoodType] = useState('All Types');
  const [maxDistance, setMaxDistance] = useState('Any Distance');
  const [sortBy, setSortBy] = useState('Distance');

  // Mock data for available pickups
  const availablePickups = [
    {
      id: 1,
      storeName: "Flour Bakery",
      storeInitial: "F",
      points: 104,
      distance: "0.9 mi",
      timeWindow: "2:00 PM - 6:00 PM",
      foodType: "Pastries & Bread",
      instruction: "Handle with care - contains delicate pastries",
      weight: "5.2 lbs",
      duration: "~30 min",
      co2Saved: "2.3 lbs CO₂e saved",
      destination: "Cambridge Food Bank",
      destinationAddress: "1234 Main St, Cambridge, MA",
      expiresSoon: true,
      timeLeft: "Expires soon"
    },
    {
      id: 2,
      storeName: "Green Garden Restaurant",
      storeInitial: "G",
      points: 142,
      distance: "1.9 mi",
      timeWindow: "4:00 PM - 8:00 PM",
      foodType: "Prepared Meals",
      instruction: "Keep refrigerated during transport",
      weight: "7.1 lbs",
      duration: "~30 min",
      co2Saved: "3.1 lbs CO₂e saved",
      destination: "Cambridge Food Bank",
      destinationAddress: "1234 Main St, Cambridge, MA",
      expiresSoon: false,
      timeLeft: "1h left"
    }
  ];

  const handleAcceptMission = (pickupId: number) => {
    console.log(`Accepting mission ${pickupId}`);
    // Navigate to mission details or start mission
  };

  const handleViewDetails = (pickupId: number) => {
    console.log(`Viewing details for mission ${pickupId}`);
    // Navigate to detailed mission view
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header/Navigation */}
      <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold', mr: 1 }}>
              Waste→Worth
            </Typography>
            <Typography sx={{ color: '#4CAF50' }}>🌿</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <Button color="inherit" onClick={() => navigate('/volunteer/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              📱 Find Tasks
            </Button>
            <Button color="inherit">Rewards</Button>
            <Button color="inherit">Leaderboard</Button>
            <Button color="inherit">Global Impact</Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Marcus Chen Level 3 1250 pts
            </Typography>
            <IconButton onClick={handleLogout} color="primary">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Left Sidebar - Filters and Map */}
        <Box sx={{ width: '350px', backgroundColor: 'white', p: 3, borderRight: '1px solid #e0e0e0' }}>
          {/* Filters Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FilterList sx={{ mr: 1, color: '#4CAF50' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Filters
              </Typography>
            </Box>

            <TextField
              fullWidth
              placeholder="🔍 Store or food type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
              size="small"
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Food Type</InputLabel>
              <Select
                value={foodType}
                label="Food Type"
                onChange={(e) => setFoodType(e.target.value)}
                size="small"
              >
                <MenuItem value="All Types">All Types</MenuItem>
                <MenuItem value="Pastries & Bread">Pastries & Bread</MenuItem>
                <MenuItem value="Prepared Meals">Prepared Meals</MenuItem>
                <MenuItem value="Produce">Produce</MenuItem>
                <MenuItem value="Dairy">Dairy</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Max Distance</InputLabel>
              <Select
                value={maxDistance}
                label="Max Distance"
                onChange={(e) => setMaxDistance(e.target.value)}
                size="small"
              >
                <MenuItem value="Any Distance">Any Distance</MenuItem>
                <MenuItem value="1 mile">1 mile</MenuItem>
                <MenuItem value="3 miles">3 miles</MenuItem>
                <MenuItem value="5 miles">5 miles</MenuItem>
                <MenuItem value="10 miles">10 miles</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                size="small"
              >
                <MenuItem value="Distance">Distance</MenuItem>
                <MenuItem value="Points">Points</MenuItem>
                <MenuItem value="Time">Time</MenuItem>
                <MenuItem value="Weight">Weight</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Map View Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn sx={{ mr: 1, color: '#4CAF50' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Map View
              </Typography>
            </Box>
            
            <Box
              sx={{
                height: '300px',
                backgroundColor: '#f0f0f0',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #ccc',
                position: 'relative'
              }}
            >
              <LocationOn sx={{ fontSize: 60, color: '#ccc', mb: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Interactive map coming soon!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Showing {availablePickups.length} nearby pickups
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Main Content - Available Pickups */}
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            {availablePickups.length} Packages Available
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {availablePickups.map((pickup) => (
              <Card key={pickup.id} sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Store Avatar */}
                    <Avatar sx={{ backgroundColor: '#2196F3', width: 48, height: 48 }}>
                      {pickup.storeInitial}
                    </Avatar>

                    {/* Main Content */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {pickup.storeName}
                        </Typography>
                        <Chip 
                          label={`+${pickup.points} points`}
                          sx={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold' }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {pickup.distance} • {pickup.timeWindow}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip label={pickup.foodType} size="small" variant="outlined" />
                      </Box>

                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                        {pickup.instruction}
                      </Typography>

                      {/* Metrics */}
                      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          📦 {pickup.weight}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ⏱️ {pickup.duration}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🌱 {pickup.co2Saved}
                        </Typography>
                      </Box>

                      {/* Delivery Destination */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          Delivery destination
                        </Typography>
                        <Typography variant="body2">
                          {pickup.destination}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pickup.destinationAddress}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#4CAF50',
                            '&:hover': { backgroundColor: '#388E3C' }
                          }}
                          onClick={() => handleAcceptMission(pickup.id)}
                        >
                          Accept Mission
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleViewDetails(pickup.id)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VolunteerFindPickups;
