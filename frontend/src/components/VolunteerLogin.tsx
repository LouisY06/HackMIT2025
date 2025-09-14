import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, UserCredential } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
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
import { ArrowBack, LocalShipping, CardGiftcard, Schedule, TrendingUp, Nature, Google } from '@mui/icons-material';

const VolunteerLogin: React.FC = () => {
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
      const result = await signInWithPopup(auth, googleProvider);
      // Check if user has completed profile for volunteer user type
      const user = auth.currentUser;
      if (user) {
        const profileResponse = await fetch(`http://localhost:5001/api/users/check-profile/volunteer/${user.uid}`);
        const profileData = await profileResponse.json();
        
        if (profileData.success && profileData.profile_completed) {
          navigate('/volunteer/dashboard');
        } else {
          navigate('/volunteer/profile-setup');
        }
      } else {
        navigate('/volunteer/profile-setup');
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
        // Check if user has completed profile for volunteer user type
        const user = auth.currentUser;
        if (user) {
          const profileResponse = await fetch(`http://localhost:5001/api/users/check-profile/volunteer/${user.uid}`);
          const profileData = await profileResponse.json();
          
          if (profileData.success && profileData.profile_completed) {
            navigate('/volunteer/dashboard');
          } else {
            navigate('/volunteer/profile-setup');
          }
        } else {
          navigate('/volunteer/profile-setup');
        }
      } else {
        // Check if email already exists in volunteer table
        const emailCheckResponse = await fetch(`http://localhost:5001/api/users/check-email/volunteer/${email}`);
        const emailCheckData = await emailCheckResponse.json();
        
        if (emailCheckData.success && emailCheckData.email_exists) {
          setError('An account with this email already exists. Please sign in instead.');
          return;
        }
        
        // Create new user and redirect to profile setup
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/volunteer/profile-setup');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Top Green Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
          minHeight: '60vh',
          position: 'relative',
          color: 'white',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
            sx={{ 
              color: 'white', 
              mr: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              px: 2,
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Back to roles
      </Button>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            WASTE→WORTH PLATFORM
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 6 }}>
          {/* Left Side - Text Content */}
          <Box sx={{ flex: 1, maxWidth: '500px' }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Join as a Volunteer Courier
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
              }}
            >
              Pick up surplus food and deliver to food banks while earning points and rewards.
            </Typography>

            {/* Benefits */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CardGiftcard sx={{ fontSize: 24 }} />
                <Typography>Earn points & redeem rewards</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Schedule sx={{ fontSize: 24 }} />
                <Typography>Flexible scheduling</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp sx={{ fontSize: 24 }} />
                <Typography>Level up with deliveries</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Nature sx={{ fontSize: 24 }} />
                <Typography>Environmental impact</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Delivery Truck Icon */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <LocalShipping sx={{ fontSize: 120, color: 'white' }} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom White Section - Login Card */}
      <Container maxWidth="sm" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            mt: -4,
          }}
        >
          <CardContent sx={{ p: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}
            >
              {isSignIn ? 'Sign In' : 'Get Started'}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: '#666', mb: 4 }}
            >
              {isSignIn ? 'Welcome back! Sign in to your account.' : 'Create your account or sign in with Google.'}
            </Typography>

            {/* Google Login Button */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={loading}
              startIcon={<Google />}
              sx={{
                borderColor: '#4CAF50',
                color: '#4CAF50',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                mb: 3,
                '&:hover': {
                  borderColor: '#388E3C',
                  background: 'rgba(76, 175, 80, 0.04)',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{ mx: 2, color: '#666', fontSize: '0.9rem' }}>
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
                background: '#4CAF50',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                mb: 3,
                '&:hover': {
                  background: '#388E3C',
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
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
              </Typography>
              <Button
                variant="text"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError('');
                }}
                sx={{
                  color: '#4CAF50',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                {isSignIn ? 'Create Account' : 'Sign In'}
              </Button>
            </Box>

            {/* Disclaimer */}
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', color: '#999', fontSize: '0.8rem' }}
            >
              This is a demo app. Data won't be saved permanently.
          </Typography>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
};

export default VolunteerLogin;
