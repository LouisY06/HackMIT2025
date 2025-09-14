import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Package, CheckCircle } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS, apiCall } from '../config/api';
import { auth } from '../config/firebase';

const FoodBankDeliveryConfirm: React.FC = () => {
  const [packageId, setPackageId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleConfirmDelivery = async () => {
    if (!packageId || !pin) {
      setError('Please enter both Package ID and PIN');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      const result = await apiCall(API_ENDPOINTS.DELIVER_PACKAGE(parseInt(packageId)), {
        method: 'POST',
        body: JSON.stringify({
          pin: pin,
          foodbank_id: user?.uid || ''
        })
      });

      if (result.success) {
        setSuccess(`✅ Package ${packageId} delivery confirmed successfully!`);
        setPackageId('');
        setPin('');
        setConfirmDialogOpen(false);
      } else {
        setError(result.error || 'Failed to confirm delivery');
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!packageId || !pin) {
      setError('Please enter both Package ID and PIN');
      return;
    }
    setConfirmDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', p: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          📦 Confirm Package Delivery
        </Typography>

        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Package size={32} color="#4CAF50" />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Delivery Confirmation
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              When a volunteer arrives with a package, enter the Package ID and PIN they provide to confirm delivery.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Package ID"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="Enter package ID"
              sx={{ mb: 3 }}
              type="number"
            />

            <TextField
              fullWidth
              label="Delivery PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              inputProps={{ 
                maxLength: 4,
                style: { 
                  textAlign: 'center', 
                  fontSize: '1.5rem',
                  fontFamily: 'monospace'
                }
              }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !packageId || !pin || pin.length !== 4}
              sx={{
                py: 2,
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#45a049' },
                fontSize: '1.1rem'
              }}
            >
              {loading ? 'Confirming...' : 'Confirm Delivery'}
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: '2px solid #E3F2FD' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976D2' }}>
              📋 Instructions:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              1. **Ask volunteer** for the Package ID and PIN
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              2. **Enter both values** in the form above
            </Typography>
            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              3. **Click Confirm** to complete the delivery ✅
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          <CheckCircle size={48} color="#4CAF50" style={{ marginBottom: '8px' }} />
          <br />
          Confirm Delivery
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            Please confirm the delivery details:
          </Typography>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Package ID: {packageId}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
              PIN: {pin}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelivery}
            variant="contained"
            sx={{ 
              minWidth: 100,
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
            disabled={loading}
          >
            {loading ? 'Confirming...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodBankDeliveryConfirm;
