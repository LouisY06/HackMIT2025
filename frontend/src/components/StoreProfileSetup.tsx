import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
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
  Store,
  LocationOn,
  Business,
  ArrowForward,
} from '@mui/icons-material';

const StoreProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    storeType: '',
    businessLicense: '',
    description: '',
    operatingHours: '',
    specialInstructions: '',
    latitude: '',
    longitude: '',
  });

  const storeTypes = [
    'Grocery Store',
    'Restaurant',
    'Bakery',
    'Cafe',
    'Convenience Store',
    'Supermarket',
    'Food Market',
    'Deli',
    'Other',
  ];

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent<string>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const fullAddress = `${address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      const encodedAddress = encodeURIComponent(fullAddress);
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.warn('Google Maps API key not found, skipping geocoding');
        return null;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng
        };
      } else {
        console.warn('Geocoding failed:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
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

      // Geocode the address to get latitude and longitude
      let coordinates = null;
      if (formData.address && formData.city && formData.state && formData.zipCode) {
        coordinates = await geocodeAddress(formData.address);
        if (coordinates) {
          formData.latitude = coordinates.lat.toString();
          formData.longitude = coordinates.lng.toString();
        }
      }

      // Save profile to backend
      const response = await fetch('http://localhost:5001/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          email: user.email || formData.email,
          user_type: 'store',
          profile_data: formData
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save profile');
      }
      
      console.log('Store profile saved successfully');
      
      // Navigate to store dashboard
      navigate('/store/dashboard');
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
            bgcolor: '#2196F3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2
          }}>
            <Store sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
            Complete Your Store Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>
            Set up your store profile to start connecting with volunteers and reducing food waste in your community.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Store Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Store Information
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Store Name"
                    value={formData.storeName}
                    onChange={handleInputChange('storeName')}
                    required
                    sx={{ borderRadius: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Owner/Manager Name"
                    value={formData.ownerName}
                    onChange={handleInputChange('ownerName')}
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

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Store Type</InputLabel>
                  <Select
                    value={formData.storeType}
                    onChange={handleSelectChange('storeType')}
                    label="Store Type"
                    sx={{ borderRadius: 2 }}
                  >
                    {storeTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business sx={{ fontSize: 16, color: '#2196F3' }} />
                          {type}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              </Box>

              {/* Business Details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  Business Details
                </Typography>
                
                <TextField
                  fullWidth
                  label="Business License Number"
                  value={formData.businessLicense}
                  onChange={handleInputChange('businessLicense')}
                  sx={{ borderRadius: 2, mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Operating Hours"
                  value={formData.operatingHours}
                  onChange={handleInputChange('operatingHours')}
                  placeholder="e.g., Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-6PM"
                  sx={{ borderRadius: 2, mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Store Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Tell us about your store, what you sell, and your commitment to reducing food waste..."
                  sx={{ borderRadius: 2, mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Special Instructions for Volunteers"
                  multiline
                  rows={2}
                  value={formData.specialInstructions}
                  onChange={handleInputChange('specialInstructions')}
                  placeholder="Any specific instructions for volunteers when they come to pick up packages..."
                  sx={{ borderRadius: 2 }}
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.storeName || !formData.ownerName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.storeType}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                  sx={{
                    bgcolor: '#2196F3',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: '#1976d2' },
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

export default StoreProfileSetup;
