import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  LocalShipping,
  Person,
  LocationOn,
  Favorite,
  ArrowForward,
} from '@mui/icons-material';

const VolunteerProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    interests: [] as string[],
    experience: '',
    availability: '',
    bio: '',
  });

  const interestOptions = [
    'Environmental Conservation',
    'Community Service',
    'Food Waste Reduction',
    'Social Impact',
    'Volunteer Work',
    'Sustainability',
    'Community Building',
    'Local Delivery',
  ];

  const experienceOptions = [
    'No previous experience',
    'Some volunteer experience',
    'Experienced volunteer',
    'Professional driver',
    'Community organizer',
  ];

  const availabilityOptions = [
    'Weekdays only',
    'Weekends only',
    'Flexible schedule',
    'Morning hours',
    'Afternoon hours',
    'Evening hours',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestsChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value as string[];
    setFormData(prev => ({
      ...prev,
      interests: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          email: formData.email,
          user_type: 'volunteer',
          profile_data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            location: formData.location,
            interests: formData.interests.join(', '),
            experience: formData.experience,
            availability: formData.availability,
            bio: formData.bio,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile created successfully:', data);
      
      navigate('/volunteer/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/CourierLogin.png)',
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
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          zIndex: 3,
          boxSizing: 'border-box',
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/volunteer-login')}
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
          Back to Login
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img
            src="/LogoOutlined.png"
            alt="Reflourish"
            style={{
              height: '100px',
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(132, 141, 88, 0.2)',
                mb: 3,
              }}
            >
              <LocalShipping sx={{ fontSize: 40, color: '#848D58' }} />
            </Box>
            
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                fontWeight: 300,
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              Complete Your Volunteer Profile
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
              Tell us about yourself so we can match you with the perfect delivery opportunities
            </Typography>
          </Box>

          {/* Profile Form Card */}
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              maxWidth: '700px',
              mx: 'auto',
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      mb: 3,
                      color: '#2C3E50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Person sx={{ color: '#848D58' }} />
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      name="firstName"
                      label="First Name *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="lastName"
                      label="Last Name *"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Box>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      name="email"
                      label="Email Address *"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="phone"
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Box>
                </Box>

                {/* Location Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      mb: 2,
                      color: '#2C3E50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <LocationOn sx={{ color: '#848D58' }} />
                    Location & Availability
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      name="location"
                      label="Location/City"
                      value={formData.location}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="e.g., Boston, MA"
                    />
                    <FormControl fullWidth>
                      <InputLabel>Availability</InputLabel>
                      <Select
                        name="availability"
                        value={formData.availability}
                        onChange={handleSelectChange}
                        label="Availability"
                      >
                        {availabilityOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>

                {/* Interests & Experience Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      mb: 2,
                      color: '#2C3E50',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Favorite sx={{ color: '#848D58' }} />
                    Interests & Experience
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Interests</InputLabel>
                      <Select
                        multiple
                        name="interests"
                        value={formData.interests}
                        onChange={handleInterestsChange}
                        input={<OutlinedInput label="Interests" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {interestOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Experience Level</InputLabel>
                    <Select
                      name="experience"
                      value={formData.experience}
                      onChange={handleSelectChange}
                      label="Experience Level"
                    >
                      {experienceOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    name="bio"
                    label="Tell us about yourself (optional)"
                    value={formData.bio}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Share your motivation for volunteering or any relevant experience..."
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
                  sx={{
                    background: '#848D58',
                    py: 2,
                    fontSize: '1.1rem',
                    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    borderRadius: '12px',
                    '&:hover': {
                      background: '#6F7549',
                    },
                    '&:disabled': {
                      background: '#848D58',
                      opacity: 0.7,
                    },
                  }}
                >
                  {loading ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VolunteerProfileSetup;