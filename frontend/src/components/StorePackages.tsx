import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface Package {
  id: number;
  store_name: string;
  store_email: string;
  weight_lbs: number;
  food_type: string;
  pickup_window_start: string;
  pickup_window_end: string;
  special_instructions: string;
  qr_code_data: string;
  qr_code_image_path: string;
  status: string;
  created_at: string;
  volunteer_id: string | null;
  pickup_completed_at: string | null;
}

const StorePackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Available' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bgcolor: '#e3f2fd', color: '#1976d2' }; // Blue for Available
      case 'in-progress':
        return { bgcolor: '#fff3e0', color: '#f57c00' }; // Orange for In Progress
      case 'completed':
        return { bgcolor: '#e8f5e8', color: '#2e7d32' }; // Green for Completed
      default:
        return { bgcolor: '#f5f5f5', color: '#666' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Available';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
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
    const inProgress = packages.filter(p => p.status === 'in-progress').length;
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
      const response = await fetch('http://localhost:5001/api/packages/store/sarah@flourbakery.com');
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

  const handleViewQrCode = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowQrModal(true);
  };

  const handleCloseQrModal = () => {
    setShowQrModal(false);
    setSelectedPackage(null);
  };

  const handleDownloadQrCode = () => {
    if (selectedPackage?.qr_code_image_path) {
      const link = document.createElement('a');
      link.href = `http://localhost:5001/uploads/${selectedPackage.qr_code_image_path.split('/').pop()}`;
      link.download = `qr-code-pkg-${selectedPackage.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
            🌱 Waste→Worth
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button onClick={() => navigate('/store/dashboard')} sx={{ color: '#666' }}>
              🏠 Dashboard
            </Button>
            <Button onClick={() => navigate('/store/create-package')} sx={{ color: '#666' }}>
              + Create Package
            </Button>
            <Button sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              📦 Packages
            </Button>
            <Button onClick={() => navigate('/store/impact')} sx={{ color: '#666' }}>
              📊 Impact
            </Button>
            <Button onClick={() => navigate('/store/global-impact')} sx={{ color: '#666' }}>
              📈 Global Impact
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
            🚪 Logout
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
                  🔍
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
                            📅 {formatDate(pkg.created_at)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleViewQrCode(pkg)}
                              sx={{
                                bgcolor: '#e8f5e8',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#c8e6c9' }
                              }}
                              title="View QR Code"
                            >
                              📱
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
                              👥
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: '#ffebee',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#ffcdd2' }
                              }}
                              title="Delete Package"
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

      {/* QR Code Modal */}
      {showQrModal && selectedPackage && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseQrModal}
        >
          <Card
            sx={{
              maxWidth: 500,
              width: '90%',
              borderRadius: 3,
              p: 4,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Package QR Code
                </Typography>
                <IconButton onClick={handleCloseQrModal} sx={{ color: '#666' }}>
                  ✕
                </IconButton>
              </Box>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  pkg-{selectedPackage.id}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                  {selectedPackage.food_type} • {selectedPackage.weight_lbs} lbs
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                  component="img"
                  src={`http://localhost:5001/uploads/${selectedPackage.qr_code_image_path.split('/').pop()}`}
                  alt={`QR Code for Package ${selectedPackage.id}`}
                  sx={{
                    maxWidth: 300,
                    maxHeight: 300,
                    border: '2px solid #e0e0e0',
                    borderRadius: 3,
                    p: 2,
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleCloseQrModal}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDownloadQrCode}
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#4CAF50',
                    '&:hover': { bgcolor: '#45a049' },
                    px: 3,
                    py: 1.5,
                  }}
                >
                  📥 Download QR Code
                </Button>
              </Box>

              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 2 }}>
                Volunteers can scan this QR code to view package details and confirm pickup
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default StorePackages;
