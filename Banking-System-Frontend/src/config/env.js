/**
 * Environment Configuration
 * 
 * Centralized access to environment variables.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

export const ENV = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  
  // Environment info
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
};

// Log configuration in development (helps with debugging)
if (ENV.DEV) {
  console.log('Environment Configuration:', {
    API_BASE_URL: ENV.API_BASE_URL,
    MODE: ENV.MODE,
  });
}

export default ENV;
