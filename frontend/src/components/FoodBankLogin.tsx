import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Container,
} from '@mui/material';
import { ArrowBack, Google, LocalShipping, VerifiedUser, Timeline, Groups, Star } from '@mui/icons-material';

const FoodBankLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignIn, setIsSignIn] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      // Check if user has completed profile for foodbank user type
      const user = auth.currentUser;
      if (user) {
        const profileResponse = await fetch(`http://localhost:5001/api/users/check-profile/foodbank/${user.uid}`);
        const profileData = await profileResponse.json();
        
        if (profileData.success && profileData.profile_completed) {
          navigate('/foodbank/dashboard');
        } else {
          navigate('/foodbank/profile-setup');
        }
      } else {
        navigate('/foodbank/profile-setup');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
        // Check if user has completed profile for foodbank user type
        const user = auth.currentUser;
        if (user) {
          const profileResponse = await fetch(`http://localhost:5001/api/users/check-profile/foodbank/${user.uid}`);
          const profileData = await profileResponse.json();
          
          if (profileData.success && profileData.profile_completed) {
            navigate('/foodbank/dashboard');
          } else {
            navigate('/foodbank/profile-setup');
          }
        } else {
          navigate('/foodbank/profile-setup');
        }
      } else {
        // Check if email already exists in foodbank table
        try {
          const emailCheckResponse = await fetch(`http://localhost:5001/api/users/check-email/foodbank/${email}`);
          
          if (!emailCheckResponse.ok) {
            throw new Error(`HTTP error! status: ${emailCheckResponse.status}`);
          }
          
          const emailCheckData = await emailCheckResponse.json();
          
          if (emailCheckData.success && emailCheckData.email_exists) {
            setError('An account with this email already exists. Please sign in instead.');
            return;
          }
        } catch (emailCheckError) {
          console.error('Email check failed:', emailCheckError);
          setError('Failed to check email availability. Please try again.');
          return;
        }
        
        // Create new user and redirect to profile setup
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/foodbank/profile-setup');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/FoodbankLogin.png)',
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
      {/* Header with Logo and Back Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          zIndex: 3,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/login')}
          sx={{
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            px: 3,
            py: 1,
            fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
            fontWeight: 300,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Back to Roles
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/LogoOutlined.png"
            alt="Reflourish"
            style={{
              height: '40px',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Hero Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(110, 138, 86, 0.2)',
                mb: 3,
              }}
            >
              <LocalShipping sx={{ fontSize: 40, color: '#6E8A56' }} />
            </Box>
            
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                fontWeight: 300,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Join as a Food Bank Partner
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                fontWeight: 300,
                opacity: 0.9,
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Receive verified fresh food deliveries. Verify incoming deliveries and track distribution to your community.
            </Typography>

            {/* Benefits */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 3,
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <VerifiedUser sx={{ fontSize: 32, mb: 1, color: '#6E8A56' }} />
                <Typography variant="body2" sx={{ fontWeight: 300 }}>
                  QR Verified
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Timeline sx={{ fontSize: 32, mb: 1, color: '#6E8A56' }} />
                <Typography variant="body2" sx={{ fontWeight: 300 }}>
                  Real-time Tracking
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Groups sx={{ fontSize: 32, mb: 1, color: '#6E8A56' }} />
                <Typography variant="body2" sx={{ fontWeight: 300 }}>
                  Serve Families
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Star sx={{ fontSize: 32, mb: 1, color: '#6E8A56' }} />
                <Typography variant="body2" sx={{ fontWeight: 300 }}>
                  Build Trust
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Login Card */}
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  textAlign: 'center',
                  mb: 1,
                  color: '#2C3E50',
                }}
              >
                {isSignIn ? 'Welcome Back' : 'Get Started'}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  color: '#5A6C7D',
                  mb: 4,
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontWeight: 300,
                }}
              >
                {isSignIn ? 'Sign in to your food bank account' : 'Create your food bank account'}
              </Typography>

              {/* Google Login Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={loading}
                startIcon={<Google />}
                sx={{
                  borderColor: '#6E8A56',
                  color: '#6E8A56',
                  py: 2,
                  fontSize: '1rem',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  mb: 3,
                  borderRadius: '12px',
                  '&:hover': {
                    borderColor: '#5A7347',
                    background: 'rgba(110, 138, 86, 0.04)',
                  },
                }}
              >
                Continue with Google
              </Button>

              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography sx={{ mx: 2, color: '#5A6C7D', fontSize: '0.9rem' }}>
                  OR {isSignIn ? 'SIGN IN' : 'CREATE ACCOUNT'} WITH EMAIL
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              {/* Error Message */}
              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              {/* Form Fields */}
              <TextField
                fullWidth
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                type="email"
              />
              
              <TextField
                fullWidth
                label="Password"
                placeholder={isSignIn ? "Enter your password" : "Create a password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                type="password"
              />

              <Button
                variant="contained"
                fullWidth
                onClick={handleEmailAuth}
                disabled={loading}
                sx={{
                  background: '#6E8A56',
                  py: 2,
                  fontSize: '1rem',
                  fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                  fontWeight: 400,
                  mb: 3,
                  borderRadius: '12px',
                  '&:hover': {
                    background: '#5A7347',
                  },
                }}
              >
                {loading 
                  ? (isSignIn ? 'Signing In...' : 'Creating Account...') 
                  : (isSignIn ? 'Sign In' : 'Create Account')
                }
              </Button>

              {/* Toggle between Sign In and Sign Up */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#5A6C7D', mb: 1 }}>
                  {isSignIn ? "Don't have an account?" : "Already have an account?"}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    setIsSignIn(!isSignIn);
                    setError('');
                  }}
                  sx={{
                    color: '#6E8A56',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {isSignIn ? 'Create Account' : 'Sign In'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FoodBankLogin;