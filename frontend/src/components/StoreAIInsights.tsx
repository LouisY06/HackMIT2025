import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Avatar,
  Badge,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from '@mui/material';
import { Store } from 'lucide-react';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Warning,
  CheckCircle,
  Psychology,
  Assessment,
  Timeline,
  Download,
  History,
  Visibility,
  Close,
  ExpandMore,
  Share,
  ContentCopy,
  Restaurant,
  LocalDining,
  Schedule,
  BarChart,
  PieChart,
  Timeline as TimelineIcon,
  CalendarToday,
  DateRange,
  FilterList,
} from '@mui/icons-material';
import { Nature } from '@mui/icons-material';

interface AIInsights {
  store_email: string;
  period_days: number;
  total_waste_lbs: number;
  total_packages: number;
  completion_rate: number;
  avg_pickup_time_hours: number;
  financial_impact: {
    retail_value_saved: number;
    disposal_cost_savings: number;
    total_financial_impact: number;
  };
  environmental_impact: {
    co2e_prevented_kg: number;
    co2e_prevented_lbs: number;
    meals_provided: number;
    families_helped: number;
  };
  food_type_breakdown: Record<string, any>;
  performance_score: number;
}

interface WeeklyReport {
  report: string;
  executive_summary: string;
  detailed_report: string;
  predictions: any;
  metrics: any;
  trends: any;
  recommendations: any;
  environmental_impact: any;
  period_days: number;
  generated_at: string;
  structured_report?: {
    store_name: string;
    period_start: string;
    period_end: string;
    kpis: {
      total_packages: number;
      completed_packages: number;
      completion_rate: number;
      waste_generated_lbs: number;
      waste_diverted_lbs: number;
      financial_impact_usd: number;
      meals_lost_est: number;
      co2e_kg: number;
    };
    category_breakdown: Array<{
      category: string;
      waste_lbs: number;
      share: number;
    }>;
    root_causes_ranked: string[];
    recommendations: Array<{
      title: string;
      priority: 'high' | 'medium' | 'low';
      rationale: string;
      expected_impact: string;
      how_to_measure: string;
      owner?: string;
      eta_days?: number;
    }>;
    forecast: {
      waste_next_week_lbs_low: number;
      waste_next_week_lbs_high: number;
      assumptions: string;
    };
    confidence: number;
    data_quality_notes: string;
    plain_text_report: string;
  };
}

interface ReportHistory {
  id: number;
  report_type: string;
  period_days: number;
  report_date: string;
  created_at: string;
  executive_summary: string;
}

