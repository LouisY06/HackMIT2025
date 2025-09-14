import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Globe, UtensilsCrossed, DollarSign, Car, Droplets } from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

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

      {/* Global Impact Section */}
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
                mb: 2,
                color: '#333',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
              }}
            >
              Our Global Impact
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                color: '#666',
                mb: 6,
                maxWidth: '600px',
                mx: 'auto',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                fontWeight: 300,
              }}
            >
              See how the Reflourish community is transforming food waste into community impact across the world
            </Typography>

            {/* Key Metrics Cards */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', sm: 'repeat(2, 1fr)', md: 'row' } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ flex: 1 }}
              >
                <Card sx={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)', 
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(132, 141, 88, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      <Leaf size={48} strokeWidth={1.5} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      58.0M
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 300 }}>
                      lbs Food Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ flex: 1 }}
              >
                <Card sx={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #7A8B5C 0%, #65734D 100%)', 
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(122, 139, 92, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      <Globe size={48} strokeWidth={1.5} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      25.5M
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 300 }}>
                      lbs CO₂ Prevented
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ flex: 1 }}
              >
                <Card sx={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #6E8A56 0%, #5A7347 100%)', 
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(110, 138, 86, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      <UtensilsCrossed size={48} strokeWidth={1.5} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      2.3M
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 300 }}>
                      Meals Provided
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ flex: 1 }}
              >
                <Card sx={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, #8B9862 0%, #737F50 100%)', 
                  color: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(139, 152, 98, 0.3)',
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                      <DollarSign size={48} strokeWidth={1.5} />
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      $1.2M
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 300 }}>
                      Cost Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Additional Impact Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mt: 4 }}>
                <Card sx={{ 
                  backgroundColor: 'rgba(132, 141, 88, 0.1)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(132, 141, 88, 0.2)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Car size={32} strokeWidth={1.5} color="#848D58" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        28.7M miles not driven
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Equivalent environmental impact from reduced transportation emissions
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ 
                  backgroundColor: 'rgba(132, 141, 88, 0.1)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(132, 141, 88, 0.2)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Droplets size={32} strokeWidth={1.5} color="#848D58" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                        1.45B gallons water saved
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Water conservation through reduced food waste production
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </CardContent>
        </Card>

      </Container>

    </Box>
  );
};

export default LandingPage;
