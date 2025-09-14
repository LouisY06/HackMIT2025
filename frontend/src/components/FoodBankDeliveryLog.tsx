import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Package, 
  Leaf, 
  Users,
  TrendingUp,
  Building2,
  Truck,
  BarChart3,
  LogOut,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  IconButton,
  Chip,
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
  InputAdornment,
} from '@mui/material';

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

  return (
    <Box
      sx={{
        backgroundImage: 'url(/FoodbankLogin.png)',
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
                <IconButton 
                  onClick={() => navigate('/foodbank/dashboard')}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <ArrowLeft size={24} />
                </IconButton>
                <Box
                  sx={{
                    width: { xs: 40, sm: 60 },
                    height: { xs: 40, sm: 60 },
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Truck size={28} color="white" />
                </Box>
                <Box>
                  <Typography 
                    variant="h4"
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    Delivery Log
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
                      Track and manage food deliveries
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
                <Chip
                  icon={<CheckCircle size={16} />}
                  label={`${deliveryMetrics.totalDeliveries} deliveries`}
                  sx={{
                    backgroundColor: 'rgba(76, 175, 80, 0.2)', 
                    color: '#4CAF50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
                <Chip
                  icon={<Package size={16} />}
                  label={deliveryMetrics.totalWeight}
                  sx={{
                    backgroundColor: 'rgba(33, 150, 243, 0.2)', 
                    color: '#2196F3',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    fontWeight: 'bold'
                  }} 
                />
                <IconButton 
                  onClick={() => navigate('/foodbank/dashboard')}
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { 
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <LogOut size={20} />
                </IconButton>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* Filters and Controls */}
          <Card sx={{ 
            borderRadius: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Delivery Filters
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshCw size={18} />}
                      onClick={handleRefresh}
                      sx={{
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          background: 'rgba(76, 175, 80, 0.1)',
                        },
                      }}
                    >
                      Refresh
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Download size={18} />}
                      onClick={handleExportCSV}
                      sx={{
                        borderColor: '#2196F3',
                        color: '#2196F3',
                        '&:hover': {
                          borderColor: '#1976D2',
                          background: 'rgba(33, 150, 243, 0.1)',
                        },
                      }}
                    >
                      Export CSV
                    </Button>
                  </motion.div>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search deliveries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} color="#666" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel>Store Filter</InputLabel>
                  <Select
                    value={selectedStore}
                    label="Store Filter"
                    onChange={(e) => setSelectedStore(e.target.value)}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {stores.map((store) => (
                      <MenuItem key={store} value={store}>
                        {store}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={selectedDate}
                    label="Date Range"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {dateFilters.map((filter) => (
                      <MenuItem key={filter} value={filter}>
                        {filter}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Typography>
                <Button
                  variant="text"
                  onClick={handleResetFilters}
                  sx={{ color: '#666', textTransform: 'none' }}
                >
                  Reset Filters
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Delivery Table */}
          <Card sx={{ 
            borderRadius: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Delivery History
                </Typography>
              </Box>

              {deliveries.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Package size={64} style={{ color: '#ccc', marginBottom: '16px' }} />
                  <Typography variant="h5" sx={{ color: '#666', mb: 2, fontWeight: 'bold' }}>
                    No deliveries found
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
                    Deliveries will appear here once volunteers confirm package drop-offs
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Package ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Store</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Volunteer</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Table rows would go here */}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default FoodBankDeliveryLog;