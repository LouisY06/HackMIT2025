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
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
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
    'Restaurant',
    'Grocery Store',
    'Bakery',
    'Cafe',
    'Catering Service',
    'Food Truck',
    'Deli',
    'Supermarket',
    'Convenience Store',
    'Other Food Business',
  ];

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.storeName || !formData.ownerName || !formData.email || !formData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const response = await fetch(`${API_BASE_URL}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: user.uid,
          store_name: formData.storeName,
          owner_name: formData.ownerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          store_type: formData.storeType,
          business_license: formData.businessLicense,
          description: formData.description,
          operating_hours: formData.operatingHours,
          special_instructions: formData.specialInstructions,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Store profile created successfully:', data);
      
      navigate('/store/dashboard');
    } catch (error) {
      console.error('Error creating store profile:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/RestLogin.png)',
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
          onClick={() => navigate('/store-login')}
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
                background: 'rgba(122, 139, 92, 0.2)',
                mb: 3,
              }}
            >
              <Store sx={{ fontSize: 40, color: '#7A8B5C' }} />
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
              Set Up Your Store Profile
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
              Tell us about your business so we can help you reduce waste and serve your community
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
                {/* Business Information Section */}
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
                    <Business sx={{ color: '#7A8B5C' }} />
                    Business Information
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      name="storeName"
                      label="Store Name *"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                    <TextField
                      name="ownerName"
                      label="Owner Name *"
                      value={formData.ownerName}
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

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <FormControl fullWidth>
                      <InputLabel>Store Type *</InputLabel>
                      <Select
                        name="storeType"
                        value={formData.storeType}
                        onChange={handleSelectChange}
                        label="Store Type *"
                        required
                      >
                        {storeTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      name="businessLicense"
                      label="Business License Number"
                      value={formData.businessLicense}
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
                    <LocationOn sx={{ color: '#7A8B5C' }} />
                    Location Details
                  </Typography>
                  
                  <TextField
                    name="address"
                    label="Street Address *"
                    value={formData.address}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    sx={{ mb: 3 }}
                  />
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
                    <TextField
                      name="city"
                      label="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      fullWidth
                    />
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        name="state"
                        value={formData.state}
                        onChange={handleSelectChange}
                        label="State"
                      >
                        {stateOptions.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      name="zipCode"
                      label="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Box>
                </Box>

                {/* Additional Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      mb: 2,
                      color: '#2C3E50',
                    }}
                  >
                    Additional Information
                  </Typography>
                  
                  <TextField
                    name="operatingHours"
                    label="Operating Hours"
                    value={formData.operatingHours}
                    onChange={handleInputChange}
                    fullWidth
                    placeholder="e.g., Mon-Fri 9AM-9PM, Sat-Sun 10AM-8PM"
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    name="description"
                    label="Business Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe your business and the types of food you typically have available..."
                    sx={{ mb: 3 }}
                  />
                  
                  <TextField
                    name="specialInstructions"
                    label="Special Instructions for Pickups"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Any special instructions for volunteers picking up food (loading dock, specific entrance, etc.)..."
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
                    background: '#7A8B5C',
                    py: 2,
                    fontSize: '1.1rem',
                    fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                    fontWeight: 400,
                    borderRadius: '12px',
                    '&:hover': {
                      background: '#65734D',
                    },
                    '&:disabled': {
                      background: '#7A8B5C',
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

export default StoreProfileSetup;