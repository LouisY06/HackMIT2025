import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Avatar,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
} from '@mui/material';
import {
  QrCodeScanner,
  LocalShipping,
  Assessment,
  ExitToApp,
  Refresh,
  FileDownload,
  Search,
  Person,
  Scale,
  Home,
  TrendingUp,
} from '@mui/icons-material';

const FoodBankDeliveryLog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState('All Stores');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data - in real app this would come from API
  const deliveryMetrics = {
    totalDeliveries: 0,
    totalWeight: '0.0 lbs received',
    pointsAwarded: 0,
    co2Prevented: '0.0 lbs CO₂e',
  };

  const deliveries: any[] = []; // Empty for now to show "No deliveries found"

  const stores = ['All Stores', 'Flour Bakery', 'Campus Café', 'Corner Deli', 'Green Market'];
  const dateFilters = ['Today', 'This Week', 'This Month', 'All Time'];

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // In real app, this would fetch new data from API
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In real app, this would trigger API refresh
  };

  const handleExportCSV = () => {
    // In real app, this would generate and download CSV
    alert('Export CSV functionality coming soon!');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStore('All Stores');
    setSelectedDate('Today');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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
              sx={{ color: '#666', '&:hover': { bgcolor: '#f0f0f0' } }}
              onClick={() => navigate('/foodbank/dashboard')}
            >
              Scanner
            </Button>
            <Button
              startIcon={<LocalShipping />}
              sx={{
                bgcolor: '#4CAF50',
                color: 'white',
                px: 3,
                borderRadius: 2,
                '&:hover': { bgcolor: '#45a049' },
              }}
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
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Delivery Log
            </Typography>
            <Typography variant="h6" sx={{ color: '#666' }}>
              Track all verified food deliveries to Cambridge Food Bank
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              sx={{ borderRadius: 2 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleExportCSV}
              sx={{
                bgcolor: '#2196F3',
                borderRadius: 2,
                '&:hover': { bgcolor: '#1976D2' }
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography sx={{ fontSize: 40, color: '#2196F3', mb: 2 }}>📦</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {deliveryMetrics.totalDeliveries}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Total Deliveries
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <Scale sx={{ fontSize: 40, color: '#4CAF50', mr: 1 }} />
                <TrendingUp sx={{ fontSize: 24, color: '#2196F3' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {deliveryMetrics.totalWeight}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Total Weight
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Person sx={{ fontSize: 40, color: '#9C27B0', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {deliveryMetrics.pointsAwarded}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                Points Awarded
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Home sx={{ fontSize: 40, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {deliveryMetrics.co2Prevented}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                CO₂ Prevented
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: '1 1 300px', minWidth: '250px' }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Store Filter</InputLabel>
                <Select
                  value={selectedStore}
                  label="Store Filter"
                  onChange={(e) => setSelectedStore(e.target.value)}
                >
                  {stores.map((store) => (
                    <MenuItem key={store} value={store}>
                      {store}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Date Filter</InputLabel>
                <Select
                  value={selectedDate}
                  label="Date Filter"
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {dateFilters.map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Delivery Table */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Verified Deliveries ({deliveries.length})
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Real-time log of all incoming food deliveries
              </Typography>
            </Box>

            {deliveries.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 8,
                textAlign: 'center'
              }}>
                <Typography sx={{ fontSize: 80, mb: 2 }}>📦</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  No deliveries found
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                  Try adjusting your filters
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleResetFilters}
                  sx={{
                    bgcolor: '#424242',
                    borderRadius: 2,
                    '&:hover': { bgcolor: '#303030' }
                  }}
                >
                  Reset Filters
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Volunteer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Store</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Food Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveries.map((delivery, index) => (
                      <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                        <TableCell>{delivery.volunteer}</TableCell>
                        <TableCell>{delivery.store}</TableCell>
                        <TableCell>{delivery.weight}</TableCell>
                        <TableCell>{delivery.foodType}</TableCell>
                        <TableCell>{delivery.time}</TableCell>
                        <TableCell>
                          <Chip 
                            label={delivery.status} 
                            size="small"
                            sx={{ 
                              bgcolor: '#4CAF50', 
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Auto-refresh Status */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            Auto-refreshing every 10 seconds • Last updated: {formatTime(lastUpdated)}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default FoodBankDeliveryLog;
