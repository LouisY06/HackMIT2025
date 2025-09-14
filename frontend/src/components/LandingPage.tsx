import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Grid,
  Chip,
} from '@mui/material';
import {
  LocalShipping,
  Store,
  Groups,
} from '@mui/icons-material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: string) => {
    navigate(`/${role}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Gradient Background Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #2196F3 100%)',
          minHeight: '60vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem',
        }}
      >

        {/* Main Title */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 800,
            fontSize: { xs: '3rem', md: '5rem' },
            textAlign: 'center',
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px',
          }}
        >
          reflourish
        </Typography>

        {/* Tagline */}
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            opacity: 0.9,
            maxWidth: '600px',
            mb: 4,
          }}
        >
          Transforming food waste into community impact through gamified reverse logistics
        </Typography>

        {/* Impact Metrics */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip
            label="58M lbs CO₂ prevented"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              px: 2,
              py: 3,
              fontSize: '1rem',
            }}
          />
          <Chip
            label="2.3M meals provided"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              px: 2,
              py: 3,
              fontSize: '1rem',
            }}
          />
          <Chip
            label="$1.2M saved in disposal costs"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              px: 2,
              py: 3,
              fontSize: '1rem',
            }}
          />
        </Box>
      </Box>

      {/* Choose Your Role Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent sx={{ p: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                mb: 1,
                color: '#333',
              }}
            >
              Choose Your Role
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#666',
                mb: 6,
              }}
            >
              How would you like to make an impact?
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'stretch' }}>
              {/* Volunteer Courier Card */}
              <Card
                  sx={{
                    width: 320,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 2,
                    border: '2px solid transparent',
                    '&:hover': {
                      border: '2px solid #4CAF50',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      background: '#E8F5E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <LocalShipping sx={{ fontSize: 40, color: '#4CAF50' }} />
                  </Box>
                  
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                    Volunteer Courier
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: '#666', mb: 4, flexGrow: 1 }}>
                    Make a difference while earning rewards
                  </Typography>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRoleSelection('volunteer')}
                    sx={{
                      background: '#4CAF50',
                      '&:hover': {
                        background: '#45a049',
                      },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Get Started
                  </Button>
                </Card>

              {/* Store Partner Card */}
              <Card
                  sx={{
                    width: 320,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 2,
                    border: '2px solid transparent',
                    '&:hover': {
                      border: '2px solid #2196F3',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      background: '#E3F2FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <Store sx={{ fontSize: 40, color: '#2196F3' }} />
                  </Box>
                  
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                    Store Partner
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: '#666', mb: 4, flexGrow: 1 }}>
                    Reduce waste costs and help community
                  </Typography>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRoleSelection('store')}
                    sx={{
                      background: '#2196F3',
                      '&:hover': {
                        background: '#1976D2',
                      },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Get Started
                  </Button>
                </Card>

              {/* Food Bank Partner Card */}
              <Card
                  sx={{
                    width: 320,
                    minHeight: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 2,
                    border: '2px solid transparent',
                    '&:hover': {
                      border: '2px solid #9C27B0',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      background: '#F3E5F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <Groups sx={{ fontSize: 40, color: '#9C27B0' }} />
                  </Box>
                  
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
                    Food Bank Partner
                  </Typography>
                  
                  <Typography variant="body1" sx={{ color: '#666', mb: 4, flexGrow: 1 }}>
                    Receive verified fresh food deliveries
                  </Typography>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleRoleSelection('foodbank')}
                    sx={{
                      background: '#9C27B0',
                      '&:hover': {
                        background: '#7B1FA2',
                      },
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Get Started
                  </Button>
                </Card>
            </Box>
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#999',
            mt: 4,
          }}
        >
          This is a demo platform. Click any role to explore the full experience.
        </Typography>
      </Container>

    </Box>
  );
};

export default LandingPage;
