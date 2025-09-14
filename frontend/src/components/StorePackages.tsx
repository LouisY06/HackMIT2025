import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Package, Printer, Home, BarChart3, TrendingUp, LogOut, Search, Calendar, Smartphone, Users, Download } from 'lucide-react';
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

  const handlePrintQrCode = () => {
    if (selectedPackage?.qr_code_image_path) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Package QR Code - pkg-${selectedPackage.id}</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                .package-info { margin: 20px 0; }
                .qr-code { margin: 20px 0; }
                .qr-code img { max-width: 300px; border: 2px solid #e0e0e0; padding: 10px; }
              </style>
            </head>
            <body>
              <h2>Package QR Code</h2>
              <div class="package-info">
                <p><strong>Package ID:</strong> pkg-${selectedPackage.id}</p>
                <p><strong>Food Type:</strong> ${selectedPackage.food_type}</p>
                <p><strong>Weight:</strong> ${selectedPackage.weight_lbs} lbs</p>
                <p><strong>Pickup Window:</strong> ${selectedPackage.pickup_window_start} - ${selectedPackage.pickup_window_end}</p>
              </div>
              <div class="qr-code">
                <img src="http://localhost:5001/uploads/${selectedPackage.qr_code_image_path.split('/').pop()}" alt="QR Code" />
              </div>
              <p><em>Show this QR code to volunteers for pickup verification</em></p>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
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
            <Leaf size={20} style={{ marginRight: '8px' }} /> Waste→Worth
          </Typography>
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
                              onClick={() => handleViewQrCode(pkg)}
                              sx={{
                                bgcolor: '#e8f5e8',
                                borderRadius: 2,
                                '&:hover': { bgcolor: '#c8e6c9' }
                              }}
                              title="View QR Code"
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
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseQrModal}
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
                      Package QR Code
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Show this QR code to volunteers for pickup verification
                    </Typography>
                  </Box>
                </Box>
                <IconButton 
                  onClick={handleCloseQrModal} 
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

              {/* QR Code */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Card
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 3,
                    p: 3,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src={`http://localhost:5001/uploads/${selectedPackage.qr_code_image_path.split('/').pop()}`}
                    alt={`QR Code for Package ${selectedPackage.id}`}
                    sx={{
                      width: 250,
                      height: 250,
                      display: 'block',
                    }}
                  />
                </Card>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handlePrintQrCode}
                  startIcon={<Printer size={16} />}
                  sx={{
                    borderRadius: 3,
                    bgcolor: '#333',
                    color: 'white',
                    '&:hover': { bgcolor: '#555' },
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleDownloadQrCode}
                  startIcon={<Download size={16} />}
                  sx={{
                    borderRadius: 3,
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': { 
                      borderColor: '#555',
                      bgcolor: '#f5f5f5'
                    },
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  Download
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
