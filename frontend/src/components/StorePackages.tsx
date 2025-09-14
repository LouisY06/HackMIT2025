import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Package, Home, BarChart3, TrendingUp, LogOut, Search, Calendar, Smartphone, Users } from 'lucide-react';
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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, fetch packages
        fetchPackages();
      } else {
        // User is not authenticated, clear packages
        setPackages([]);
      }
    });

    return () => unsubscribe();
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
      if (!currentUser?.email) {
        console.log('No authenticated user, skipping package fetch');
        return;
      }
      
      console.log(`Fetching packages for store: ${currentUser.email}`);
      const response = await fetch(`${API_BASE_URL}/api/packages/store/${currentUser.email}`);
      const result = await response.json();
      
      console.log('Store packages response:', result);
      
      if (result.success) {
        setPackages(result.packages);
        console.log(`Loaded ${result.packages.length} packages for store`);
      } else {
        setError(result.error || 'Failed to fetch packages');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
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
            <Button onClick={() => navigate('/store/create-package')} sx={{ color: '#666' }}>
              + Create Package
            </Button>
            <Button sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Package Management
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              View and manage all your food packages
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/store/create-package')}
            sx={{
              borderRadius: 3,
              bgcolor: '#4CAF50',
              '&:hover': { bgcolor: '#45a049' },
              px: 3,
              py: 1.5,
            }}
          >
            + Create Package
          </Button>
        </Box>

        {/* Search and Filter Bar */}
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
              '& .MuiOutlinedInput-root': { borderRadius: 3 }
            }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 3 }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {/* Your Packages Section */}
        <Card sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Your Packages ({filteredPackages.length})
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  All packages from your store
                </Typography>
              </Box>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
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

        {/* Summary Cards */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3', mb: 1 }}>
                {summary.available}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Available
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800', mb: 1 }}>
                {summary.inProgress}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                In Progress
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                {summary.completed}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Completed
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ flex: '1 1 200px', minWidth: '200px', borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0', mb: 1 }}>
                {summary.totalWeight.toFixed(1)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Lbs Total
              </Typography>
            </CardContent>
          </Card>
        </Box>
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
