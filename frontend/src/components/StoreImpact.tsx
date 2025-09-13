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

const StoreImpact: React.FC = () => {
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
            Impact Report
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            View your sustainability metrics and environmental impact
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, p: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your Impact Metrics
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              This page will display detailed charts and metrics showing your 
              environmental impact, waste reduction, and community contributions. Coming soon!
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StoreImpact;
