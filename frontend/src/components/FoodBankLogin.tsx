import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Container,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const FoodBankLogin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Home
      </Button>
      
      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Food Bank Partner Login
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            Login component will be implemented here
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FoodBankLogin;
