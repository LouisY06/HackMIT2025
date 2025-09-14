import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Coffee,
  Utensils,
  ShoppingBag,
  CreditCard,
  Ticket,
  Receipt,
  DollarSign,
  Star,
  ArrowLeft,
  Trophy,
  Zap,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Container,
  IconButton,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

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
      icon: "coffee",
      title: "Free Coffee",
      provider: "Local Café",
      description: "Redeem for one free medium coffee at participating locations",
      points: 100,
      category: "food"
    },
    {
      id: 2,
      icon: "utensils",
      title: "$10 Restaurant Voucher",
      provider: "Partner Restaurants",
      description: "$10 off your next meal at any partner restaurant",
      points: 500,
      category: "food"
    },
    {
      id: 3,
      icon: "shopping-bag",
      title: "Eco-Friendly Tote Bag",
      provider: "Reflourish",
      description: "Limited edition Reflourish tote bag made from recycled materials",
      points: 300,
      category: "merchandise"
    },
    {
      id: 4,
      icon: "credit-card",
      title: "$25 Gift Card",
      provider: "Amazon",
      description: "Digital gift card for online shopping",
      points: 1200,
      category: "gift-cards"
    },
    {
      id: 5,
      icon: "ticket",
      title: "Movie Ticket",
      provider: "AMC Theaters",
      description: "One free movie ticket for any standard showing",
      points: 400,
      category: "entertainment"
    },
    {
      id: 6,
      icon: "receipt",
      title: "Grocery Discount",
      provider: "Whole Foods",
      description: "15% off your next grocery shopping trip",
      points: 350,
      category: "food"
    },
    {
      id: 7,
      icon: "dollar-sign",
      title: "$5 Cash Reward",
      provider: "PayPal",
      description: "Direct cash transfer to your PayPal account",
      points: 250,
      category: "cash"
    },
    {
      id: 8,
      icon: "shopping-bag",
      title: "Reflourish T-Shirt",
      provider: "Reflourish",
      description: "Official Reflourish volunteer t-shirt in your size",
      points: 400,
      category: "merchandise"
    }
  ];

  const redeemedRewards = [
    {
      id: 101,
      title: "Free Coffee",
      provider: "Local Café",
      redeemedDate: "2024-01-15",
      status: "used",
      code: "COFFEE123"
    },
    {
      id: 102,
      title: "$5 Cash Reward",
      provider: "PayPal",
      redeemedDate: "2024-01-10",
      status: "pending",
      code: "CASH456"
    }
  ];

  const getIcon = (iconName: string, size = 24, color = "#848D58") => {
    const iconProps = { size, color };
    switch (iconName) {
      case 'coffee': return <Coffee {...iconProps} />;
      case 'utensils': return <Utensils {...iconProps} />;
      case 'shopping-bag': return <ShoppingBag {...iconProps} />;
      case 'credit-card': return <CreditCard {...iconProps} />;
      case 'ticket': return <Ticket {...iconProps} />;
      case 'receipt': return <Receipt {...iconProps} />;
      case 'dollar-sign': return <DollarSign {...iconProps} />;
      default: return <Gift {...iconProps} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return '#4CAF50';
      case 'merchandise': return '#2196F3';
      case 'gift-cards': return '#FF9800';
      case 'entertainment': return '#9C27B0';
      case 'cash': return '#F44336';
      default: return '#848D58';
    }
  };

  const handleRedeemReward = (reward: any) => {
    if (points >= reward.points) {
      setSelectedReward(reward);
      setConfirmDialogOpen(true);
    } else {
      alert(`You need ${reward.points - points} more points to redeem this reward!`);
    }
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;
    
    setConfirmDialogOpen(false);
    setLoadingDialogOpen(true);
    
    // Simulate API call
    setTimeout(() => {
      setPoints(points - selectedReward.points);
      setLoadingDialogOpen(false);
      setSuccessDialogOpen(true);
    }, 2000);
  };

  const filteredRewards = tabValue === 0 ? availableRewards : 
    availableRewards.filter(reward => {
      switch (tabValue) {
        case 1: return reward.category === 'food';
        case 2: return reward.category === 'merchandise';
        case 3: return reward.category === 'gift-cards';
        case 4: return reward.category === 'entertainment';
        default: return true;
      }
    });

  return (
    <Box
      sx={{
        backgroundImage: 'url(/VolunteerLogin.png)',
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
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
                <IconButton
                  onClick={() => navigate('/volunteer/dashboard')}
                  size="small"
                  sx={{
                    background: 'rgba(132, 141, 88, 0.1)',
                    color: '#848D58',
                    '&:hover': {
                      background: 'rgba(132, 141, 88, 0.2)',
                    },
                  }}
                >
                  <ArrowLeft size={20} />
                </IconButton>
                <Box
                  sx={{
                    width: { xs: 40, sm: 50 },
                    height: { xs: 40, sm: 50 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Gift size={24} color="white" />
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
                    Rewards Store
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
                      Redeem your impact points for amazing rewards
                    </Typography>
                    <Gift size={20} color="rgba(255, 255, 255, 0.8)" />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                justifyContent: 'center'
              }}>
                <Chip
                  icon={<Star size={16} />}
                  label={`${points} pts`}
                  sx={{
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    px: 1,
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Points Summary */}
          <Card
            sx={{
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 141, 88, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white',
                    }}
                  >
                    <Trophy size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {points}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Available Points
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                      color: 'white',
                    }}
                  >
                    <Target size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      2,340
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Earned
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                      color: 'white',
                    }}
                  >
                    <CheckCircle size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {redeemedRewards.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Rewards Redeemed
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </CardContent>
          </Card>

          {/* Rewards Categories */}
          <Card
            sx={{
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 141, 88, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minHeight: 60,
                    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  },
                  '& .Mui-selected': {
                    color: '#848D58 !important',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#848D58',
                    height: 3,
                  }
                }}
              >
                <Tab icon={<Sparkles size={20} />} label="All Rewards" iconPosition="start" />
                <Tab icon={<Utensils size={20} />} label="Food & Dining" iconPosition="start" />
                <Tab icon={<ShoppingBag size={20} />} label="Merchandise" iconPosition="start" />
                <Tab icon={<CreditCard size={20} />} label="Gift Cards" iconPosition="start" />
                <Tab icon={<Ticket size={20} />} label="Entertainment" iconPosition="start" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
                <AnimatePresence>
                  {filteredRewards.map((reward, index) => (
                    <motion.div
                      key={reward.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: `2px solid ${getCategoryColor(reward.category)}20`,
                          background: 'white',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: `0 8px 25px ${getCategoryColor(reward.category)}20`,
                          },
                        }}
                        onClick={() => handleRedeemReward(reward)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                background: `${getCategoryColor(reward.category)}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {getIcon(reward.icon, 24, getCategoryColor(reward.category))}
                            </Box>
                            <Chip
                              label={`${reward.points} pts`}
                              size="small"
                              sx={{
                                backgroundColor: points >= reward.points ? '#4CAF5015' : '#f5f5f5',
                                color: points >= reward.points ? '#4CAF50' : '#666',
                                fontWeight: 600,
                              }}
                            />
                          </Box>

                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            {reward.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {reward.provider}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                            {reward.description}
                          </Typography>

                          <Button
                            variant="contained"
                            fullWidth
                            disabled={points < reward.points}
                            sx={{
                              background: points >= reward.points 
                                ? `linear-gradient(135deg, ${getCategoryColor(reward.category)} 0%, ${getCategoryColor(reward.category)}CC 100%)`
                                : '#f5f5f5',
                              color: points >= reward.points ? 'white' : '#999',
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                background: points >= reward.points 
                                  ? `linear-gradient(135deg, ${getCategoryColor(reward.category)}DD 0%, ${getCategoryColor(reward.category)}AA 100%)`
                                  : '#f5f5f5',
                              },
                            }}
                          >
                            {points >= reward.points ? 'Redeem Now' : `Need ${reward.points - points} more pts`}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>

      {/* Confirmation Dialog - Modern iOS Style */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 24px rgba(132, 141, 88, 0.3)',
            }}
          >
            {selectedReward && getIcon(selectedReward.icon, 36, 'white')}
          </Box>

          {/* Title */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: '#1a1a1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Redeem Reward?
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280',
              mb: 3,
              lineHeight: 1.5,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            You're about to redeem <strong>"{selectedReward?.title}"</strong> for <strong>{selectedReward?.points} points</strong>.
          </Typography>

          {/* Reward Preview Card */}
          <Box
            sx={{
              background: 'rgba(132, 141, 88, 0.05)',
              border: '2px solid rgba(132, 141, 88, 0.1)',
              borderRadius: 3,
              p: 3,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: selectedReward ? getCategoryColor(selectedReward.category) : '#848D58',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedReward && getIcon(selectedReward.icon, 24, 'white')}
            </Box>
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {selectedReward?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedReward?.provider}
              </Typography>
            </Box>
            <Chip
              label={`${selectedReward?.points} pts`}
              sx={{
                background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              variant="outlined"
              sx={{
                minWidth: 120,
                py: 1.5,
                borderRadius: 3,
                borderColor: '#e5e7eb',
                color: '#6b7280',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  borderColor: '#d1d5db',
                  background: '#f9fafb',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRedeem}
              variant="contained"
              sx={{
                minWidth: 120,
                py: 1.5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 16px rgba(132, 141, 88, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6F7549 0%, #5A5F3A 100%)',
                  boxShadow: '0 6px 20px rgba(132, 141, 88, 0.4)',
                },
              }}
            >
              Redeem Now
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog 
        open={loadingDialogOpen}
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              position: 'relative',
            }}
          >
            <CircularProgress 
              size={60} 
              sx={{ 
                color: 'white',
                position: 'absolute',
              }} 
            />
            <Zap size={24} color="white" />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              color: '#1a1a1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Processing your redemption...
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#6b7280',
              mt: 1,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Please wait while we process your reward
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog 
        open={successDialogOpen} 
        onClose={() => setSuccessDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          {/* Success Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
            }}
          >
            <CheckCircle size={36} color="white" />
          </Box>

          {/* Title */}
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              color: '#1a1a1a',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Redemption Successful!
          </Typography>

          {/* Description */}
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280',
              mb: 4,
              lineHeight: 1.5,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            Your reward has been redeemed successfully! Check your email for the redemption code.
          </Typography>

          {/* Success Features */}
          <Box
            sx={{
              background: 'rgba(76, 175, 80, 0.05)',
              border: '2px solid rgba(76, 175, 80, 0.1)',
              borderRadius: 3,
              p: 3,
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color="white" />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Reward code sent to your email
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#4CAF50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={16} color="white" />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Points deducted from your balance
              </Typography>
            </Box>
          </Box>

          {/* Action Button */}
          <Button
            onClick={() => setSuccessDialogOpen(false)}
            variant="contained"
            sx={{
              minWidth: 120,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
              },
            }}
          >
            Awesome!
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default VolunteerRewards;