const StoreAIInsights: React.FC = () => {
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<WeeklyReport | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('30');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [customDateDialogOpen, setCustomDateDialogOpen] = useState(false);

  // Mock store email - in real app, get from auth context
  const storeEmail = "sarah@flourbakery.com";

  // Time filter options
  const timeFilterOptions = [
    { value: '7', label: 'Last 7 days', icon: <CalendarToday /> },
    { value: '30', label: 'Last 30 days', icon: <DateRange /> },
    { value: '90', label: 'Last 90 days', icon: <TimelineIcon /> },
    { value: 'custom', label: 'Custom range', icon: <FilterList /> },
  ];

  // KPI Card Component
  const KPICard = ({ title, value, icon, color, subtitle, trend }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        background: '#ffffff',
        border: '1px solid #e9ecef',
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 64,
        height: 64,
        mx: 'auto', 
        mb: 3,
        borderRadius: '50%',
        bgcolor: `${color}15`,
        border: `2px solid ${color}30`
      }}>
        <Box sx={{ color: color, fontSize: 28 }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h3" sx={{ 
        fontWeight: 'bold', 
        color: '#2c3e50', 
        mb: 1,
        fontSize: { xs: '2rem', md: '2.5rem' }
      }}>
        {value}
      </Typography>
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        color: '#495057',
        mb: 1,
        fontSize: '1.1rem'
      }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ 
          color: '#6c757d',
          fontSize: '0.9rem'
        }}>
          {subtitle}
        </Typography>
      )}
      {trend && (
        <Box sx={{ mt: 2 }}>
          {trend === 'up' && <TrendingUp sx={{ color: '#28a745', fontSize: 20 }} />}
          {trend === 'down' && <TrendingDown sx={{ color: '#dc3545', fontSize: 20 }} />}
        </Box>
      )}
    </Card>
  );

  useEffect(() => {
    fetchAIInsights();
    fetchWeeklyReport();
    fetchReportHistory();
  }, [selectedPeriod, timeFilter]);

  const handleTimeFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string | null) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter);
      if (newFilter !== 'custom') {
        setSelectedPeriod(parseInt(newFilter));
      } else {
        setCustomDateDialogOpen(true);
      }
    }
  };

  const handleCustomDateSubmit = () => {
    if (customDateRange.start && customDateRange.end) {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setSelectedPeriod(daysDiff);
      setCustomDateDialogOpen(false);
    }
  };

  const getTimeFilterLabel = () => {
    const option = timeFilterOptions.find(opt => opt.value === timeFilter);
    return option ? option.label : 'Select period';
  };

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/ai/store-insights/${storeEmail}?days=${selectedPeriod}`);
      const data = await response.json();
      
      if (data.success) {
        setInsights(data.insights);
      } else {
        setError(data.error || 'Failed to fetch AI insights');
      }
    } catch (err) {
      setError('Failed to connect to AI analytics service');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyReport = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/ai/weekly-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_email: storeEmail,
          days: 7
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setWeeklyReport(data);
      }
    } catch (err) {
      console.error('Failed to fetch weekly report:', err);
    }
  };

  const fetchReportHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/ai/reports/history/${storeEmail}`);
      const data = await response.json();
      
      if (data.success) {
        setReportHistory(data.reports);
      }
    } catch (err) {
      console.error('Failed to fetch report history:', err);
    }
  };

  const fetchReportById = async (reportId: number) => {
    try {
      const response = await fetch(`http://localhost:5001/api/ai/reports/${reportId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedReport(data.report);
        setReportDialogOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch report:', err);
    }
  };

  const exportReport = async (reportId: number, format: 'csv' | 'pdf') => {
    try {
      setExportLoading(true);
      const response = await fetch(`http://localhost:5001/api/ai/reports/${reportId}/export?format=${format}`);
      const data = await response.json();
      
      if (data.success) {
        // Create and download file
        const blob = new Blob([data.content], { type: data.mime_type });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export report:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareReport = async () => {
    if (weeklyReport) {
      const shareText = `AI Waste Analytics Report\n\n${weeklyReport.executive_summary}\n\nGenerated: ${new Date().toLocaleDateString()}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'AI Waste Analytics Report',
            text: shareText,
          });
        } catch (err) {
          console.log('Share cancelled');
        }
      } else {
        setShareDialogOpen(true);
      }
    }
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

  if (!insights) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No AI insights available for your store. Start creating packages to generate analytics!
        </Alert>
      </Container>
    );
  }

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
                    AI Insights
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
                      AI-powered analytics and recommendations
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 'bold', 
              color: '#2c3e50',
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}>
            AI Insights Dashboard
          </Typography>
            <Typography variant="h6" sx={{ 
              color: '#7f8c8d',
              fontWeight: 400,
              fontSize: '1.1rem'
            }}>
              AI-powered analytics and recommendations for your store's waste reduction performance
          </Typography>
        </Box>
          
          {/* Time Filter */}
          <Card sx={{ 
            p: 3, 
            borderRadius: 2, 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            background: '#ffffff',
            border: '1px solid #e9ecef'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ color: '#6c757d', fontSize: 20 }} />
                <Typography variant="body2" sx={{ 
                  fontWeight: 600, 
                  color: '#495057',
                  minWidth: 120 
                }}>
                  {getTimeFilterLabel()}
                </Typography>
              </Box>
              <ToggleButtonGroup
                value={timeFilter}
                exclusive
                onChange={handleTimeFilterChange}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    border: '1px solid #dee2e6',
                    '&.Mui-selected': {
                      bgcolor: '#28a745',
                      color: 'white',
                      borderColor: '#28a745',
                      '&:hover': {
                        bgcolor: '#218838',
                      }
                    },
                    '&:hover': {
                      bgcolor: '#f8f9fa',
                    }
                  }
                }}
              >
                {timeFilterOptions.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.icon}
                      <Typography variant="caption" sx={{ 
                        display: { xs: 'none', sm: 'block' },
                        fontWeight: 500
                      }}>
                        {option.label.split(' ')[0]}
                      </Typography>
                    </Box>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: '#e9ecef', 
        mb: 4,
        '& .MuiTabs-root': {
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            color: '#6c757d',
            '&.Mui-selected': {
              color: '#28a745',
            }
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#28a745',
            height: 3,
            borderRadius: '3px 3px 0 0'
          }
        }
      }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab label="Current Week Report" />
          <Tab label="Report History" />
          <Tab label="Analytics Dashboard" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {selectedTab === 0 && (
        <Box>
          {/* Current Week Report */}
          {weeklyReport ? (
            <Box>
              {/* KPI Cards */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    color: '#2c3e50',
                    mb: 2,
                    fontSize: { xs: '1.75rem', md: '2rem' }
                  }}>
                    Performance Overview
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#6c757d',
                    fontSize: '1rem'
                  }}>
                    Key metrics for {getTimeFilterLabel().toLowerCase()}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, 
                  gap: 4,
                  mb: 6
                }}>
                  <KPICard
                    title="Food Waste"
                    value={`${weeklyReport?.structured_report?.kpis?.waste_generated_lbs?.toFixed(1) || insights?.total_waste_lbs?.toFixed(1) || '0.0'} lbs`}
                    icon={<Restaurant />}
                    color="#FF6B6B"
                    subtitle="Generated this period"
                    trend="up"
                  />
                  <KPICard
                    title="Financial Impact"
                    value={`$${weeklyReport?.structured_report?.kpis?.financial_impact_usd?.toFixed(0) || insights?.financial_impact?.total_financial_impact?.toFixed(0) || '0'}`}
                    icon={<AttachMoney />}
                    color="#4ECDC4"
                    subtitle="Value at risk"
                    trend="up"
                  />
                  <KPICard
                    title="Carbon Impact"
                    value={`${weeklyReport?.structured_report?.kpis?.co2e_kg?.toFixed(1) || insights?.environmental_impact?.co2e_prevented_lbs?.toFixed(1) || '0.0'} kg`}
                    icon={<Nature />}
                    color="#45B7D1"
                    subtitle="CO₂e generated"
                    trend="up"
                  />
                  <KPICard
                    title="Meals Lost"
                    value={`${weeklyReport?.structured_report?.kpis?.meals_lost_est?.toFixed(0) || insights?.environmental_impact?.meals_provided?.toFixed(0) || '0'}`}
                    icon={<LocalDining />}
                    color="#96CEB4"
                    subtitle="Meals equivalent"
                    trend="up"
                  />
                </Box>
              </Box>

              {/* Executive Summary with Modern Design */}
              {weeklyReport.executive_summary && (
                <Card sx={{ 
                  mb: 6, 
                  borderRadius: 2, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  background: '#ffffff',
                  border: '1px solid #e9ecef'
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: '#e3f2fd',
                        border: '2px solid #bbdefb'
                      }}>
                        <Psychology sx={{ color: '#1976d2', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          mb: 1
                        }}>
                          AI Executive Summary
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#6c757d',
                          fontSize: '0.9rem'
                        }}>
                          Generated by AI • {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Paper sx={{ 
                      p: 4, 
                      bgcolor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid #e9ecef'
                    }}>
                      <Typography variant="body1" sx={{ 
                        lineHeight: 1.7, 
                        fontSize: '1.1rem',
                        color: '#495057'
                      }}>
                        {weeklyReport.structured_report?.plain_text_report || weeklyReport.executive_summary}
                      </Typography>
                    </Paper>
                  </CardContent>
                </Card>
              )}

              {/* Root Causes Section */}
              {weeklyReport.structured_report?.root_causes_ranked && (
                <Card sx={{ 
                  mb: 6, 
                  borderRadius: 2, 
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  background: '#ffffff',
                  border: '1px solid #e9ecef'
                }}>
                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: '#ffebee',
                        border: '2px solid #ffcdd2'
                      }}>
                        <Warning sx={{ color: '#d32f2f', fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ 
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          mb: 1
                        }}>
                          Root Causes (Ranked)
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: '#6c757d',
                          fontSize: '0.9rem'
                        }}>
                          Key issues identified by AI analysis
                        </Typography>
                      </Box>
                    </Box>
                    <Stack spacing={3}>
                      {weeklyReport.structured_report.root_causes_ranked.map((cause, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 3,
                          p: 3,
                          bgcolor: '#f8f9fa',
                          borderRadius: 2,
                          border: '1px solid #e9ecef'
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: index === 0 ? '#dc3545' : index === 1 ? '#fd7e14' : '#6c757d',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </Box>
                          <Typography variant="body1" sx={{ 
                            color: '#495057',
                            lineHeight: 1.6,
                            fontSize: '1rem'
                          }}>
                            {cause}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Analysis with Accordions */}
              {weeklyReport.detailed_report && (
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                      Detailed Analysis
                    </Typography>
                    
                    <Accordion sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <BarChart sx={{ color: '#2196F3' }} />
                          <Typography variant="h6">Key Performance Indicators</Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {weeklyReport.structured_report?.kpis ? (
                          <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                            gap: 3 
                          }}>
                            <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
                              <Typography variant="body2" sx={{ color: '#6c757d', mb: 1, fontSize: '0.9rem' }}>
                                Total Packages
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                {weeklyReport.structured_report.kpis.total_packages}
                              </Typography>
                            </Box>
                            <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
                              <Typography variant="body2" sx={{ color: '#6c757d', mb: 1, fontSize: '0.9rem' }}>
                                Completed Packages
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                {weeklyReport.structured_report.kpis.completed_packages}
                              </Typography>
                            </Box>
                            <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
                              <Typography variant="body2" sx={{ color: '#6c757d', mb: 1, fontSize: '0.9rem' }}>
                                Completion Rate
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                {(weeklyReport.structured_report.kpis.completion_rate * 100).toFixed(1)}%
                              </Typography>
                            </Box>
                            <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
                              <Typography variant="body2" sx={{ color: '#6c757d', mb: 1, fontSize: '0.9rem' }}>
                                Waste Diverted
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                {weeklyReport.structured_report.kpis.waste_diverted_lbs.toFixed(1)} lbs
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                            {weeklyReport.detailed_report}
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Nature sx={{ color: '#4CAF50' }} />
                          <Typography variant="h6">Environmental Impact</Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {weeklyReport.structured_report?.kpis ? (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Carbon Footprint</Typography>
                            <Typography variant="h6" sx={{ mb: 2 }}>{weeklyReport.structured_report.kpis.co2e_kg.toFixed(1)} kg CO₂e</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Meals Lost</Typography>
                            <Typography variant="h6">{weeklyReport.structured_report.kpis.meals_lost_est.toFixed(0)} meals</Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2">Environmental impact analysis and carbon footprint calculations.</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Assessment sx={{ color: '#FF9800' }} />
                          <Typography variant="h6">Recommendations</Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        {weeklyReport.structured_report?.recommendations ? (
                          <Box>
                            {weeklyReport.structured_report.recommendations.map((rec, index) => (
                              <Card key={index} sx={{ mb: 2, p: 2, bgcolor: rec.priority === 'high' ? '#ffebee' : rec.priority === 'medium' ? '#fff3e0' : '#f3e5f5' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {rec.title}
                                  </Typography>
                                  <Chip 
                                    label={rec.priority.toUpperCase()} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: rec.priority === 'high' ? '#F44336' : rec.priority === 'medium' ? '#FF9800' : '#9C27B0',
                                      color: 'white'
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Rationale:</strong> {rec.rationale}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Expected Impact:</strong> {rec.expected_impact}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>How to Measure:</strong> {rec.how_to_measure}
                                </Typography>
                                {rec.owner && (
                                  <Typography variant="body2" color="text.secondary">
                                    <strong>Owner:</strong> {rec.owner} {rec.eta_days && `• ETA: ${rec.eta_days} days`}
                                  </Typography>
                                )}
                              </Card>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2">AI-generated recommendations for optimization.</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Forecast Section */}
              {weeklyReport.structured_report?.forecast && (
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <TimelineIcon sx={{ color: '#9C27B0', fontSize: 32 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Next Week Forecast
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9C27B0' }}>
                        {weeklyReport.structured_report.forecast.waste_next_week_lbs_low.toFixed(1)} - {weeklyReport.structured_report.forecast.waste_next_week_lbs_high.toFixed(1)} lbs
                      </Typography>
        <Typography variant="body1" color="text.secondary">
                        expected waste
        </Typography>
      </Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Assumptions:</strong> {weeklyReport.structured_report.forecast.assumptions}
                    </Typography>
                    {weeklyReport.structured_report.confidence && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Confidence Level: {(weeklyReport.structured_report.confidence * 100).toFixed(0)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={weeklyReport.structured_report.confidence * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Card sx={{ 
                borderRadius: 2, 
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                background: '#ffffff',
                border: '1px solid #e9ecef'
              }}>
                <CardContent sx={{ p: 5 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 4,
                    color: '#2c3e50',
                    fontSize: '1.25rem'
                  }}>
                    Export & Share
                  </Typography>
                  <Stack direction="row" spacing={3} flexWrap="wrap">
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => exportReport(1, 'csv')}
                      disabled={exportLoading}
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: '#28a745',
                        '&:hover': {
                          bgcolor: '#218838',
                        },
                        px: 3,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => exportReport(1, 'pdf')}
                      disabled={exportLoading}
                      sx={{ 
                        borderRadius: 2,
                        bgcolor: '#28a745',
                        '&:hover': {
                          bgcolor: '#218838',
                        },
                        px: 3,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Export PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={shareReport}
                      sx={{ 
                        borderRadius: 2,
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        '&:hover': {
                          borderColor: '#495057',
                          color: '#495057',
                          bgcolor: '#f8f9fa'
                        },
                        px: 3,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Share Report
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => copyToClipboard(weeklyReport.executive_summary)}
                      sx={{ 
                        borderRadius: 2,
                        borderColor: '#6c757d',
                        color: '#6c757d',
                        '&:hover': {
                          borderColor: '#495057',
                          color: '#495057',
                          bgcolor: '#f8f9fa'
                        },
                        px: 3,
                        py: 1.5,
                        fontWeight: 600
                      }}
                    >
                      Copy Summary
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 3 }}>
              No AI report available for this week. Generate a new report to see insights.
            </Alert>
          )}
        </Box>
      )}

      {selectedTab === 1 && (
        <Box>
          {/* Report History Timeline */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Report History Timeline
          </Typography>
          
          {reportHistory.length > 0 ? (
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              {reportHistory.map((report, index) => (
                <Box key={report.id} sx={{ position: 'relative', mb: 4 }}>
                  {/* Timeline Line */}
                  {index < reportHistory.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 24,
                        top: 60,
                        bottom: -16,
                        width: 2,
                        bgcolor: '#e0e0e0',
                        zIndex: 1,
                      }}
                    />
                  )}
                  
                  {/* Timeline Dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 18,
                      top: 18,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#9C27B0',
                      border: '3px solid white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      zIndex: 2,
                    }}
                  />
                  
                  {/* Report Card */}
                  <Card 
                    sx={{ 
                      ml: 6, 
                      borderRadius: 3, 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: '#9C27B0', width: 40, height: 40 }}>
                            <TimelineIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {report.report_type === 'weekly_report' ? 'Weekly Report' : report.report_type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {report.report_date} • {report.period_days} days
                            </Typography>
                          </Box>
                        </Box>
                        <Box>
                          <Tooltip title="View Report">
                            <IconButton 
                              onClick={() => fetchReportById(report.id)}
                              sx={{ 
                                bgcolor: '#f5f5f5', 
                                '&:hover': { bgcolor: '#e0e0e0' },
                                mr: 1 
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Export CSV">
                            <IconButton 
                              onClick={() => exportReport(report.id, 'csv')}
                              sx={{ 
                                bgcolor: '#f5f5f5', 
                                '&:hover': { bgcolor: '#e0e0e0' }
                              }}
                            >
                              <Download />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        borderRadius: 2,
                        mb: 2
                      }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                          {report.executive_summary}
                        </Typography>
                      </Paper>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Generated: {new Date(report.created_at).toLocaleString()}
                        </Typography>
                        <Chip 
                          label={`${report.period_days} days`}
                          size="small"
                          sx={{ bgcolor: '#9C27B0', color: 'white' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 3, textAlign: 'center' }}>
              No report history available. Generate your first AI report to get started.
            </Alert>
          )}
        </Box>
      )}

      {selectedTab === 2 && (
        <Box>
          {/* Analytics Dashboard - existing content */}

      {/* Performance Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Performance Overview
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: getPerformanceColor(insights.performance_score) }}>
                {insights.performance_score.toFixed(0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Performance Score
              </Typography>
              <Chip 
                label={getPerformanceLabel(insights.performance_score)}
                size="small"
                sx={{ 
                  mt: 1, 
                  backgroundColor: getPerformanceColor(insights.performance_score),
                  color: 'white'
                }}
              />
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4CAF50' }}>
                {insights.total_waste_lbs.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Waste Diverted (lbs)
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196F3' }}>
                {insights.completion_rate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completion Rate
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FF9800' }}>
                {insights.avg_pickup_time_hours.toFixed(1)}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Pickup Time
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Financial Impact */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AttachMoney sx={{ color: '#4CAF50' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Financial Impact
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                  ${insights.financial_impact.total_financial_impact.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Financial Impact
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Retail Value Saved"
                    secondary={`$${insights.financial_impact.retail_value_saved.toFixed(2)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#2196F3' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Disposal Cost Savings"
                    secondary={`$${insights.financial_impact.disposal_cost_savings.toFixed(2)}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Environmental Impact */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Nature sx={{ color: '#4CAF50' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Environmental Impact
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#4CAF50', mb: 1 }}>
                  {insights.environmental_impact.co2e_prevented_lbs.toFixed(1)} lbs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CO₂e Prevented
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Nature sx={{ color: '#4CAF50' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Meals Provided"
                    secondary={`${insights.environmental_impact.meals_provided.toFixed(0)} meals`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle sx={{ color: '#2196F3' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Families Helped"
                    secondary={`${insights.environmental_impact.families_helped.toFixed(0)} families`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Food Type Breakdown */}
        <Box>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Food Type Breakdown
              </Typography>
              
              {Object.entries(insights.food_type_breakdown).map(([foodType, data]: [string, any]) => (
                <Box key={foodType} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                      {foodType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data['weight_lbs']?.toFixed(1)} lbs
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(data['weight_lbs'] / insights.total_waste_lbs) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* AI Recommendations */}
        <Box>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#9C27B0', width: 48, height: 48 }}>
                  <Psychology />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                AI Recommendations
              </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Card sx={{ 
                  p: 2, 
                  bgcolor: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  border: '1px solid #ffcc02',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <CheckCircle sx={{ color: '#FF9800', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Optimize Pickup Scheduling
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Consider scheduling pickups during off-peak hours to reduce wait times and improve efficiency.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderRadius: 2 }}
                    onClick={() => console.log('Implement pickup optimization')}
                  >
                    Implement
                  </Button>
                </Card>

                <Card sx={{ 
                  p: 2, 
                  bgcolor: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  border: '1px solid #4caf50',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <TrendingUp sx={{ color: '#4CAF50', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Focus on High-Waste Categories
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Target food categories with highest waste rates for maximum impact on reduction goals.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderRadius: 2 }}
                    onClick={() => console.log('Implement category focus')}
                  >
                    Implement
                  </Button>
                </Card>

                <Card sx={{ 
                  p: 2, 
                  bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  border: '1px solid #2196f3',
                  borderRadius: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Assessment sx={{ color: '#2196F3', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Improve Volunteer Engagement
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Enhance communication and recognition programs to boost volunteer participation rates.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    sx={{ borderRadius: 2 }}
                    onClick={() => console.log('Implement engagement strategy')}
                  >
                    Implement
                  </Button>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Weekly AI Report */}
      {weeklyReport && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Psychology sx={{ color: '#9C27B0' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Weekly AI Report
              </Typography>
              <Chip 
                label={`Last ${weeklyReport.period_days} days`}
                size="small"
                variant="outlined"
                sx={{ ml: 2 }}
              />
            </Box>
            
            <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-line',
                  lineHeight: 1.6,
                  fontFamily: 'monospace'
                }}
              >
                {weeklyReport.report}
              </Typography>
            </Paper>
            
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                Generated: {new Date(weeklyReport.generated_at).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
        </Box>
      )}

      {/* Report Dialog */}
      <Dialog 
        open={reportDialogOpen} 
        onClose={() => setReportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Report Details</Typography>
            <IconButton onClick={() => setReportDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Executive Summary
              </Typography>
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5' }}>
                <Typography variant="body1">
                  {selectedReport.executive_summary}
                </Typography>
              </Paper>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Detailed Report
              </Typography>
              <Paper sx={{ p: 2, mb: 3, bgcolor: '#f9f9f9' }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {selectedReport.detailed_report}
                </Typography>
              </Paper>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                AI Predictions
              </Typography>
              <Paper sx={{ p: 2, bgcolor: '#e8f5e8' }}>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {JSON.stringify(selectedReport.predictions, null, 2)}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Close</Button>
          <Button 
            variant="outlined" 
            startIcon={<Download />}
            onClick={() => selectedReport && exportReport(1, 'csv')}
          >
            Export CSV
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Download />}
            onClick={() => selectedReport && exportReport(1, 'pdf')}
          >
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog 
        open={shareDialogOpen} 
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Share Report</Typography>
            <IconButton onClick={() => setShareDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Share this AI report with stakeholders:
          </Typography>
          <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {weeklyReport?.executive_summary}
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<ContentCopy />}
            onClick={() => {
              copyToClipboard(weeklyReport?.executive_summary || '');
              setShareDialogOpen(false);
            }}
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Date Range Dialog */}
      <Dialog 
        open={customDateDialogOpen} 
        onClose={() => setCustomDateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarToday sx={{ color: '#9C27B0' }} />
            <Typography variant="h6">Select Custom Date Range</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDateDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCustomDateSubmit}
            disabled={!customDateRange.start || !customDateRange.end}
            sx={{ bgcolor: '#9C27B0', '&:hover': { bgcolor: '#7B1FA2' } }}
          >
            Apply Filter
          </Button>
        </DialogActions>
      </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default StoreAIInsights;
