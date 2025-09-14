import React from 'react';
import { Box, Typography, Card, CardContent, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, Store, Heart } from 'lucide-react';

const MainLogin: React.FC = () => {
  const navigate = useNavigate();

  const roleOptions = [
    {
      title: "Volunteer Courier",
      description: "Make a difference while earning rewards",
      icon: <Truck size={48} strokeWidth={1.5} />,
      color: "#848D58",
      hoverColor: "#6F7549",
      route: "/volunteer-login"
    },
    {
      title: "Store Partner",
      description: "Reduce waste costs and help community",
      icon: <Store size={48} strokeWidth={1.5} />,
      color: "#7A8B5C",
      hoverColor: "#65734D",
      route: "/store-login"
    },
    {
      title: "Food Bank Partner",
      description: "Receive verified fresh food deliveries",
      icon: <Heart size={48} strokeWidth={1.5} />,
      color: "#6E8A56",
      hoverColor: "#5A7347",
      route: "/foodbank-login"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/Gemini_Generated_Image_fhr4isfhr4isfhr4.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}
    >
      {/* Logo */}
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <img
            src="/LogoOutlined.png"
            alt="Reflourish"
            style={{
              height: '200px',
              maxWidth: '100%',
              filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.4))',
            }}
          />
        </Box>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
          }}
        >
          Welcome to Reflourish
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 6,
            opacity: 0.9,
            fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: { xs: '1rem', sm: '1.2rem' },
          }}
        >
          Choose your role to get started
        </Typography>
      </motion.div>

      {/* Role Selection Cards */}
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {roleOptions.map((role, index) => (
              <motion.div
                key={role.title}
                variants={cardVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
                      background: 'rgba(255, 255, 255, 0.98)',
                    },
                  }}
                  onClick={() => navigate(role.route)}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        color: role.color,
                        mb: 3,
                        p: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${role.color}15, ${role.color}25)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {role.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#2C3E50',
                        mb: 2,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: '1.3rem', sm: '1.5rem' },
                      }}
                    >
                      {role.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#5A6C7D',
                        mb: 3,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                        fontWeight: 300,
                        lineHeight: 1.6,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      {role.description}
                    </Typography>

                    {/* Action Button */}
                    <Button
                      variant="contained"
                      sx={{
                        background: role.color,
                        color: 'white',
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                        fontWeight: 400,
                        fontSize: '1rem',
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: `0 4px 16px ${role.color}40`,
                        '&:hover': {
                          background: role.hoverColor,
                          boxShadow: `0 6px 20px ${role.color}60`,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(role.route);
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1, ease: [0.4, 0, 0.2, 1] }}
      >
        <Button
          variant="text"
          onClick={() => navigate('/')}
          sx={{
            color: 'white',
            fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            fontSize: '1rem',
            mt: 4,
            textTransform: 'none',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          ← Back to Home
        </Button>
      </motion.div>
    </Box>
  );
};

export default MainLogin;
