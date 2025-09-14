import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { QrCodeScanner, Close, CheckCircle, Error } from '@mui/icons-material';

interface QRCodeScannerProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (scannedId: string) => void;
  onScanError: (error: string) => void;
  onRetry?: () => void;
  expectedPackageId?: number;
  title?: string;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  open,
  onClose,
  onScanSuccess,
  onScanError,
  onRetry,
  expectedPackageId,
  title = "Scan QR Code"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (open) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      readerRef.current = new BrowserMultiFormatReader();
      
      // First, check if we have camera permissions and prefer back camera
      try {
        // Try to request back camera specifically for mobile devices
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' } // 'environment' = back camera, 'user' = front camera
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
        console.log('Camera permissions granted, back camera preferred');
      } catch (permissionError) {
        console.error('Camera permission denied:', permissionError);
        setError('Camera access denied. Please allow camera permissions and try again.');
        setIsScanning(false);
        return;
      }
      
      // Try to get video devices and prefer back camera for mobile
      let selectedDeviceId = undefined;
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        console.log('Available video devices:', videoInputDevices);
        
        if (videoInputDevices.length > 0) {
          // Look for back/rear camera first (for mobile devices)
          const backCamera = videoInputDevices.find(device => 
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          
          if (backCamera) {
            selectedDeviceId = backCamera.deviceId;
            console.log('Using back camera:', backCamera.label, selectedDeviceId);
          } else {
            // Fall back to first available device
            selectedDeviceId = videoInputDevices[0].deviceId;
            console.log('No back camera found, using first device:', videoInputDevices[0].label, selectedDeviceId);
          }
        } else {
          console.log('No specific devices found, using default');
        }
      } catch (deviceError) {
        console.warn('Could not list video devices, using default:', deviceError);
      }

      // Use constraints-based approach if no specific device found, otherwise use device ID
      if (!selectedDeviceId) {
        // Use constraints to prefer back camera
        const constraints = {
          video: {
            facingMode: { ideal: 'environment' }, // Prefer back camera
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        };
        
        await readerRef.current.decodeFromConstraints(
          constraints,
          videoRef.current!,
          (result, error) => {
            if (result) {
              const scannedText = result.getText();
              console.log('QR Code scanned:', scannedText);
            
            try {
              // Try to parse as JSON (full package data)
              const qrData = JSON.parse(scannedText);
              const scannedPackageId = qrData.package_id;
              
              console.log('Parsed package ID:', scannedPackageId);
              
              // Verify the scanned ID matches expected package ID
              if (expectedPackageId && parseInt(scannedPackageId) !== expectedPackageId) {
                setError(`QR Code mismatch! Expected package ${expectedPackageId}, but scanned ${scannedPackageId}`);
                return;
              }
              
              setScannedResult(scannedPackageId);
              setIsVerifying(true);
              
              // Simulate verification delay
              setTimeout(() => {
                setIsVerifying(false);
                onScanSuccess(scannedPackageId);
                stopScanner();
              }, 1000);
              
            } catch (parseError) {
              // If JSON parsing fails, try as plain text package ID
              console.log('Not JSON, trying as plain package ID:', scannedText);
              
              const scannedId = scannedText.trim();
              
              // Verify the scanned ID matches expected package ID
              if (expectedPackageId && parseInt(scannedId) !== expectedPackageId) {
                setError(`QR Code mismatch! Expected package ${expectedPackageId}, but scanned ${scannedId}`);
                return;
              }
              
              setScannedResult(scannedId);
              setIsVerifying(true);
              
              // Simulate verification delay
              setTimeout(() => {
                setIsVerifying(false);
                onScanSuccess(scannedId);
                stopScanner();
              }, 1000);
            }
            
            if (error && error.name !== 'NotFoundException') {
            console.error('QR Scan error details:', {
              name: error.name,
              message: error.message,
              stack: error.stack
            });
            
            // Provide user-friendly error messages with debug info
            let friendlyMessage = '';
            if (error.message.includes('No MultiFormat Readers were able to detect the code')) {
              friendlyMessage = `
🔍 Unable to detect QR code. This usually means:

📱 **Camera Issues:**
• Try different camera angles
• Clean your camera lens
• Ensure good lighting (not too bright/dark)

📦 **QR Code Issues:**
• Make sure QR code is clear and undamaged
• Hold camera steady (2-6 inches away)
• Only scan QR codes from this app
• Try refreshing the QR code image

🛠️ **Debug Info:**
Error: ${error.name} - ${error.message}

💡 **Quick Test:** Try scanning a simple QR code from another app first to test your camera.
              `.trim();
            } else if (error.message.includes('timeout')) {
              friendlyMessage = 'Scan timeout. Please try again with better lighting or closer positioning.';
            } else if (error.message.includes('format')) {
              friendlyMessage = 'QR code format not recognized. Make sure you\'re scanning a valid package QR code.';
            } else {
              friendlyMessage = `Debug: ${error.name} - ${error.message}`;
            }
            
            setError(friendlyMessage);
            }
          }
        );
      } else {
        // Use specific device ID (back camera if found)
        await readerRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, error) => {
            if (result) {
              const scannedText = result.getText();
              console.log('QR Code scanned:', scannedText);
            
            try {
              // Try to parse as JSON (full package data)
              const qrData = JSON.parse(scannedText);
              const scannedPackageId = qrData.package_id;
              
              console.log('Parsed package ID:', scannedPackageId);
              
              // Verify the scanned ID matches expected package ID
              if (expectedPackageId && parseInt(scannedPackageId) !== expectedPackageId) {
                setError(`QR Code mismatch! Expected package ${expectedPackageId}, but scanned ${scannedPackageId}`);
                return;
              }
              
              setScannedResult(scannedPackageId);
              setIsVerifying(true);
              
              // Simulate verification delay
              setTimeout(() => {
                setIsVerifying(false);
                onScanSuccess(scannedPackageId);
                stopScanner();
              }, 1000);
              
            } catch (parseError) {
              // If JSON parsing fails, try as plain text package ID
              console.log('Not JSON, trying as plain package ID:', scannedText);
              
              const scannedId = scannedText.trim();
              
              // Verify the scanned ID matches expected package ID
              if (expectedPackageId && parseInt(scannedId) !== expectedPackageId) {
                setError(`QR Code mismatch! Expected package ${expectedPackageId}, but scanned ${scannedId}`);
                return;
              }
              
              setScannedResult(scannedId);
              setIsVerifying(true);
              
              // Simulate verification delay
              setTimeout(() => {
                setIsVerifying(false);
                onScanSuccess(scannedId);
                stopScanner();
              }, 1000);
            }
            }
            
            if (error && error.name !== 'NotFoundException') {
            console.error('QR Scan error details:', {
              name: error.name,
              message: error.message,
              stack: error.stack
            });
            
            // Provide user-friendly error messages with debug info
            let friendlyMessage = '';
            if (error.message.includes('No MultiFormat Readers were able to detect the code')) {
              friendlyMessage = `
🔍 Unable to detect QR code. This usually means:

📱 **Camera Issues:**
• Try different camera angles
• Clean your camera lens
• Ensure good lighting (not too bright/dark)

📦 **QR Code Issues:**
• Make sure QR code is clear and undamaged
• Hold camera steady (2-6 inches away)
• Only scan QR codes from this app
• Try refreshing the QR code image

🛠️ **Debug Info:**
Error: ${error.name} - ${error.message}

💡 **Quick Test:** Try scanning a simple QR code from another app first to test your camera.
              `.trim();
            } else if (error.message.includes('timeout')) {
              friendlyMessage = 'Scan timeout. Please try again with better lighting or closer positioning.';
            } else if (error.message.includes('format')) {
              friendlyMessage = 'QR code format not recognized. Make sure you\'re scanning a valid package QR code.';
            } else {
              friendlyMessage = `Debug: ${error.name} - ${error.message}`;
            }
            
            setError(friendlyMessage);
            }
          }
        );
      }
      
    } catch (err: unknown) {
      console.error('Failed to start scanner:', err);
      let errorMessage = 'Failed to start camera';
      
      if (err instanceof Error) {
        const errorMsg = (err as Error).message;
        if (errorMsg.includes('Permission denied')) {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.';
        } else if (errorMsg.includes('NotAllowedError')) {
          errorMessage = 'Camera access blocked. Please check your browser settings.';
        } else if (errorMsg.includes('NotFoundError')) {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (errorMsg.includes('NotSupportedError')) {
          errorMessage = 'Camera not supported. Please use a different browser.';
        } else {
          errorMessage = `Camera error: ${errorMsg}`;
        }
      }
      
      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (readerRef.current) {
      try {
        // Try different methods to stop the scanner
        if (typeof (readerRef.current as any).stopAsyncDecode === 'function') {
          (readerRef.current as any).stopAsyncDecode();
        } else if (typeof (readerRef.current as any).reset === 'function') {
          (readerRef.current as any).reset();
        }
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
      readerRef.current = null;
    }
    setIsScanning(false);
    setScannedResult(null);
    setIsVerifying(false);
  };

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    setScannedResult(null);
    startScanner();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <QrCodeScanner />
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        {expectedPackageId && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Scan the QR code for Package #{expectedPackageId}
          </Alert>
        )}
        
        {isScanning && !error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>📱 Mobile Tip:</strong> The scanner will automatically use your back camera for better QR code scanning.
              <br />
              <strong>🔒 Permissions:</strong> Please allow camera access when prompted by your browser.
            </Typography>
          </Alert>
        )}
        
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '300px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              border: '2px solid #e0e0e0'
            }}
            playsInline
          />
          
          {isScanning && !scannedResult && !error && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: 2,
              borderRadius: 2
            }}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                Scanning for QR code...
              </Typography>
            </Box>
          )}
          
          {isVerifying && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.9)',
              padding: 2,
              borderRadius: 2
            }}>
              <CircularProgress size={24} color="success" />
              <Typography variant="body2" color="success.main">
                Verifying QR code...
              </Typography>
            </Box>
          )}
          
          {scannedResult && !isVerifying && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              padding: 2,
              borderRadius: 2
            }}>
              <CheckCircle sx={{ fontSize: 32 }} />
              <Typography variant="body1" fontWeight="bold">
                QR Code Verified!
              </Typography>
              <Typography variant="body2">
                Package ID: {scannedResult}
              </Typography>
            </Box>
          )}
          
          {error && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              padding: 2,
              borderRadius: 2
            }}>
              <Error sx={{ fontSize: 32 }} />
              <Typography variant="body1" fontWeight="bold">
                Scan Error
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          startIcon={<Close />}
          variant="outlined"
        >
          Cancel
        </Button>
        
        {error && (
          <Button 
            onClick={handleRetry}
            variant="contained"
            color="primary"
          >
            Try Again
          </Button>
        )}
        
        {error && error.includes('permission') && onRetry && (
          <Button 
            onClick={() => {
              setError(null);
              onClose();
              // Give user a moment to allow permissions, then retry
              setTimeout(() => {
                onRetry();
              }, 1000);
            }}
            variant="outlined"
            sx={{ ml: 1 }}
          >
            Allow Camera & Retry
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeScanner;
