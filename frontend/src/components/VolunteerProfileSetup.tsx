import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { API_BASE_URL } from '../config/api';
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
    'Local Community',
    'Charity Work',
  ];

  const experienceOptions = [
    'Beginner (0-1 years)',
    'Some Experience (1-3 years)',
    'Experienced (3-5 years)',
    'Very Experienced (5+ years)',
  ];

  const availabilityOptions = [
    'Weekdays',
    'Weekends',
    'Evenings',
    'Flexible',
    'Specific Days',
  ];

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleInterestChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      interests: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Get Firebase user
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Save profile to backend
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          email: user.email || formData.email,
          user_type: 'volunteer',
          profile_data: formData
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }
      
      console.log('Volunteer profile saved successfully');
      
      // Navigate to volunteer dashboard
      navigate('/volunteer/dashboard');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2
          }}>
            <Person sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
            Complete Your Volunteer Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
            Help us get to know you better so we can match you with the perfect volunteer opportunities in your community.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Personal Information
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange('firstName')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange('lastName')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Location (City, State)"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  required
                  sx={{ borderRadius: 2 }}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ color: '#666', mr: 1 }} />
                  }}
                />
              </Box>

              {/* Interests */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Interests & Causes
                </Typography>
                
                <FormControl fullWidth>
                  <InputLabel>What causes interest you most?</InputLabel>
                  <Select
                    multiple
                    value={formData.interests}
                    onChange={handleInterestChange}
                    input={<OutlinedInput label="What causes interest you most?" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    sx={{ borderRadius: 2 }}
                  >
                    {interestOptions.map((interest) => (
                      <MenuItem key={interest} value={interest}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Favorite sx={{ fontSize: 16, color: '#4CAF50' }} />
                          {interest}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Experience & Availability */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Experience & Availability
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Volunteer Experience</InputLabel>
                    <Select
                      value={formData.experience}
                      onChange={handleSelectChange('experience')}
                      label="Volunteer Experience"
                      sx={{ borderRadius: 2 }}
                    >
                      {experienceOptions.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Availability</InputLabel>
                    <Select
                      value={formData.availability}
                      onChange={handleSelectChange('availability')}
                      label="Availability"
                      sx={{ borderRadius: 2 }}
                    >
                      {availabilityOptions.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <TextField
                  fullWidth
                  label="Tell us about yourself (optional)"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange('bio')}
                  placeholder="Share what motivates you to volunteer and any relevant background..."
                  sx={{ borderRadius: 2 }}
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.location}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    bgcolor: '#4CAF50',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#45a049' },
                    '&:disabled': { bgcolor: '#ccc' }
                  }}
                >
                  {loading ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VolunteerProfileSetup;
