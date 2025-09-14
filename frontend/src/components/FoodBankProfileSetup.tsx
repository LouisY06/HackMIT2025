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
  CircularProgress,
} from '@mui/material';
import {
  LocalShipping,
  LocationOn,
  Business,
  ArrowForward,
  People,
} from '@mui/icons-material';

const FoodBankProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    organizationType: '',
    taxId: '',
    description: '',
    capacity: '',
    operatingHours: '',
    specialInstructions: '',
    servingArea: '',
  });

  const organizationTypes = [
    'Food Bank',
    'Community Kitchen',
    'Soup Kitchen',
    'Food Pantry',
    'Shelter',
    'Non-Profit Organization',
    'Religious Organization',
    'Other',
  ];

  const capacityOptions = [
    'Small (1-50 families/day)',
    'Medium (50-200 families/day)',
    'Large (200-500 families/day)',
    'Very Large (500+ families/day)',
  ];

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value as string,
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
      const response = await fetch('${API_BASE_URL}/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          email: user.email || formData.email,
          user_type: 'foodbank',
          profile_data: formData
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }
      
      console.log('Food Bank profile saved successfully');
      
      // Navigate to food bank dashboard
      navigate('/foodbank/dashboard');
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
            bgcolor: '#9C27B0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2
          }}>
            <LocalShipping sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
            Complete Your Organization Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
            Set up your food bank or organization profile to start receiving verified food deliveries from our volunteer network.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Organization Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Organization Information
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    value={formData.organizationName}
                    onChange={handleInputChange('organizationName')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Contact Person Name"
                    value={formData.contactName}
                    onChange={handleInputChange('contactName')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Contact Email"
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
                    required
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel>Organization Type</InputLabel>
                    <Select
                      value={formData.organizationType}
                      onChange={handleSelectChange('organizationType')}
                      label="Organization Type"
                      sx={{ borderRadius: 2 }}
                    >
                      {organizationTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Business sx={{ fontSize: 16, color: '#9C27B0' }} />
                            {type}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Tax ID / EIN"
                    value={formData.taxId}
                    onChange={handleInputChange('taxId')}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
              </Box>

              {/* Address Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Address Information
                </Typography>
                
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  required
                  sx={{ borderRadius: 2, mb: 3 }}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ color: '#666', mr: 1 }} />
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.state}
                    onChange={handleInputChange('state')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange('zipCode')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Service Area"
                  value={formData.servingArea}
                  onChange={handleInputChange('servingArea')}
                  placeholder="e.g., City of Cambridge, Middlesex County, etc."
                  sx={{ borderRadius: 2 }}
                />
              </Box>

              {/* Organization Details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Organization Details
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Daily Capacity</InputLabel>
                  <Select
                    value={formData.capacity}
                    onChange={handleSelectChange('capacity')}
                    label="Daily Capacity"
                    sx={{ borderRadius: 2 }}
                  >
                    {capacityOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ fontSize: 16, color: '#9C27B0' }} />
                          {option}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Operating Hours"
                  value={formData.operatingHours}
                  onChange={handleInputChange('operatingHours')}
                  placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                  sx={{ borderRadius: 2, mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Organization Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Tell us about your organization, your mission, and how you serve your community..."
                  sx={{ borderRadius: 2, mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Special Instructions for Volunteers"
                  multiline
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={handleInputChange('specialInstructions')}
                  placeholder="Any specific instructions for volunteers when they deliver packages to your location..."
                  sx={{ borderRadius: 2 }}
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.organizationName || !formData.contactName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.organizationType}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    bgcolor: '#9C27B0',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#7b1fa2' },
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

export default FoodBankProfileSetup;
