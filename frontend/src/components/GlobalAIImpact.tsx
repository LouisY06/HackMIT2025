import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Package, 
  Trees, 
  Users, 
  Store, 
  Car, 
  Droplets, 
  TreePine, 
  Building,
  Home,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  LogOut,
  Leaf
} from 'lucide-react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Store as StoreIcon,
  People as PeopleIcon,
  Psychology,
  Assessment,
  Timeline,
  LocalShipping,
  EmojiEvents,
  Public,
  Speed,
} from '@mui/icons-material';
import { Nature } from '@mui/icons-material';

interface GlobalMetrics {
  period_days: number;
  total_waste_diverted_lbs: number;
  total_packages: number;
  active_stores: number;
  active_volunteers: number;
  completion_rate: number;
  avg_pickup_time_hours: number;
  environmental_impact: {
    co2e_prevented_lbs: number;
    meals_provided: number;
    families_helped: number;
  };
  top_waste_food_types: Record<string, number>;
  top_performing_stores: Record<string, number>;
  platform_efficiency_score: number;
}

interface HeatmapData {
  store_name: string;
  total_waste_lbs: number;
  avg_waste_lbs: number;
  package_count: number;
  avg_pickup_time_hours: number;
  completion_rate: number;
  waste_risk_level: string;
}

const GlobalAIImpact: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchGlobalMetrics();
    fetchHeatmapData();
  }, [selectedPeriod]);

  const fetchGlobalMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/ai/global-metrics?days=${selectedPeriod}`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(data.error || 'Failed to fetch global metrics');
      }
    } catch (err) {
      setError('Failed to connect to AI analytics service');
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/ai/heatmap-data?days=${selectedPeriod}`);
      const data = await response.json();
      
      if (data.success) {
        setHeatmapData(data.heatmap_data);
      }
    } catch (err) {
      console.error('Failed to fetch heatmap data:', err);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High': return '#F44336';
      case 'Medium': return '#FF9800';
      case 'Low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="info">
            No global metrics available. Data will appear as stores and volunteers join the platform.
          </Alert>
        </Container>
      </Box>
    );
  }

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
            <Button onClick={() => navigate('/store/packages')} sx={{ color: '#666' }}>
              <Package size={16} style={{ marginRight: '4px' }} /> Packages
            </Button>
            <Button onClick={() => navigate('/store/impact')} sx={{ color: '#666' }}>
              <BarChart3 size={16} style={{ marginRight: '4px' }} /> Impact
            </Button>
            <Button sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              <TrendingUpIcon size={16} style={{ marginRight: '4px' }} /> Global Impact
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Sarah Williams
          </Typography>
          <Button sx={{ color: '#666' }}>
            Partner
          </Button>
          <Button onClick={() => navigate('/store')} sx={{ color: '#666' }}>
            <LogOut size={16} style={{ marginRight: '4px' }} /> Logout
          </Button>
        </Box>
      </Box>

      {/* Page Header */}
      <Container maxWidth="xl" sx={{ mt: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Globe size={28} color="white" />
          </Box>
          <Box>
            <Typography 
              variant="h4"
              sx={{ 
                fontWeight: 700,
                color: '#333',
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
              }}
            >
              Global AI Impact Dashboard
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#666',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", "Helvetica", "Arial", sans-serif',
              }}
            >
              Platform-wide analytics and AI insights across all stores, volunteers, and food banks
            </Typography>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* Global Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, md: 3 }, mb: 4 }}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #4ECDC4 0%, #44B7B8 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Package size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {(metrics.total_waste_diverted_lbs / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs Food Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Trees size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {(metrics.environmental_impact.co2e_prevented_lbs / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      lbs CO₂ Prevented
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: 'white' }}>
                    <Users size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {(metrics.environmental_impact.meals_provided / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Meals Provided
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4, color: '#333' }}>
                    <Building size={32} style={{ marginBottom: '16px' }} />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                      ${(metrics.total_waste_diverted_lbs * 0.02 / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.8 }}>
                      Cost Saved
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </motion.div>

      {/* Platform Performance */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Platform Performance Metrics
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: getEfficiencyColor(metrics.platform_efficiency_score) }}>
                  {metrics.platform_efficiency_score.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platform Efficiency Score
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.platform_efficiency_score}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
            
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                  {metrics.completion_rate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={metrics.completion_rate}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
            
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {metrics.avg_pickup_time_hours.toFixed(1)}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Pickup Time
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Environmental Impact */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Nature sx={{ color: '#4CAF50', fontSize: 24 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Global Environmental Impact
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                  {metrics.environmental_impact.co2e_prevented_lbs.toFixed(1)} lbs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CO₂e Prevented
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Nature sx={{ color: '#4CAF50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Meals Provided"
                    secondary={`${metrics.environmental_impact.meals_provided.toFixed(0)} meals`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PeopleIcon sx={{ color: '#2196F3' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Families Helped"
                    secondary={`${metrics.environmental_impact.families_helped.toFixed(0)} families`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Top Waste Food Types */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Most Common Food Types
              </Typography>
              
              {Object.entries(metrics.top_waste_food_types).map(([foodType, count]) => (
                <Box key={foodType} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                      {foodType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {count} packages
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(count / Math.max(...Object.values(metrics.top_waste_food_types))) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Top Performing Stores */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Top Performing Stores
              </Typography>
              
              {Object.entries(metrics.top_performing_stores).map(([storeName, weight]) => (
                <Box key={storeName} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {storeName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {weight.toFixed(1)} lbs
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(weight / Math.max(...Object.values(metrics.top_performing_stores))) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Store Risk Heatmap */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Store Waste Risk Levels
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Store</TableCell>
                      <TableCell align="right">Waste (lbs)</TableCell>
                      <TableCell align="center">Risk Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {heatmapData.slice(0, 5).map((store) => (
                      <TableRow key={store.store_name}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {store.store_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {store.total_waste_lbs.toFixed(1)}
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={store.waste_risk_level}
                            size="small"
                            sx={{ 
                              backgroundColor: getRiskLevelColor(store.waste_risk_level),
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
            </Box>

      {/* AI Insights Summary */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            AI-Generated Platform Insights
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
            <Box>
              <Paper sx={{ p: 3, backgroundColor: '#e8f5e8' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#4CAF50' }}>
                  Platform Health
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  The platform is performing well with a {metrics.completion_rate.toFixed(1)}% completion rate.
                  {metrics.completion_rate > 80 && " This indicates strong volunteer engagement and efficient operations."}
                  {metrics.completion_rate < 60 && " Consider implementing additional support systems for volunteers."}
                </Typography>
              </Paper>
            </Box>
            
            <Box>
              <Paper sx={{ p: 3, backgroundColor: '#e3f2fd' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#2196F3' }}>
                  Efficiency Opportunities
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Average pickup time is {metrics.avg_pickup_time_hours.toFixed(1)} hours.
                  {metrics.avg_pickup_time_hours < 2 && " Excellent response times!"}
                  {metrics.avg_pickup_time_hours > 4 && " Consider optimizing volunteer scheduling and store coordination."}
                </Typography>
              </Paper>
            </Box>
            
            <Box>
              <Paper sx={{ p: 3, backgroundColor: '#fff3e0' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#FF9800' }}>
                  Growth Potential
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  With {metrics.active_stores} stores and {metrics.active_volunteers} volunteers, 
                  there's potential to expand to more locations and increase community impact.
                </Typography>
              </Paper>
            </Box>
          </Box>
        </CardContent>
      </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default GlobalAIImpact;
