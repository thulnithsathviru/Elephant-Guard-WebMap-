// API configuration for different environments
const API_CONFIG = {
  // Development - uses Vite proxy
  development: {
    baseURL: '/api'
  },
  // Production - uses direct Railway URL
  production: {
    baseURL: 'https://elephant-guard-production.up.railway.app/api'
  }
};

// Determine environment
const isDevelopment = import.meta.env.DEV;
const environment = isDevelopment ? 'development' : 'production';

// Export the current environment's config
export const API_BASE_URL = API_CONFIG[environment].baseURL;

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export default API_CONFIG;
