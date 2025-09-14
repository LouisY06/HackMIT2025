import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  ArrowLeft,
  TrendingUp,
  Users,
  Target,
  Clock,
  Package,
  Zap,
  Award,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  IconButton,
  Tabs,
  Tab,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';

const VolunteerLeaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(1); // Default to "This Month"

  const leaderboardData = [
    {
      id: 1,
      name: "Sarah Chen",
      points: 2840,
      deliveries: 56,
      hours: 42,
      rank: 1,
      change: 2,
      badge: "Champion",
      avatar: "SC",
      foodSaved: 234,
      streak: 12
    },
    {
      id: 2,
      name: "Mike Johnson", 
      points: 2650,
      deliveries: 52,
      hours: 38,
      rank: 2,
      change: -1,
      badge: "Hero",
      avatar: "MJ",
      foodSaved: 198,
      streak: 8
    },
    {
      id: 3,
      name: "You",
      points: 1250,
      deliveries: 23,
      hours: 18,
      rank: 3,
      change: 1,
      badge: "Rising Star",
      avatar: "You",
      foodSaved: 156,
      streak: 5
    },
    {
      id: 4,
      name: "Emma Wilson",
      points: 1180,
      deliveries: 21,
      hours: 16,
      rank: 4,
      change: 0,
      badge: "Contributor",
      avatar: "EW",
      foodSaved: 142,
      streak: 3
    },
    {
      id: 5,
      name: "Alex Brown",
      points: 950,
      deliveries: 18,
      hours: 14,
      rank: 5,
      change: -2,
      badge: "Helper",
      avatar: "AB",
      foodSaved: 98,
      streak: 2
    },
    {
      id: 6,
      name: "Lisa Garcia",
      points: 890,
      deliveries: 17,
      hours: 13,
      rank: 6,
      change: 3,
      badge: "Helper",
      avatar: "LG",
      foodSaved: 87,
      streak: 4
    },
    {
      id: 7,
      name: "David Kim",
      points: 820,
      deliveries: 16,
      hours: 12,
      rank: 7,
      change: -1,
      badge: "Helper",
      avatar: "DK",
      foodSaved: 76,
      streak: 1
    },
    {
      id: 8,
      name: "Rachel Martinez",
      points: 780,
      deliveries: 15,
      hours: 11,
      rank: 8,
      change: 0,
      badge: "Newcomer",
      avatar: "RM",
      foodSaved: 65,
      streak: 6
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Champion': return '#FFD700';
      case 'Hero': return '#C0C0C0';
      case 'Rising Star': return '#CD7F32';
      case 'Contributor': return '#4CAF50';
      case 'Helper': return '#2196F3';
      case 'Newcomer': return '#9C27B0';
      default: return '#848D58';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={24} color="#FFD700" />;
      case 2: return <Medal size={24} color="#C0C0C0" />;
      case 3: return <Medal size={24} color="#CD7F32" />;
      default: return <Trophy size={20} color="#848D58" />;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ChevronUp size={16} color="#4CAF50" />;
    if (change < 0) return <ChevronDown size={16} color="#f44336" />;
    return null;
  };

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
            p: 3,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  onClick={() => navigate('/volunteer/dashboard')}
                  sx={{
                    background: 'rgba(132, 141, 88, 0.1)',
                    color: '#848D58',
                    '&:hover': {
                      background: 'rgba(132, 141, 88, 0.2)',
                    },
                  }}
                >
                  <ArrowLeft size={24} />
                </IconButton>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Trophy size={24} color="white" />
                </Box>
                <Box>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Volunteer Leaderboard
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 300,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      Celebrating our community heroes
                    </Typography>
                    <Trophy size={20} color="rgba(255, 255, 255, 0.8)" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </motion.div>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Stats Overview */}
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
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)',
                      color: 'white',
                    }}
                  >
                    <Users size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {leaderboardData.length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Volunteers
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
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white',
                    }}
                  >
                    <Package size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {leaderboardData.reduce((sum, user) => sum + user.deliveries, 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Deliveries
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
                    <Clock size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {leaderboardData.reduce((sum, user) => sum + user.hours, 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Volunteer Hours
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
                    <Target size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {leaderboardData.reduce((sum, user) => sum + user.foodSaved, 0)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      lbs Food Saved
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </CardContent>
          </Card>

          {/* Time Period Tabs */}
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
                <Tab icon={<Zap size={20} />} label="This Week" iconPosition="start" />
                <Tab icon={<TrendingUp size={20} />} label="This Month" iconPosition="start" />
                <Tab icon={<Award size={20} />} label="All Time" iconPosition="start" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <AnimatePresence>
                  {leaderboardData.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 2,
                          border: user.name === 'You' ? '2px solid #848D58' : '1px solid #e0e0e0',
                          background: user.name === 'You' ? 'linear-gradient(135deg, #848D5810 0%, #6F754910 100%)' : 'white',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(132, 141, 88, 0.15)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            {/* Rank */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: user.rank <= 3 
                                  ? 'linear-gradient(135deg, #FFD700 0%, #FFC107 100%)'
                                  : 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                                color: 'white',
                                position: 'relative',
                              }}
                            >
                              {getRankIcon(user.rank)}
                              <Typography
                                variant="caption"
                                sx={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  background: 'white',
                                  color: 'black',
                                  borderRadius: '50%',
                                  width: 20,
                                  height: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                {user.rank}
                              </Typography>
                            </Box>

                            {/* User Info */}
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                  {user.name}
                                </Typography>
                                {user.change !== 0 && (
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {getChangeIcon(user.change)}
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: user.change > 0 ? '#4CAF50' : '#f44336',
                                        fontWeight: 600,
                                      }}
                                    >
                                      {Math.abs(user.change)}
                                    </Typography>
                                  </Box>
                                )}
                                <Chip
                                  label={user.badge}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getBadgeColor(user.badge)}20`,
                                    color: getBadgeColor(user.badge),
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                  }}
                                />
                              </Box>

                              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 2 }}>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Points
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#848D58' }}>
                                    {user.points.toLocaleString()}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Deliveries
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {user.deliveries}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Food Saved
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {user.foodSaved} lbs
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Streak
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#FF9800' }}>
                                    {user.streak} days
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Progress Bar */}
                              <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Progress to next level
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {Math.round((user.points % 1000) / 10)}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={(user.points % 1000) / 10}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: '#f5f5f5',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: getBadgeColor(user.badge),
                                      borderRadius: 4,
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
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
    </Box>
  );
};

export default VolunteerLeaderboard;