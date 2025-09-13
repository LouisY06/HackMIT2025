import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage';
import VolunteerLogin from './components/VolunteerLogin';
import VolunteerDashboard from './components/VolunteerDashboard';
import StoreLogin from './components/StoreLogin';
import StoreDashboard from './components/StoreDashboard';
import FoodBankLogin from './components/FoodBankLogin';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green
    },
    secondary: {
      main: '#2196F3', // Blue
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/volunteer" element={<VolunteerLogin />} />
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/store" element={<StoreLogin />} />
          <Route path="/store/dashboard" element={<StoreDashboard />} />
          <Route path="/foodbank" element={<FoodBankLogin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;