import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Package, Home, BarChart3, TrendingUp, LogOut, Camera, X, RotateCw } from 'lucide-react';
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
  
  // Camera and AI analysis states
  const [showCamera, setShowCamera] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

      // Check if user is authenticated
      if (!auth.currentUser?.email) {
        setError('Please log in to create a package');
        setLoading(false);
        return;
      }

      // Submit to backend using the correct API endpoint
      const result = await apiCall(API_ENDPOINTS.CREATE_PACKAGE, {
        method: 'POST',
        body: JSON.stringify({
          store_name: 'Flour Bakery', // This would come from user profile
          store_email: auth.currentUser.email,
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

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
      setError('');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
        analyzeImage(imageDataUrl);
      }
    }
  }, [stopCamera]);

  const analyzeImage = async (imageDataUrl: string) => {
    setAnalyzing(true);
    setError('');
    
    try {
      const response = await apiCall(API_ENDPOINTS.ANALYZE_FOOD_IMAGE, {
        method: 'POST',
        body: JSON.stringify({ image: imageDataUrl })
      });

      if (response.success) {
        const { analysis } = response;
        
        // Auto-fill the form with AI analysis
        setFormData(prev => ({
          ...prev,
          food_type: analysis.food_type,
          weight_lbs: analysis.estimated_weight_lbs.toString()
        }));
        
        setSuccess(`AI Analysis Complete! Food type: ${analysis.food_type}, Estimated weight: ${analysis.estimated_weight_lbs} lbs (${analysis.confidence} confidence)`);
      } else {
        setError(response.error || 'Failed to analyze image');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again or fill manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <img 
            src="/LogoOutlined.png" 
            alt="Reflourish Logo" 
            style={{ 
              height: '56px', 
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button onClick={() => navigate('/store/dashboard')} sx={{ color: '#666' }}>
              <Home size={16} style={{ marginRight: '4px' }} /> Dashboard
            </Button>
            <Button sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              + Create Package
            </Button>
            <Button onClick={() => navigate('/store/packages')} sx={{ color: '#666' }}>
              <Package size={16} style={{ marginRight: '4px' }} /> Packages
            </Button>
            <Button onClick={() => navigate('/store/impact')} sx={{ color: '#666' }}>
              <BarChart3 size={16} style={{ marginRight: '4px' }} /> Impact
            </Button>
            <Button onClick={() => navigate('/store/global-impact')} sx={{ color: '#666' }}>
              <TrendingUp size={16} style={{ marginRight: '4px' }} /> Global Impact
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Sarah Williams
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Partner
          </Typography>
          <Button onClick={() => navigate('/store')} sx={{ color: '#666' }}>
            <LogOut size={16} style={{ marginRight: '4px' }} /> Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/store/dashboard')} sx={{ mb: 2, color: '#666' }}>
            ← Back to Dashboard
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Create New Package
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            List surplus food for volunteer pickup
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>
            {success}
          </Alert>
        )}

        {pickupPin && (
          <Card sx={{ borderRadius: 3, p: 4, mb: 3, border: '2px solid #4CAF50' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Typography sx={{ fontSize: 24 }}>🔢</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  Pickup PIN Generated
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 3,
                  border: '2px dashed #4CAF50'
                }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#666' }}>
                    Give this PIN to the volunteer:
                  </Typography>
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
                
                <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#4CAF50' }}>
                    📋 Instructions:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    1. **Tell the volunteer this PIN** when they arrive
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    2. **Volunteer enters PIN** in their app
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    3. **Package confirmed** - pickup complete! ✅
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* AI-Powered Photo Analysis */}
        <Card sx={{ borderRadius: 3, p: 4, mb: 3, backgroundColor: '#f0f8ff', border: '2px solid #2196F3' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Camera size={24} color="#2196F3" />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                AI-Powered Food Analysis
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Take a photo of your food to automatically identify the type and estimate weight using AI
            </Typography>

            {!showCamera && !capturedImage && (
              <Button
                variant="contained"
                startIcon={<Camera />}
                onClick={startCamera}
                sx={{
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' },
                  borderRadius: 2,
                  px: 3,
                  py: 1.5
                }}
              >
                📸 Take Photo for AI Analysis
              </Button>
            )}

            {showCamera && (
              <Box sx={{ position: 'relative' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={capturePhoto}
                    sx={{
                      backgroundColor: '#4CAF50',
                      '&:hover': { backgroundColor: '#45a049' }
                    }}
                  >
                    📷 Capture
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={stopCamera}
                    startIcon={<X />}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            {capturedImage && (
              <Box>
                <img
                  src={capturedImage}
                  alt="Captured food"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  {analyzing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={20} />
                      <Typography>🤖 AI is analyzing your food...</Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<RotateCw />}
                      onClick={retakePhoto}
                    >
                      Retake Photo
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, p: 4 }}>
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
      </Container>
    </Box>
  );
};

export default StoreCreatePackage;
