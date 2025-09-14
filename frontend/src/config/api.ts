// API Configuration for Production Deployment
const getApiBaseUrl = (): string => {
  console.log('API Config Debug:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Using development URL: http://localhost:5001');
    return 'http://localhost:5001';
    
  }
  
  // Check for custom API URL in environment (set by Vercel)
  if (process.env.REACT_APP_API_URL) {
    console.log('Using production URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback - this will be updated when you deploy to Railway
  console.warn('REACT_APP_API_URL not set, using Railway production fallback');
  return 'https://hackmit2025-production.up.railway.app';
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  CHECK_PROFILE: (userType: string, uid: string) => `/api/users/check-profile/${userType}/${uid}`,
  CHECK_EMAIL: (userType: string, email: string) => `/api/users/check-email/${userType}/${email}`,
  CREATE_VOLUNTEER_PROFILE: '/api/volunteers/create-profile',
  CREATE_STORE_PROFILE: '/api/stores/create-profile',
  CREATE_FOODBANK_PROFILE: '/api/foodbanks/create-profile',
  
  // Store endpoints
  STORE_LOCATIONS: '/api/stores/locations',
  CREATE_PACKAGE: '/api/packages/create',
  STORE_PACKAGES: (email: string) => `/api/packages/store/${email}`,
  
  // Package endpoints
  AVAILABLE_PACKAGES: '/api/packages/available',
  VERIFY_PICKUP_PIN: (id: number) => `/api/packages/${id}/verify-pin`,
  ASSIGN_PACKAGE: (id: number) => `/api/packages/${id}/assign`,
  PICKUP_PACKAGE: (id: number) => `/api/packages/${id}/pickup`,
  DELIVER_PACKAGE: (id: number) => `/api/packages/${id}/deliver`,
  COMPLETE_PACKAGE: (id: number) => `/api/packages/${id}/complete`,
  DELETE_PACKAGE: (id: number) => `/api/packages/${id}`,
  VOLUNTEER_PACKAGES: (volunteerId: string) => `/api/packages/volunteer/${volunteerId}`,
  
  // Health check
  HEALTH_CHECK: '/api/health',
};

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default API_BASE_URL;
