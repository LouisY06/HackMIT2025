import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
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
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import { 
  Logout,
  EmojiEvents,
  Star,
  LocalShipping,
  Schedule,
  TrendingUp
} from '@mui/icons-material';

const VolunteerLeaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(1); // Default to "This Month"

  const leaderboardData = [
    {
      id: 1,
      name: "James Wilson",
      points: 2100,
      deliveries: 42,
      hours: 31,
      rank: 1,
      badge: "Top Volunteer"
    },
    {
      id: 2,
      name: "Alex Johnson", 
      points: 1850,
      deliveries: 37,
      hours: 24,
      rank: 2,
      badge: "Top Volunteer"
    },
    {
      id: 3,
      name: "Marcus Chen",
      points: 1250,
      deliveries: 25,
      hours: 18.5,
      rank: 3,
      badge: "Top Volunteer"
    },
    {
      id: 4,
      name: "Emily Davis",
      points: 920,
      deliveries: 18,
      hours: 12.5,
      rank: 4
    },
    {
      id: 5,
      name: "David Kim",
      points: 780,
      deliveries: 16,
      hours: 11,
      rank: 5
    },
    {
      id: 6,
      name: "Sophie Brown",
      points: 650,
      deliveries: 13,
      hours: 9.5,
      rank: 6
    },
    {
      id: 7,
      name: "Michael Lee",
      points: 520,
      deliveries: 10,
      hours: 7,
      rank: 7
    },
    {
      id: 8,
      name: "Rachel Green",
      points: 380,
      deliveries: 8,
      hours: 5.5,
      rank: 8
    }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleFindTasks = () => {
    navigate('/volunteer/find-pickups');
  };

  const getTopThree = () => leaderboardData.slice(0, 3);
  const getTopThreeColors = () => [
    { bg: '#FFD700', color: '#B8860B' }, // Gold
    { bg: '#C0C0C0', color: '#696969' }, // Silver  
    { bg: '#CD7F32', color: '#8B4513' }  // Bronze
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <EmojiEvents sx={{ color: '#FFD700' }} />;
    if (rank <= 3) return <EmojiEvents sx={{ color: '#C0C0C0' }} />;
    return null;
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
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
              }}
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
              label="1250 pts" 
              sx={{ 
                backgroundColor: '#FFF9C4', 
                color: '#F57F17',
                fontWeight: 'bold'
              }} 
            />
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4 }}>
        {/* Title Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmojiEvents sx={{ fontSize: 40, color: '#FFD700', mr: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              Leaderboard
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            See how you rank among top volunteers.
          </Typography>
        </Box>

        {/* Time Period Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="This Week" />
            <Tab label="This Month" />
            <Tab label="All Time" />
          </Tabs>
        </Box>

        {/* Top 3 Cards */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Top 3 Volunteers
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
            {getTopThree().map((volunteer, index) => {
              const colors = getTopThreeColors()[index];
              return (
                <Card 
                  key={volunteer.id} 
                  sx={{ 
                    flex: 1,
                    backgroundColor: colors.bg,
                    color: colors.color,
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)' }}>
                      {getRankIcon(volunteer.rank)}
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                      {volunteer.name}
                    </Typography>
                    
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                      {volunteer.points} points
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{volunteer.deliveries} deliveries</Typography>
                      <Typography variant="body2">{volunteer.hours}h</Typography>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* Monthly Leaderboard List */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            Monthly Leaderboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            All volunteers ranked by points earned this month.
          </Typography>
          
          <Card>
            <CardContent sx={{ p: 0 }}>
              {leaderboardData.map((volunteer, index) => (
                <Box
                  key={volunteer.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: index < leaderboardData.length - 1 ? '1px solid #e0e0e0' : 'none',
                    '&:hover': { backgroundColor: '#f9f9f9' }
                  }}
                >
                  {/* Rank Icon/Number */}
                  <Box sx={{ width: 40, display: 'flex', justifyContent: 'center', mr: 2 }}>
                    {volunteer.rank <= 3 ? (
                      getRankIcon(volunteer.rank)
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#666' }}>
                        #{volunteer.rank}
                      </Typography>
                    )}
                  </Box>

                  {/* Avatar */}
                  <Avatar 
                    sx={{ 
                      backgroundColor: '#9C27B0', 
                      color: 'white',
                      width: 48,
                      height: 48,
                      mr: 2,
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {volunteer.name.charAt(0)}
                  </Avatar>

                  {/* Name and Stats */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                        {volunteer.name}
                      </Typography>
                      {volunteer.badge && (
                        <Chip 
                          label={volunteer.badge} 
                          size="small" 
                          sx={{ backgroundColor: '#FFF9C4', color: '#F57F17' }}
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                        <Typography variant="body2">{volunteer.points} pts</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocalShipping sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">{volunteer.deliveries} deliveries</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 16, color: '#666' }} />
                        <Typography variant="body2">{volunteer.hours}h</Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Total Points */}
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                    {volunteer.points}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Call to Action */}
        <Card 
          sx={{ 
            background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
            color: 'white',
            textAlign: 'center',
            p: 4
          }}
        >
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
              Keep Climbing! <Rocket size={16} style={{ marginLeft: '4px' }} />
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Complete more deliveries to earn points and climb the leaderboard.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleFindTasks}
              sx={{ 
                backgroundColor: 'white',
                color: '#9C27B0',
                '&:hover': { backgroundColor: '#f5f5f5' },
                px: 4,
                py: 1.5
              }}
            >
              Find More Tasks
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default VolunteerLeaderboard;
