import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Avatar,
  Divider,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Speed,
  LightbulbOutlined,
  Assessment,
  Timeline,
  LocalShipping,
  EmojiEvents,
  CheckCircle,
  Info,
  OpenInNew,
  Visibility,
} from '@mui/icons-material';
import { Target } from 'lucide-react';
import { Nature } from '@mui/icons-material';
import { auth } from '../config/firebase';

interface VolunteerInsights {
  volunteer_id: string;
  period_days: number;
  total_pickups: number;
  total_weight_lbs: number;
  avg_pickup_time_hours: number;
  environmental_impact: {
    co2e_prevented_lbs: number;
    co2_prevented_kg: number;
    meals_provided: number;
    families_helped: number;
  };
  performance_score: number;
  efficiency_rating: string;
  preferred_food_types: Record<string, number>;
  preferred_stores: Record<string, number>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
    owner?: string;
    eta_days?: number;
    metric?: string;
  }>;
  trends: {
    pickup_frequency_trend: 'increasing' | 'decreasing' | 'stable';
    efficiency_trend: 'improving' | 'declining' | 'stable';
    environmental_impact_trend: 'increasing' | 'decreasing' | 'stable';
  };
  achievements: Array<{
    title: string;
    description: string;
    icon: string;
    unlocked_at: string;
  }>;
  next_milestones: Array<{
    title: string;
    description: string;
    progress: number;
    target: number;
  }>;
  // New fields for enhanced insights
  waste_generated_lbs?: number;
  financial_impact_usd?: number;
  completion_rate?: number;
  week_over_week_changes?: {
    waste_change?: number;
    financial_change?: number;
    completion_change?: number;
  };
  data_quality?: {
    sample_size: number;
    confidence: number;
    limitations: string[];
  };
  category_breakdown?: Array<{
    category: string;
    waste_lbs: number;
    share: number;
  }>;
  weekly_trend?: number[];
}

