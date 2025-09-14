import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, PartyPopper, Utensils, Coffee, Sandwich, Book, Coffee as DrinkIcon, ShoppingCart, Bus, Leaf, Leaf as LeafIcon, ClipboardList, CreditCard, ShoppingBag, Ticket, Percent, Receipt, DollarSign } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { 
  Logout,
  Star
} from '@mui/icons-material';

const VolunteerRewards: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [points, setPoints] = useState(1250);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const availableRewards = [
    {
      id: 1,
      icon: "utensils",
      title: "20% Off Next Meal",
      provider: "Campus Café",
      description: "Get 20% off your next meal at Campus Café",
      points: 200
    },
    {
      id: 2,
      icon: "coffee",
      title: "Free Coffee",
      provider: "Dunkin",
      description: "Redeem for one free medium coffee",
      points: 150
    },
    {
      id: 3,
      icon: "dollar-sign",
      title: "$5 Off Order",
      provider: "Chipotle",
      description: "$5 off your next Chipotle order",
      points: 300
    },
    {
      id: 4,
      icon: "ticket",
      title: "Free Movie Ticket",
      provider: "AMC Theatres",
      description: "One free standard movie ticket",
      points: 500
    },
    {
      id: 5,
      icon: "book",
      title: "15% Off Books",
      provider: "Harvard Book Store",
      description: "15% off any book purchase",
      points: 250
    },
    {
      id: 6,
      icon: "coffee",
      title: "Free Smoothie",
      provider: "Jamba Juice",
      description: "One free 16oz smoothie",
      points: 180
    },
    {
      id: 7,
      icon: "receipt",
      title: "$10 Off Grocery",
      provider: "Whole Foods",
      description: "$10 off your grocery purchase",
      points: 400
    },
    {
      id: 8,
      icon: "bus",
      title: "Free Transit Day Pass",
      provider: "MBTA",
      description: "One day unlimited MBTA pass",
      points: 120
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRedeem = (reward: any) => {
    if (points >= reward.points) {
      setSelectedReward(reward);
      setConfirmDialogOpen(true);
    } else {
      alert("Not enough points to redeem this reward!");
    }
  };

  const handleConfirmRedemption = () => {
    setConfirmDialogOpen(false);
    setLoadingDialogOpen(true);
    
    // Simulate loading time
    setTimeout(() => {
      setLoadingDialogOpen(false);
      setPoints(points - selectedReward.points);
      setSuccessDialogOpen(true);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setSuccessDialogOpen(false);
    setSelectedReward(null);
  };

  const handleCloseConfirm = () => {
    setConfirmDialogOpen(false);
    setSelectedReward(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("SAVE20");
    // Could add a toast notification here
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header/Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mr: 1 }}>
              Waste→Worth
            </Typography>
            <Leaf size={20} style={{ color: 'white' }} />
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
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
              }}
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
              onClick={() => navigate('/volunteer/global-impact')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Global Impact
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Marcus Chen Level 3
            </Typography>
            <Chip 
              label={`${points} pts`} 
              sx={{ 
                backgroundColor: '#FFF9C4', 
                color: '#F57F17',
                fontWeight: 'bold'
              }} 
            />
            <IconButton onClick={handleLogout} color="inherit">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Available Points Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
          p: 4,
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Available Points
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
              {points}
            </Typography>
          </Box>
          <Star sx={{ fontSize: 60, opacity: 0.8 }} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ backgroundColor: 'white', px: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ 
            '& .MuiTab-root': { 
              textTransform: 'none',
              fontWeight: 'bold'
            }
          }}
        >
          <Tab label="Available Rewards" />
          <Tab label={`My Rewards (0)`} />
        </Tabs>
      </Box>

      {/* Rewards Grid */}
      <Box sx={{ p: 3 }}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 3 
          }}
        >
          {availableRewards.map((reward) => (
            <Card key={reward.id} sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    backgroundColor: '#e8f5e8',
                    borderRadius: 2,
                    color: '#4CAF50'
                  }}>
                    {reward.icon === 'utensils' && <Utensils size={24} />}
                    {reward.icon === 'coffee' && <Coffee size={24} />}
                    {reward.icon === 'gift' && <Gift size={24} />}
                    {reward.icon === 'book' && <Book size={24} />}
                    {reward.icon === 'shopping-cart' && <ShoppingCart size={24} />}
                    {reward.icon === 'bus' && <Bus size={24} />}
                    {reward.icon === 'leaf' && <Leaf size={24} />}
                    {reward.icon === 'credit-card' && <CreditCard size={24} />}
                    {reward.icon === 'shopping-bag' && <ShoppingBag size={24} />}
                    {reward.icon === 'ticket' && <Ticket size={24} />}
                    {reward.icon === 'receipt' && <Receipt size={24} />}
                    {reward.icon === 'dollar-sign' && <DollarSign size={24} />}
                  </Box>
                  <Chip 
                    label={`${reward.points} points`}
                    size="small"
                    sx={{ 
                      backgroundColor: '#4CAF50', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {reward.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {reward.provider}
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                  {reward.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={() => handleRedeem(reward)}
                    disabled={points < reward.points}
                    sx={{
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45a049' },
                      '&:disabled': { backgroundColor: '#E0E0E0' }
                    }}
                  >
                    Redeem
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Gift size={20} style={{ marginRight: '8px' }} />
            <Typography variant="h6">Redeem Reward</Typography>
          </Box>
          <IconButton onClick={handleCloseConfirm} size="small">
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Confirm you want to redeem this reward.
          </Typography>
          
          {selectedReward && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {selectedReward.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedReward.provider}
              </Typography>
              <Chip 
                label={`${selectedReward.points} points`}
                sx={{ backgroundColor: '#4CAF50', color: 'white' }}
              />
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            You currently have <strong>{points} points</strong>. After redeeming this reward, you'll have <strong>{selectedReward ? points - selectedReward.points : points} points</strong> remaining.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseConfirm} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmRedemption} 
            variant="contained"
            sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
          >
            Confirm Redemption
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog open={loadingDialogOpen} onClose={() => {}} maxWidth="xs" fullWidth>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <CircularProgress size={20} />
            <Typography>Redeeming reward...</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleCloseSuccess} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            Reward Redeemed! <PartyPopper size={20} style={{ marginLeft: '8px' }} />
          </Typography>
          <IconButton onClick={handleCloseSuccess} size="small">
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '2rem' }}>✓</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your {selectedReward?.title} is ready to use
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Your coupon code:
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                border: '2px solid #e0e0e0'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                SAVE20
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleCopyCode}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                📋
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Show this code to {selectedReward?.provider} to redeem your reward.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleCloseSuccess} 
            variant="contained"
            fullWidth
            sx={{ backgroundColor: '#424242', '&:hover': { backgroundColor: '#303030' } }}
          >
            Continue Earning Points
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VolunteerRewards;
