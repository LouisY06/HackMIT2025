import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Result } from '@zxing/library';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  QrCodeScanner,
  LocalShipping,
  TrendingUp,
  CheckCircle,
  Keyboard,
  Refresh,
  History,
  Assessment,
  Person,
  ExitToApp,
} from '@mui/icons-material';

const FoodBankDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [, setScanResult] = useState<string | null>(null);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanningControls = useRef<any>(null);

  // Mock data - in real app this would come from API
  const kpiData = {
    todayDeliveries: 12,
    foodReceived: '45.3 lbs today',
    activeVolunteers: 8,
    co2Prevented: '19.9 lbs CO₂e prevented',
    mealsProvided: '104 meals provided',
    familiesHelped: '34 families helped',
  };

  const recentDeliveries = [
    { volunteer: 'Marcus C.', store: 'Flour Bakery', weight: '5.2 lbs', status: 'completed' },
    { volunteer: 'Alex J.', store: 'Campus Café', weight: '3.8 lbs', status: 'completed' },
    { volunteer: 'Emily D.', store: 'Corner Deli', weight: '4.1 lbs', status: 'completed' },
  ];

  // Initialize camera
  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    return () => {
      if (scanningControls.current) {
        scanningControls.current.stop();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraPermission('pending');
      setScanning(true);
      
      if (videoRef.current && codeReader.current) {
        scanningControls.current = await codeReader.current.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result: Result | undefined, error: any) => {
            if (result) {
              setScanResult(result.getText());
              handleScanSuccess(result.getText());
            }
            if (error && error.name !== 'NotFoundException') {
              console.error('Scan error:', error);
            }
          }
        );
        setCameraPermission('granted');
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraPermission('denied');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (scanningControls.current) {
      scanningControls.current.stop();
      scanningControls.current = null;
    }
    setScanning(false);
    setScanResult(null);
  };

  const handleScanSuccess = (qrData: string) => {
    try {
      const packageData = JSON.parse(qrData);
      alert(`Delivery verified successfully!\n\nVolunteer: ${packageData.volunteerName}\nStore: ${packageData.storeName}\nWeight: ${packageData.weight} lbs\nFood Type: ${packageData.foodType}`);
      
      // Reset scanning
      setTimeout(() => {
        stopCamera();
      }, 2000);
    } catch (error) {
      alert(`QR Code scanned: ${qrData}\n\nNote: This appears to be a test QR code. In production, this would contain package verification data.`);
    }
  };

  const handleSimulateScan = () => {
    setScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      alert('Delivery verified successfully! Thank you Marcus C. from Flour Bakery for delivering 5.2 lbs of food.');
    }, 2000);
  };

  const handleManualEntry = () => {
    setManualEntryOpen(true);
  };

  const handleManualVerify = () => {
    if (verificationCode.trim()) {
      setManualEntryOpen(false);
      setVerificationCode('');
      // Simulate verification process
      setTimeout(() => {
        alert(`Delivery verified successfully! Verification code: ${verificationCode}`);
      }, 500);
    }
  };

  const handleManualEntryClose = () => {
    setManualEntryOpen(false);
    setVerificationCode('');
  };

  const handleResetScanner = () => {
    setScanning(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Typography sx={{ fontSize: 24, mr: 1 }}>🌱</Typography>
            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
              Waste→Worth
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mr: 'auto' }}>
            <Button
              startIcon={<QrCodeScanner />}
              sx={{
                bgcolor: '#4CAF50',
                color: 'white',
                px: 3,
                borderRadius: 2,
                '&:hover': { bgcolor: '#45a049' },
              }}
            >
              Scanner
            </Button>
            <Button
              startIcon={<LocalShipping />}
              sx={{ color: '#666', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/foodbank/delivery-log')}
            >
              Delivery Log
            </Button>
            <Button
              startIcon={<Assessment />}
              sx={{ color: '#666', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/foodbank/global-impact')}
            >
              Global Impact
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                Lisa Rodriguez
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                Coordinator
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#9C27B0' }}>LR</Avatar>
            <IconButton onClick={() => navigate('/foodbank')}>
              <ExitToApp sx={{ color: '#666' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome, Lisa Rodriguez!
          </Typography>
          <Typography variant="h6" sx={{ color: '#666' }}>
            Cambridge Food Bank • Verify incoming food deliveries
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 300px', minWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircle sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {kpiData.todayDeliveries}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Today's Deliveries
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 300px', minWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: '#9C27B0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>F</Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {kpiData.foodReceived}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Food Received
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 300px', minWidth: '250px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: '#9C27B0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto',
                mb: 2
              }}>
                <Person sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {kpiData.activeVolunteers}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Active Volunteers
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Left Column - Scanner */}
          <Box sx={{ flex: '2 1 600px', minWidth: '500px' }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <QrCodeScanner sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Delivery Verification Scanner
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
                  Scan volunteer QR codes to verify completed deliveries
                </Typography>

                {/* Scanner Area */}
                <Box sx={{
                  width: '100%',
                  height: 400,
                  bgcolor: 'white',
                  border: '2px dashed #ddd',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {scanning && cameraPermission === 'granted' ? (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                      <video
                        ref={videoRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                        autoPlay
                        playsInline
                      />
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 200,
                        height: 200,
                        border: '3px solid #4CAF50',
                        borderRadius: 2,
                        pointerEvents: 'none'
                      }} />
                      <Typography
                        variant="body2"
                        sx={{
                          position: 'absolute',
                          bottom: 20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          color: '#4CAF50',
                          fontWeight: 'bold',
                          bgcolor: 'rgba(255,255,255,0.9)',
                          px: 2,
                          py: 1,
                          borderRadius: 1
                        }}
                      >
                        Position QR code within the frame
                      </Typography>
                    </Box>
                  ) : scanning && cameraPermission === 'pending' ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: '4px solid #4CAF50',
                        borderTop: '4px solid transparent',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto',
                        mb: 2
                      }} />
                      <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        Starting Camera...
                      </Typography>
                    </Box>
                  ) : cameraPermission === 'denied' ? (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ fontSize: 80, mb: 2 }}>🚫</Typography>
                      <Typography variant="h6" sx={{ color: '#f44336', mb: 1 }}>
                        Camera Access Denied
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        Please allow camera access to scan QR codes
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center' }}>
                      <QrCodeScanner sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                        Ready to Scan
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#999' }}>
                        Click "Start Camera" to begin scanning
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Scanner Controls */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  {!scanning ? (
                    <Button
                      variant="contained"
                      startIcon={<QrCodeScanner />}
                      onClick={startCamera}
                      sx={{ 
                        bgcolor: '#4CAF50',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#45a049' }
                      }}
                    >
                      Start Camera
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<Refresh />}
                      onClick={stopCamera}
                      sx={{ 
                        bgcolor: '#f44336',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#d32f2f' }
                      }}
                    >
                      Stop Camera
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    startIcon={<Keyboard />}
                    onClick={handleManualEntry}
                    sx={{ borderRadius: 2 }}
                  >
                    Manual Entry
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => {
                      stopCamera();
                      setCameraPermission('pending');
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Reset Scanner
                  </Button>
                </Box>

                {/* Demo Mode */}
                <Box sx={{ bgcolor: '#e3f2fd', borderRadius: 3, p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                    Demo Mode
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleSimulateScan}
                    sx={{
                      bgcolor: '#1976d2',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#1565c0' }
                    }}
                  >
                    Simulate Successful Scan
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Sidebar */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Quick Actions */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<History />}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                      onClick={() => navigate('/foodbank/delivery-log')}
                    >
                      View Delivery Log
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Assessment />}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                      onClick={() => navigate('/store/global-impact')}
                    >
                      Global Impact
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<QrCodeScanner />}
                      sx={{ justifyContent: 'flex-start', borderRadius: 2 }}
                      onClick={handleResetScanner}
                    >
                      Reset Scanner
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Today's Impact */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography sx={{ fontSize: 20, color: '#4CAF50', mr: 1 }}>🌱</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Today's Impact
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: '#4CAF50', 
                    color: 'white', 
                    borderRadius: 3, 
                    p: 3, 
                    mb: 2,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {kpiData.co2Prevented}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip 
                      label={kpiData.mealsProvided} 
                      sx={{ 
                        bgcolor: '#e3f2fd', 
                        color: '#1976d2',
                        fontWeight: 'bold',
                        flex: 1
                      }} 
                    />
                    <Chip 
                      label={kpiData.familiesHelped} 
                      sx={{ 
                        bgcolor: '#f3e5f5', 
                        color: '#9c27b0',
                        fontWeight: 'bold',
                        flex: 1
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* How to Verify */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <TrendingUp sx={{ color: '#4CAF50', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      How to Verify
                    </Typography>
                  </Box>
                  
                  <Box component="ol" sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Ask volunteer to show their delivery QR code
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Position code within scanner frame
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Wait for automatic verification
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Confirm package details match
                    </Typography>
                    <Typography component="li" variant="body2">
                      Welcome food delivery to your facility!
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* Recent Deliveries */}
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                    Recent Deliveries
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentDeliveries.map((delivery, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        p: 2,
                        bgcolor: '#f9f9f9',
                        borderRadius: 2
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {delivery.volunteer} • {delivery.store}
                          </Typography>
                        </Box>
                        <Chip 
                          label={delivery.weight} 
                          size="small"
                          sx={{ 
                            bgcolor: '#4CAF50', 
                            color: 'white',
                            fontWeight: 'bold'
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Manual Entry Modal */}
      <Dialog 
        open={manualEntryOpen} 
        onClose={handleManualEntryClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Keyboard sx={{ color: '#4CAF50' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Manual Delivery Verification
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#666', mb: 3, textAlign: 'center' }}>
            Enter the verification code provided by the volunteer to verify their delivery
          </Typography>
          <TextField
            fullWidth
            label="Verification Code"
            placeholder="Enter verification code..."
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            autoFocus
          />
          <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>
            The verification code is typically a 6-8 digit alphanumeric code provided when the volunteer accepts a delivery package.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleManualEntryClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleManualVerify}
            variant="contained"
            disabled={!verificationCode.trim()}
            sx={{ 
              bgcolor: '#4CAF50',
              borderRadius: 2,
              '&:hover': { bgcolor: '#45a049' }
            }}
          >
            Verify Delivery
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default FoodBankDashboard;
