import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Package, Home, BarChart3, TrendingUp, LogOut, Search, Calendar, Smartphone, Users, Store, ArrowRight, RefreshCw } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';

interface PackageData {
  id: number;
  store_name: string;
  store_email: string;
  weight_lbs: number;
  food_type: string;
  pickup_window_start: string;
  pickup_window_end: string;
  special_instructions: string;
  pickup_pin: string;
  status: string;
  created_at: string;
  volunteer_id: string | null;
  pickup_completed_at: string | null;
}

const StorePackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Available' },
    { value: 'assigned', label: 'Assigned to Volunteer' },
    { value: 'picked_up', label: 'Picked Up' },
    { value: 'completed', label: 'Delivered' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bgcolor: '#e3f2fd', color: '#1976d2' }; // Blue for Available
      case 'assigned':
        return { bgcolor: '#fff3e0', color: '#f57c00' }; // Orange for Assigned
      case 'picked_up':
        return { bgcolor: '#f3e5f5', color: '#7b1fa2' }; // Purple for Picked Up
      case 'completed':
        return { bgcolor: '#e8f5e8', color: '#2e7d32' }; // Green for Delivered
      default:
        return { bgcolor: '#f5f5f5', color: '#666' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Available';
      case 'assigned':
        return 'Assigned to Volunteer';
      case 'picked_up':
        return 'Picked Up';
      case 'completed':
        return 'Delivered';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  const calculateSummary = () => {
    const available = packages.filter(p => p.status === 'pending').length;
    const inProgress = packages.filter(p => p.status === 'assigned' || p.status === 'picked_up').length;
    const completed = packages.filter(p => p.status === 'completed').length;
    const totalWeight = packages.reduce((sum, p) => sum + p.weight_lbs, 0);
    
    return { available, inProgress, completed, totalWeight };
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.food_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(pkg => pkg.status === statusFilter);
    }

    setFilteredPackages(filtered);
  }, [packages, searchTerm, statusFilter]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      // Get current user's email from Firebase auth
      const currentUser = auth.currentUser;
      const userEmail = currentUser?.email || 'sarah@flourbakery.com'; // fallback for testing
      
      const response = await fetch(`${API_BASE_URL}/api/packages/store/${userEmail}`);
      const result = await response.json();
      
      if (result.success) {
        setPackages(result.packages);
      } else {
        setError(result.error || 'Failed to fetch packages');
      }
    } catch (err) {
      setError('Network error. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const summary = calculateSummary();

  const handleViewPin = (pkg: PackageData) => {
    setSelectedPackage(pkg);
    setShowPinModal(true);
  };

  const handleClosePinModal = () => {
    setShowPinModal(false);
    setSelectedPackage(null);
  };

  const handleDeletePackage = async (pkg: PackageData) => {
    if (pkg.status !== 'pending') {
      alert('Cannot delete packages that are assigned, picked up, or completed.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this package?\n\n` +
      `Package ID: ${pkg.id}\n` +
      `Food Type: ${pkg.food_type}\n` +
      `Weight: ${pkg.weight_lbs} lbs\n\n` +
      `This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const result = await apiCall(API_ENDPOINTS.DELETE_PACKAGE(pkg.id), {
        method: 'DELETE'
      });

      if (result.success) {
        alert('Package deleted successfully!');
        // Refresh the packages list
        fetchPackages();
      } else {
        alert(`Failed to delete package: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Network error. Please try again.');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
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
                    Package Management
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
                      Manage all your food packages
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
                  icon={<Package size={16} />}
                  label={`${filteredPackages.length} packages`}
                  sx={{
                    background: 'linear-gradient(135deg, #848D58 0%, #6F7549 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    px: 1,
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
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

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': { 
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                },
              }
            }}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            renderValue={(selected) => {
              if (!selected || selected === '') {
                return <span style={{ color: '#666', fontSize: '14px' }}>All Status</span>;
              }
              const option = statusOptions.find(opt => opt.value === selected);
              return option ? option.label : selected;
            }}
            sx={{ 
              minWidth: 150,
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.7)',
              },
            }}
          >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            </Box>
          </motion.div>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              {error}
            </Alert>
          )}

          {/* Your Packages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(132, 141, 88, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Package size={24} color="#848D58" />
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
                    }}
                  >
                    Your Packages ({filteredPackages.length})
                  </Typography>
                  <Chip 
                    label="Active"
                    size="small"
                    sx={{
                      backgroundColor: '#848D5820',
                      color: '#848D58',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#848D58' }} />
                  </Box>
                ) : (
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: 'none', 
                      border: '1px solid rgba(132, 141, 88, 0.2)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                <Table>
                  <TableHead>
                      <TableRow sx={{ bgcolor: 'rgba(132, 141, 88, 0.1)' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Package ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Food Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Volunteer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell>pkg-{pkg.id}</TableCell>
                        <TableCell>{pkg.food_type}</TableCell>
                        <TableCell>{pkg.weight_lbs} lbs</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(pkg.status)}
                            sx={{
                              ...getStatusColor(pkg.status),
                              borderRadius: 3,
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {pkg.volunteer_id ? `Volunteer ${pkg.volunteer_id}` : 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Calendar size={16} style={{ marginRight: '4px' }} /> {formatDate(pkg.created_at)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewPin(pkg)}
                              sx={{
                                bgcolor: '#e8f5e8',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#c8e6c9' }
                              }}
                              title="View Pickup PIN"
                            >
                              <Smartphone size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: '#e3f2fd',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#bbdefb' }
                              }}
                              title="Assign Volunteer"
                            >
                              <Users size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePackage(pkg)}
                              disabled={pkg.status !== 'pending'}
                              sx={{
                                bgcolor: pkg.status === 'pending' ? '#ffebee' : '#f5f5f5',
                                borderRadius: 2,
                                '&:hover': { bgcolor: pkg.status === 'pending' ? '#ffcdd2' : '#f5f5f5' },
                                opacity: pkg.status === 'pending' ? 1 : 0.5
                              }}
                              title={pkg.status === 'pending' ? "Delete Package" : "Cannot delete assigned/completed packages"}
                            >
                              ❌
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPackages.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" sx={{ color: '#666' }}>
                            No packages found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, mb: 4 }}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                      {summary.available}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Available
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                      {summary.inProgress}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      In Progress
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                      {summary.completed}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Completed
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
                    color: 'white',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                      {summary.totalWeight.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                      Lbs Total
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* PIN Display Modal */}
      {showPinModal && selectedPackage && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleClosePinModal}
        >
          <Card
            sx={{
              maxWidth: 480,
              width: '90%',
              borderRadius: 4,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              bgcolor: '#f8f9fa',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Smartphone size={24} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 0.5 }}>
                      Pickup PIN
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Give this PIN to volunteers for pickup verification
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  onClick={handleClosePinModal} 
                  sx={{ 
                    color: '#666',
                    bgcolor: '#f0f0f0',
                    '&:hover': { bgcolor: '#e0e0e0' },
                    borderRadius: 2,
                  }}
                >
                  ✕
                </IconButton>
              </Box>

              {/* Package Details */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  Package ID: pkg-{selectedPackage.id}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  Food Type: {selectedPackage.food_type}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  Weight: {selectedPackage.weight_lbs} lbs
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                  Pickup Window: {selectedPackage.pickup_window_start} - {selectedPackage.pickup_window_end}
                </Typography>
              </Box>

              {/* PIN Display */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Card
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 3,
                    p: 4,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #4CAF50',
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2, fontWeight: 'bold' }}>
                      Give this PIN to the volunteer:
                    </Typography>
                    <Typography 
                      variant="h1" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        color: '#4CAF50',
                        letterSpacing: '0.3em',
                        fontSize: '4rem',
                        lineHeight: 1
                      }}
                    >
                      {selectedPackage.pickup_pin}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 2, fontStyle: 'italic' }}>
                      Volunteer enters this 4-digit PIN to confirm pickup
                    </Typography>
                  </Box>
                </Card>
              </Box>

              {/* Instructions */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#4CAF50' }}>
                  📋 Instructions:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  1. <strong>Tell the volunteer this PIN</strong> when they arrive
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  2. <strong>Volunteer enters PIN</strong> in their app
                </Typography>
                <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                  3. <strong>Package confirmed</strong> - pickup complete! ✅
                </Typography>
              </Box>

              {/* Close Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleClosePinModal}
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#4CAF50',
                    color: 'white',
                    '&:hover': { bgcolor: '#45a049' },
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  Got it!
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default StorePackages;
