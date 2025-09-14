import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Pin, CheckCircle, Error, Close } from '@mui/icons-material';
import { API_BASE_URL, API_ENDPOINTS, apiCall } from '../config/api';
import { auth } from '../config/firebase';

interface PinEntryModalProps {
  open: boolean;
  onClose: () => void;
  onPinVerified: (packageId: number) => void;
  onPinError: (error: string) => void;
  packageId?: number;
  storeName?: string;
  title?: string;
}

const PinEntryModal: React.FC<PinEntryModalProps> = ({
  open,
  onClose,
  onPinVerified,
  onPinError,
  packageId,
  storeName,
  title = "Enter Pickup PIN"
}) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    if (!packageId) {
      setError('No package selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get current user ID from Firebase Auth
      const user = auth.currentUser;
      const volunteerId = user?.uid;
      
      if (!volunteerId) {
        setError('Please log in to verify PIN');
        return;
      }

      // Call API to verify PIN using centralized API configuration
      const result = await apiCall(API_ENDPOINTS.VERIFY_PICKUP_PIN(packageId), {
        method: 'POST',
        body: JSON.stringify({
          pin: pin,
          volunteer_id: volunteerId
        })
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onPinVerified(packageId);
          handleClose();
        }, 1500);
      } else {
        setError(result.error || 'Invalid PIN. Please check with the store.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      onPinError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && pin.length === 4 && !loading) {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <Pin sx={{ color: '#4CAF50' }} />
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {packageId && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Package #{packageId}</strong>
              {storeName && (
                <>
                  {' '}from <strong>{storeName}</strong>
                </>
              )}
            </Typography>
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Enter the 4-digit PIN from the store
          </Typography>
          
          <TextField
            autoFocus
            fullWidth
            value={pin}
            onChange={handlePinChange}
            onKeyPress={handleKeyPress}
            placeholder="1234"
            inputProps={{
              style: {
                fontSize: '2rem',
                textAlign: 'center',
                letterSpacing: '0.5em',
                fontFamily: 'monospace'
              },
              maxLength: 4
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: success ? '#f1f8e9' : error ? '#ffebee' : '#f8f9fa',
                '& fieldset': {
                  borderColor: success ? '#4CAF50' : error ? '#f44336' : '#ddd',
                  borderWidth: 2
                }
              }
            }}
            disabled={loading || success}
          />

          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            Ask the store employee for the pickup PIN
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Error />
              {error}
            </Box>
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle />
              PIN verified! Package assigned successfully.
            </Box>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={handleClose}
          startIcon={<Close />}
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={pin.length !== 4 || loading || success}
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': { backgroundColor: '#45a049' },
            minWidth: 120
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              Verifying...
            </Box>
          ) : success ? (
            'Verified!'
          ) : (
            'Verify PIN'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PinEntryModal;
