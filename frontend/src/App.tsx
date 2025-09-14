import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';
import LandingPage from './components/LandingPage';
import MainLogin from './components/MainLogin';
import VolunteerLogin from './components/VolunteerLogin';
import VolunteerDashboard from './components/VolunteerDashboard';
import VolunteerFindPickups from './components/VolunteerFindPickups';
import VolunteerRewards from './components/VolunteerRewards';
import VolunteerLeaderboard from './components/VolunteerLeaderboard';
import VolunteerGlobalImpact from './components/VolunteerGlobalImpact';
import StoreLogin from './components/StoreLogin';
import StoreDashboard from './components/StoreDashboard';
import StoreCreatePackage from './components/StoreCreatePackage';
import StorePackages from './components/StorePackages';
import StoreImpact from './components/StoreImpact';
import StoreGlobalImpact from './components/StoreGlobalImpact';
import FoodBankLogin from './components/FoodBankLogin';
import FoodBankDashboard from './components/FoodBankDashboard';
import FoodBankDeliveryLog from './components/FoodBankDeliveryLog';
import FoodBankDeliveryConfirm from './components/FoodBankDeliveryConfirm';
import FoodBankGlobalImpact from './components/FoodBankGlobalImpact';
import VolunteerProfileSetup from './components/VolunteerProfileSetup';
import StoreProfileSetup from './components/StoreProfileSetup';
import FoodBankProfileSetup from './components/FoodBankProfileSetup';
import { createDevHelper } from './utils/devHelper';

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

// Component to manage authentication state
const AuthStateManager: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', {
        user: currentUser?.email || 'No user',
        uid: currentUser?.uid || 'No UID',
        timestamp: new Date().toISOString()
      });
      
      setUser(currentUser);
      setLoading(false);
      
      // Store auth state in sessionStorage for debugging
      if (currentUser) {
        sessionStorage.setItem('reflourish_user', JSON.stringify({
          email: currentUser.email,
          uid: currentUser.uid,
          lastLogin: new Date().toISOString()
        }));
        console.log('✅ User session stored:', currentUser.email);
      } else {
        sessionStorage.removeItem('reflourish_user');
        console.log('❌ User session cleared');
      }
    });

    // Check if there's a stored session on app load
    const storedUser = sessionStorage.getItem('reflourish_user');
    if (storedUser) {
      console.log('📱 Found stored session:', JSON.parse(storedUser));
    }

    return () => {
      console.log('🔧 Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  // Log current auth state for debugging
  useEffect(() => {
    if (!loading) {
      console.log('🔍 Current auth state:', {
        authenticated: !!user,
        email: user?.email,
        loading: loading,
        environment: process.env.NODE_ENV
      });
    }
  }, [user, loading]);

  return null;
};

// Component to initialize dev helper with navigation
const DevHelperInitializer: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    createDevHelper(navigate);
  }, [navigate]);
  
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthStateManager />
        <DevHelperInitializer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<MainLogin />} />
          <Route path="/volunteer-login" element={<VolunteerLogin />} />
          <Route path="/store-login" element={<StoreLogin />} />
          <Route path="/foodbank-login" element={<FoodBankLogin />} />
          <Route path="/volunteer" element={<VolunteerLogin />} />
          <Route path="/volunteer/profile-setup" element={<VolunteerProfileSetup />} />
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer/find-pickups" element={<VolunteerFindPickups />} />
          <Route path="/volunteer/rewards" element={<VolunteerRewards />} />
          <Route path="/volunteer/leaderboard" element={<VolunteerLeaderboard />} />
          <Route path="/volunteer/global-impact" element={<VolunteerGlobalImpact />} />
          <Route path="/store" element={<StoreLogin />} />
          <Route path="/store/profile-setup" element={<StoreProfileSetup />} />
          <Route path="/store/dashboard" element={<StoreDashboard />} />
          <Route path="/store/create-package" element={<StoreCreatePackage />} />
          <Route path="/store/packages" element={<StorePackages />} />
          <Route path="/store/impact" element={<StoreImpact />} />
          <Route path="/store/global-impact" element={<StoreGlobalImpact />} />
          <Route path="/foodbank" element={<FoodBankLogin />} />
          <Route path="/foodbank/profile-setup" element={<FoodBankProfileSetup />} />
          <Route path="/foodbank/dashboard" element={<FoodBankDashboard />} />
          <Route path="/foodbank/delivery-log" element={<FoodBankDeliveryLog />} />
          <Route path="/foodbank/delivery-confirm" element={<FoodBankDeliveryConfirm />} />
          <Route path="/foodbank/global-impact" element={<FoodBankGlobalImpact />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;