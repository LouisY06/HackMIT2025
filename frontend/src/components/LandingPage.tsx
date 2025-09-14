import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
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
          backgroundImage: 'url(/Gemini_Generated_Image_fhr4isfhr4isfhr4.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '60vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '2rem',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          },
          '& > *': {
            position: 'relative',
            zIndex: 2,
          },
        }}
      >

        {/* Main Logo */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
            mt: 4,
          }}
        >
          <motion.img
            src="/LogoOutlined.png"
            alt="Reflourish"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            style={{
              height: '350px',
              maxWidth: '100%',
              filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.4)) drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
              cursor: 'pointer',
            }}
          />
        </Box>

        {/* Tagline */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          mb: 3,
          px: 2
        }}>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              opacity: 0.9,
              maxWidth: { xs: '90%', sm: '600px', md: '800px' },
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
              lineHeight: 1.5,
              whiteSpace: { xs: 'normal', md: 'nowrap' },
            }}
          >
            Grow our communities by reducing food waste, one box at a time.
          </Typography>
        </Box>

        {/* Reflourish Now Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                background: '#848D58',
                color: 'white',
                fontWeight: 300,
                fontSize: '1.2rem',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                px: 5,
                py: 1.8,
                borderRadius: '16px',
                textTransform: 'none',
                letterSpacing: '0.5px',
                boxShadow: '0 8px 32px rgba(132, 141, 88, 0.35), 0 2px 8px rgba(0,0,0,0.15)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: '16px',
                },
                '&:hover': {
                  background: '#6F7549',
                  boxShadow: '0 12px 40px rgba(132, 141, 88, 0.45), 0 4px 12px rgba(0,0,0,0.2)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              reflourish now
            </Button>
          </motion.div>
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
