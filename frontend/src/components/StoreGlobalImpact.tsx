import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
} from '@mui/material';

const StoreGlobalImpact: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/store/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={handleBackToDashboard} sx={{ mb: 2 }}>
            ← Back to Dashboard
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Global Impact
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            See the platform-wide impact and community achievements
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, p: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Platform-Wide Impact
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              This page will show global statistics, leaderboards, and community 
              achievements across all participating stores and volunteers. Coming soon!
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StoreGlobalImpact;
