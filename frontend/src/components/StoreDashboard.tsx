import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const StoreDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/store')}
        sx={{ mb: 3 }}
      >
        Back to Login
      </Button>
      
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Store Partner Dashboard
      </Typography>
      
      <Typography variant="body1" sx={{ color: '#666' }}>
        Dashboard component will be implemented here
      </Typography>
    </Container>
  );
};

export default StoreDashboard;
