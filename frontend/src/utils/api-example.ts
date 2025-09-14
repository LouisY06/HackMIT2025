// Example of how to update your frontend components to use the new API configuration

import { API_BASE_URL, API_ENDPOINTS, apiCall } from '../config/api';

// Example: Updated API call in VolunteerFindPickups component
export const fetchAvailablePackages = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.AVAILABLE_PACKAGES);
    return response;
  } catch (error) {
    console.error('Failed to fetch available packages:', error);
    throw error;
  }
};

// Example: Updated API call for assigning packages
export const assignPackage = async (packageId: number, volunteerId: string) => {
  try {
    const response = await apiCall(API_ENDPOINTS.ASSIGN_PACKAGE(packageId), {
      method: 'POST',
      body: JSON.stringify({ volunteer_id: volunteerId }),
    });
    return response;
  } catch (error) {
    console.error('Failed to assign package:', error);
    throw error;
  }
};

// Example: Updated API call for completing packages
export const completePackage = async (packageId: number, volunteerId: string) => {
  try {
    const response = await apiCall(API_ENDPOINTS.COMPLETE_PACKAGE(packageId), {
      method: 'POST',
      body: JSON.stringify({ volunteer_id: volunteerId }),
    });
    return response;
  } catch (error) {
    console.error('Failed to complete package:', error);
    throw error;
  }
};

// Example: Updated API call for fetching store locations
export const fetchStoreLocations = async () => {
  try {
    const response = await apiCall(API_ENDPOINTS.STORE_LOCATIONS);
    return response;
  } catch (error) {
    console.error('Failed to fetch store locations:', error);
    throw error;
  }
};

// Example: Updated API call for fetching volunteer packages
export const fetchVolunteerPackages = async (volunteerId: string) => {
  try {
    const response = await apiCall(API_ENDPOINTS.VOLUNTEER_PACKAGES(volunteerId));
    return response;
  } catch (error) {
    console.error('Failed to fetch volunteer packages:', error);
    throw error;
  }
};

// Example of how to replace hardcoded URLs in your components:

// BEFORE:
// const response = await fetch('http://localhost:5001/api/packages/available');

// AFTER:
// const response = await fetchAvailablePackages();

// Or if you prefer to use the direct API call:
// const response = await apiCall(API_ENDPOINTS.AVAILABLE_PACKAGES);