const VolunteerAIInsights: React.FC = () => {
  const [insights, setInsights] = useState<VolunteerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const [showCostModal, setShowCostModal] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('Please log in to view your insights');
          return;
        }

        const token = await user.getIdToken();
        const response = await fetch('/api/volunteer/insights', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();
        setInsights(data.insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const getDeltaIcon = (change: number | undefined) => {
    if (!change) return <Timeline sx={{ color: '#6A6F68', fontSize: 16 }} />;
    if (change > 0) return <TrendingUp sx={{ color: '#5E8C61', fontSize: 16 }} />;
    return <TrendingDown sx={{ color: '#DC2626', fontSize: 16 }} />;
  };

  const getDeltaColor = (change: number | undefined) => {
    if (!change) return '#6A6F68';
    if (change > 0) return '#5E8C61';
    return '#DC2626';
  };

  const formatDelta = (change: number | undefined, unit: string) => {
    if (!change) return 'No change';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}${unit}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#DC2626';
      case 'medium': return '#D97706';
      case 'low': return '#6B8A5B';
      default: return '#6B8A5B';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#5E8C61';
    if (confidence >= 60) return '#D97706';
    return '#DC2626';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        background: 'linear-gradient(135deg, #F7F9F6 0%, #E8ECE7 100%)'
      }}>
        <CircularProgress sx={{ color: '#6B8A5B' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ 
          borderRadius: '20px',
          backgroundColor: '#FFF5F5',
          border: '1px solid #FED7D7'
        }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!insights) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ 
          borderRadius: '20px',
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD'
        }}>
          No insights available at the moment.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F7F9F6 0%, #E8ECE7 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 500,
              color: '#2D3A2E',
              mb: 2,
              lineHeight: 1.2
            }}
          >
            Your Impact Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
              color: '#616A5F',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            AI-powered insights to optimize your volunteer impact
          </Typography>
        </Box>

        {/* Data Quality Indicators */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Chip
            icon={<Info sx={{ fontSize: 16 }} />}
            label={`Data quality: ${insights.data_quality?.sample_size === 1 ? 'Limited' : 'Good'} (n=${insights.data_quality?.sample_size || 1})`}
            size="small"
            sx={{
              backgroundColor: insights.data_quality?.sample_size === 1 ? '#FEF3C7' : '#D1FAE5',
              color: insights.data_quality?.sample_size === 1 ? '#92400E' : '#065F46',
              fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.75rem'
            }}
          />
          <Chip
            icon={<Assessment sx={{ fontSize: 16 }} />}
            label={`Confidence ${insights.data_quality?.confidence || 74}%`}
            size="small"
            sx={{
              backgroundColor: getConfidenceColor(insights.data_quality?.confidence || 74) === '#5E8C61' ? '#D1FAE5' : 
                              getConfidenceColor(insights.data_quality?.confidence || 74) === '#D97706' ? '#FEF3C7' : '#FEE2E2',
              color: getConfidenceColor(insights.data_quality?.confidence || 74),
              fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.75rem'
            }}
          />
        </Box>

        {/* KPI Tiles */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 6
        }}>
          {/* Waste Generated */}
          <Card sx={{ 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8ECE7',
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
            }
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography 
                sx={{ 
                  fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                  fontSize: '3rem',
                  fontWeight: 500,
                  color: '#2D3A2E',
                  lineHeight: 1,
                  mb: 1
                }}
              >
                {(insights.waste_generated_lbs || insights.total_weight_lbs).toFixed(1)}
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6A6F68',
                  mb: 2
                }}
              >
                Waste (lbs)
              </Typography>
              {insights.week_over_week_changes?.waste_change && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {getDeltaIcon(insights.week_over_week_changes.waste_change)}
                  <Typography 
                    sx={{ 
                      fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.75rem',
                      color: getDeltaColor(insights.week_over_week_changes.waste_change),
                      fontWeight: 500
                    }}
                  >
                    {formatDelta(insights.week_over_week_changes.waste_change, ' lbs')}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Financial Impact */}
          <Card sx={{ 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8ECE7',
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
            }
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography 
                sx={{ 
                  fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                  fontSize: '3rem',
                  fontWeight: 500,
                  color: '#2D3A2E',
                  lineHeight: 1,
                  mb: 1
                }}
              >
                ${(insights.financial_impact_usd || 0).toFixed(2)}
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6A6F68',
                  mb: 2
                }}
              >
                $ Impact
              </Typography>
              {insights.week_over_week_changes?.financial_change && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  {getDeltaIcon(insights.week_over_week_changes.financial_change)}
                  <Typography 
                    sx={{ 
                      fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontSize: '0.75rem',
                      color: getDeltaColor(insights.week_over_week_changes.financial_change),
                      fontWeight: 500
                    }}
                  >
                    {formatDelta(insights.week_over_week_changes.financial_change, '$')}
                  </Typography>
                </Box>
              )}
              <Button
                size="small"
                onClick={() => setShowCostModal(true)}
                sx={{
                  mt: 1,
                  fontSize: '0.75rem',
                  color: '#6B8A5B',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'transparent' }
                }}
              >
                View calculation
              </Button>
            </CardContent>
          </Card>

          {/* CO2e Impact */}
          <Card sx={{ 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8ECE7',
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
            }
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography 
                sx={{ 
                  fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                  fontSize: '3rem',
                  fontWeight: 500,
                  color: '#2D3A2E',
                  lineHeight: 1,
                  mb: 1
                }}
              >
                {insights.environmental_impact.co2_prevented_kg.toFixed(1)}
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6A6F68',
                  mb: 2
                }}
              >
                CO₂e (kg)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <Nature sx={{ color: '#5E8C61', fontSize: 16 }} />
                <Typography 
                  sx={{ 
                    fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: '0.75rem',
                    color: '#5E8C61',
                    fontWeight: 500
                  }}
                >
                  Prevented
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card sx={{ 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8ECE7',
            height: '100%',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)'
            }
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography 
                sx={{ 
                  fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                  fontSize: '3rem',
                  fontWeight: 500,
                  color: '#2D3A2E',
                  lineHeight: 1,
                  mb: 1
                }}
              >
                {((insights.completion_rate || 0) * 100).toFixed(0)}%
              </Typography>
              <Typography 
                sx={{ 
                  fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6A6F68',
                  mb: 2
                }}
              >
                Completion
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(insights.completion_rate || 0) * 100}
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  backgroundColor: '#F7F9F6',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#6B8A5B',
                    borderRadius: 3
                  }
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Executive Summary */}
        <Card sx={{ 
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8ECE7',
          mb: 6
        }}>
          <CardContent sx={{ p: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 500,
                color: '#2D3A2E',
                mb: 3
              }}
            >
              This Week's Impact
            </Typography>
            <Typography 
              sx={{ 
                fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: '#2F2F2F'
              }}
            >
              You rescued {(insights.waste_generated_lbs || insights.total_weight_lbs).toFixed(1)} lbs of food, 
              preventing {insights.environmental_impact.co2_prevented_kg.toFixed(1)} kg CO₂e emissions and providing 
              {insights.environmental_impact.meals_provided} meals to families. Your {((insights.completion_rate || 0) * 100).toFixed(0)}% 
              completion rate shows strong reliability. Focus on optimizing pickup timing to increase efficiency further.
            </Typography>
          </CardContent>
        </Card>

        {/* Visual Analytics */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4,
          mb: 6
        }}>
          {/* Waste by Category - Mini Bar Chart */}
          <Card sx={{ 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8ECE7',
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#2D3A2E',
                  mb: 3
                }}
              >
                Waste by Category
              </Typography>
              
              {insights.category_breakdown?.map((category) => (
                <Box key={category.category} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 500,
                        color: '#2D3A2E'
                      }}
                    >
                      {category.category}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: '#6A6F68'
                      }}
                    >
                      {category.waste_lbs.toFixed(1)} lbs
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={category.share * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#F7F9F6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#6B8A5B',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              )) || Object.entries(insights.preferred_food_types).map(([foodType, count]) => (
                <Box key={foodType} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontWeight: 500,
                        color: '#2D3A2E'
                      }}
                    >
                      {foodType}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: '#6A6F68'
                      }}
                    >
                      {count} pickups
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={insights?.preferred_food_types && Object.keys(insights.preferred_food_types).length > 0 ? 
                      (count / Math.max(...Object.values(insights.preferred_food_types))) * 100 : 0}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#F7F9F6',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#6B8A5B',
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* 4-Week Trend Sparkline */}
          <Card sx={{ 
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8ECE7',
            height: '100%'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: '#2D3A2E',
                  mb: 3
                }}
              >
                4-Week Trend
              </Typography>
              
              <Box sx={{ 
                height: 120, 
                display: 'flex', 
                alignItems: 'end', 
                gap: 1,
                mb: 2
              }}>
                {insights.weekly_trend?.map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      height: `${Math.max(20, (value / Math.max(...(insights.weekly_trend || [1]))) * 100)}%`,
                      backgroundColor: '#6B8A5B',
                      borderRadius: '2px 2px 0 0',
                      minHeight: '4px'
                    }}
                  />
                )) || [1, 2, 3, 4].map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      height: `${20 + (index * 20)}%`,
                      backgroundColor: '#E8ECE7',
                      borderRadius: '2px 2px 0 0',
                      minHeight: '4px'
                    }}
                  />
                ))}
              </Box>
              
              <Typography 
                sx={{ 
                  fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  color: '#6A6F68',
                  textAlign: 'center'
                }}
              >
                Pickup frequency over time
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Actionable Recommendations */}
        <Card sx={{ 
          borderRadius: '20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8ECE7',
          mb: 6
        }}>
          <CardContent sx={{ p: 6 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                fontSize: '1.75rem',
                fontWeight: 500,
                color: '#2D3A2E',
                mb: 4
              }}
            >
              Recommended Actions
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3
            }}>
              {insights.recommendations.map((rec, index) => (
                <Card key={index} sx={{ 
                  borderRadius: '16px',
                  backgroundColor: '#F7F9F6',
                  border: '1px solid #E8ECE7',
                  p: 3,
                  height: '100%',
                  position: 'relative'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={rec.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(rec.priority),
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                      <LightbulbOutlined sx={{ color: '#6B8A5B', fontSize: 20 }} />
                    </Box>
                    <Button
                      size="small"
                      onClick={() => setSelectedRecommendation(index)}
                      sx={{
                        fontSize: '0.75rem',
                        color: '#6B8A5B',
                        textTransform: 'none',
                        minWidth: 'auto',
                        p: 0.5
                      }}
                    >
                      <Visibility sx={{ fontSize: 16 }} />
                    </Button>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                      fontWeight: 600,
                      color: '#2D3A2E',
                      mb: 1
                    }}
                  >
                    {rec.title}
                  </Typography>
                  
                  <Typography 
                    sx={{ 
                      fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                      color: '#2F2F2F',
                      mb: 2,
                      lineHeight: 1.5,
                      fontSize: '0.875rem'
                    }}
                  >
                    {rec.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '0.75rem',
                        color: '#6A6F68',
                        mb: 0.5
                      }}
                    >
                      Expected Impact: {rec.impact}
                    </Typography>
                    {rec.owner && (
                      <Typography 
                        sx={{ 
                          fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '0.75rem',
                          color: '#6A6F68',
                          mb: 0.5
                        }}
                      >
                        Owner: {rec.owner}
                      </Typography>
                    )}
                    {rec.eta_days && (
                      <Typography 
                        sx={{ 
                          fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '0.75rem',
                          color: '#6A6F68',
                          mb: 0.5
                        }}
                      >
                        ETA: {rec.eta_days} days
                      </Typography>
                    )}
                    {rec.metric && (
                      <Typography 
                        sx={{ 
                          fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontSize: '0.75rem',
                          color: '#6A6F68'
                        }}
                      >
                        Metric: {rec.metric}
                      </Typography>
                    )}
                  </Box>
                  
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<CheckCircle />}
                    sx={{
                      backgroundColor: '#6B8A5B',
                      color: 'white',
                      borderRadius: '20px',
                      px: 3,
                      py: 1,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#5E8C61'
                      }
                    }}
                  >
                    Mark as done
                  </Button>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Achievements and Milestones */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 4
        }}>
          {/* Achievements */}
          <Box>
            <Card sx={{ 
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8ECE7',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: '#2D3A2E',
                    mb: 3
                  }}
                >
                  Recent Achievements
                </Typography>
                
                {insights.achievements.map((achievement, index) => (
                  <Box key={index} sx={{ mb: 3, p: 3, backgroundColor: '#F7F9F6', borderRadius: '12px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmojiEvents sx={{ color: '#6B8A5B', fontSize: 20, mr: 1 }} />
                      <Typography 
                        sx={{ 
                          fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 600,
                          color: '#2D3A2E'
                        }}
                      >
                        {achievement.title}
                      </Typography>
                    </Box>
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: '#2F2F2F',
                        fontSize: '0.875rem',
                        lineHeight: 1.4
                      }}
                    >
                      {achievement.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>

          {/* Next Milestones */}
          <Box>
            <Card sx={{ 
              borderRadius: '20px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8ECE7',
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
                    fontSize: '1.5rem',
                    fontWeight: 500,
                    color: '#2D3A2E',
                    mb: 3
                  }}
                >
                  Next Milestones
                </Typography>
                
                {insights.next_milestones.map((milestone, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography 
                        sx={{ 
                          fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                          fontWeight: 500,
                          color: '#2D3A2E'
                        }}
                      >
                        {milestone.title}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                          color: '#6A6F68',
                          fontSize: '0.875rem'
                        }}
                      >
                        {milestone.progress}/{milestone.target}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(milestone.progress / milestone.target) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#F7F9F6',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#6B8A5B',
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography 
                      sx={{ 
                        fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: '#2F2F2F',
                        fontSize: '0.875rem',
                        mt: 1,
                        lineHeight: 1.4
                      }}
                    >
                      {milestone.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Cost Calculation Modal */}
        <Dialog open={showCostModal} onClose={() => setShowCostModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ 
            fontFamily: '"Playfair Display", "Libre Baskerville", "Cormorant Garamond", Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#2D3A2E'
          }}>
            Financial Impact Calculation
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ 
              fontFamily: '"Inter", "SF Pro Text", Roboto, "Helvetica Neue", Arial, sans-serif',
              color: '#2F2F2F',
              mb: 2
            }}>
              The financial impact is calculated based on:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Food weight rescued"
                  secondary={`${(insights.waste_generated_lbs || insights.total_weight_lbs).toFixed(1)} lbs`}
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Average retail value per pound"
                  secondary="$3.50/lb (industry standard)"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Total value"
                  secondary={`$${((insights.waste_generated_lbs || insights.total_weight_lbs) * 3.5).toFixed(2)}`}
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCostModal(false)} sx={{ color: '#6B8A5B' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default VolunteerAIInsights;