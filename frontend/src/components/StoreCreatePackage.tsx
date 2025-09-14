import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Package, Home, BarChart3, TrendingUp, LogOut, Store, ArrowRight, CheckCircle, ArrowBack } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS, apiCall } from '../config/api';
import { auth } from '../config/firebase';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';

interface PackageFormData {
  weight_lbs: string;
  food_type: string;
  pickup_window_start: string;
  pickup_window_end: string;
  special_instructions: string;
}

const StoreCreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PackageFormData>({
    weight_lbs: '',
    food_type: '',
    pickup_window_start: '',
    pickup_window_end: '',
    special_instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Removed qrCodePath state - using PIN system instead
  const [pickupPin, setPickupPin] = useState('');

  const foodTypes = [
    'Bakery Items',
    'Fresh Produce',
    'Prepared Meals',
    'Dairy Products',
    'Canned Goods',
    'Frozen Items',
    'Mixed Items',
    'Other'
  ];

  const handleInputChange = (field: keyof PackageFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Validate form
      if (!formData.weight_lbs || !formData.food_type || !formData.pickup_window_start || !formData.pickup_window_end) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Submit to backend using the correct API endpoint
      const result = await apiCall(API_ENDPOINTS.CREATE_PACKAGE, {
        method: 'POST',
        body: JSON.stringify({
          store_name: 'Flour Bakery', // This would come from user profile
          store_email: auth.currentUser?.email || 'sarah@flourbakery.com', // Get from Firebase auth
          ...formData,
          weight_lbs: parseFloat(formData.weight_lbs),
        }),
      });

      if (result.success) {
        setSuccess('Package created successfully! PIN generated for pickup.');
        // QR code path no longer needed - using PIN system
        setPickupPin(result.pickup_pin);
        // Don't auto-redirect, let user see the PIN
      } else {
        setError(result.error || 'Failed to create package');
      }
    } catch (err) {
      setError('Network error. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/store/dashboard');
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
        pb: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}
    >
      {/* Header */}
      <Box>
        <Box
          sx={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            p: { xs: 2, md: 3 },
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 60 },
                    height: { xs: 40, sm: 60 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Store size={28} color="white" />
                </Box>
                <Box>
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1.5rem', sm: '2.125rem' },
                    }}
                  >
                    Create Package
                  </Typography>
                  <Box sx={{ 
                    display: { xs: 'none', sm: 'flex' }, 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: 300,
                        fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      List surplus food for volunteer pickup
                    </Typography>
                    <Package size={20} color="rgba(255, 255, 255, 0.8)" />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <IconButton
                  onClick={() => navigate('/')}
                  size="small"
                  sx={{
                    background: 'rgba(132, 141, 88, 0.1)',
                    color: '#848D58',
                    '&:hover': {
                      background: 'rgba(132, 141, 88, 0.2)',
                    },
                  }}
                >
                  <LogOut size={18} />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            {success}
          </Alert>
        )}

        {pickupPin && (
          <Card sx={{ borderRadius: 3, p: 4, mb: 3, border: '2px solid #4CAF50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 3,
                  border: '2px dashed #4CAF50'
                }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#4CAF50',
                      letterSpacing: '0.2em',
                      backgroundColor: 'white',
                      padding: '8px 16px',
                      borderRadius: 2,
                      border: '2px solid #4CAF50'
                    }}
                  >
                    {pickupPin}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Back Button - only show after package creation */}
        {pickupPin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginBottom: '24px' }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/store/dashboard')}
              sx={{
                borderColor: '#7A8B5C',
                color: '#7A8B5C',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#6B7A4F',
                  backgroundColor: 'rgba(122, 139, 92, 0.1)',
                },
              }}
            >
              Back to Dashboard
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            sx={{
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(132, 141, 88, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              p: 4,
            }}
          >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <Package size={24} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Package Information
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Weight (lbs) *"
                    placeholder="e.g., 5.5"
                    type="number"
                    value={formData.weight_lbs}
                    onChange={(e) => handleInputChange('weight_lbs', e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3 }
                    }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Food Type *</InputLabel>
                    <Select
                      value={formData.food_type}
                      label="Food Type *"
                      onChange={(e) => handleInputChange('food_type', e.target.value)}
                      sx={{ borderRadius: 3 }}
                    >
                      <MenuItem value="">Select food type</MenuItem>
                      {foodTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Pickup Window *
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="From"
                    type="time"
                    value={formData.pickup_window_start}
                    onChange={(e) => handleInputChange('pickup_window_start', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3 }
                    }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                  <TextField
                    fullWidth
                    label="To"
                    type="time"
                    value={formData.pickup_window_end}
                    onChange={(e) => handleInputChange('pickup_window_end', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: 3 }
                    }}
                  />
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Special Instructions"
                placeholder="Any special handling instructions for volunteers..."
                multiline
                rows={4}
                value={formData.special_instructions}
                onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 3 }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: '#ccc',
                  color: '#666',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#45a049' },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Creating...
                  </Box>
                ) : (
                  'Create Package & Generate PIN'
                )}
              </Button>
            </Box>
          </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StoreCreatePackage;
