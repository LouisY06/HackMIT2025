import React, { useState, useEffect } from 'react';
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
  Store,
  People,
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!metrics) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No global metrics available. Data will appear as stores and volunteers join the platform.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Public sx={{ fontSize: 32, color: '#9C27B0' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Global AI Impact Dashboard
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Platform-wide analytics and AI insights across all stores, volunteers, and food banks
        </Typography>
      </Box>

      {/* Key Metrics Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Nature sx={{ color: '#4CAF50', fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {metrics.total_waste_diverted_lbs.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                lbs Waste Diverted
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                {metrics.total_packages}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Packages
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Store sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                {metrics.active_stores}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Stores
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: '#9C27B0', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                {metrics.active_volunteers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Volunteers
              </Typography>
            </CardContent>
          </Card>
        </Box>
            </Box>

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
                    <People sx={{ color: '#2196F3' }} />
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
    </Container>
  );
};

export default GlobalAIImpact;
