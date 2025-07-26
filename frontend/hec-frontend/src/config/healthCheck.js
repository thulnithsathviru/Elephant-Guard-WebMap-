import axios from 'axios';
import { createApiUrl } from './api';

/**
 * Check if the API is healthy and accessible
 * @returns {Promise<boolean>} True if API is healthy, false otherwise
 */
export const checkApiHealth = async () => {
  try {
    const response = await axios.get(createApiUrl('/health'), {
      timeout: 5000 // 5 second timeout
    });
    return response.data.success === true;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Show a user-friendly message when API is not available
 */
export const showApiUnavailableMessage = () => {
  console.warn('Backend API is currently unavailable. Some features may not work properly.');
  
  // You can also show a toast notification here if you have a toast library
  // For now, we'll just log to console
  if (typeof window !== 'undefined') {
    // Could implement a banner or notification here
  }
};

export default {
  checkApiHealth,
  showApiUnavailableMessage
};
