import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage';
import VolunteerLogin from './components/VolunteerLogin';
import StoreLogin from './components/StoreLogin';
import StoreDashboard from './components/StoreDashboard';
import StoreCreatePackage from './components/StoreCreatePackage';
import StorePackages from './components/StorePackages';
import StoreImpact from './components/StoreImpact';
import StoreGlobalImpact from './components/StoreGlobalImpact';
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
          <Route path="/store" element={<StoreLogin />} />
          <Route path="/store/dashboard" element={<StoreDashboard />} />
          <Route path="/store/create-package" element={<StoreCreatePackage />} />
          <Route path="/store/packages" element={<StorePackages />} />
          <Route path="/store/impact" element={<StoreImpact />} />
          <Route path="/store/global-impact" element={<StoreGlobalImpact />} />
          <Route path="/foodbank" element={<FoodBankLogin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;