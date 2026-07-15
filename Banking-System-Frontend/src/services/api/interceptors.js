/**
 * Axios Request and Response Interceptors
 * 
 * Provides:
 * - Request interceptor: Attaches authentication tokens to requests
 * - Response interceptor: Handles standardized error responses (401, 403, 404, 500, network errors)
 */

/**
 * Setup interceptors for the Axios instance
 * @param {import('axios').AxiosInstance} axiosInstance - The Axios instance to configure
 */
export const setupInterceptors = (axiosInstance) => {
  /**
   * Request Interceptor
   * Attaches authentication token from localStorage to request headers
   */
  axiosInstance.interceptors.request.use(
    (config) => {
      // Get authentication token from localStorage
      const token = localStorage.getItem('authToken');
      
      // Attach token to Authorization header if it exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      // Handle request error
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor
   * Handles standardized error responses and provides consistent error messages
   */
  axiosInstance.interceptors.response.use(
    (response) => {
      // Return successful response data
      return response;
    },
    (error) => {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status code
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // Unauthorized - clear authentication and redirect to login
            handleUnauthorizedError();
            error.message = data?.error?.message || 'Authentication failed. Please login again.';
            break;
            
          case 403:
            // Forbidden - user doesn't have permission
            error.message = data?.error?.message || 'You do not have permission to access this resource.';
            break;
            
          case 404:
            // Not Found
            error.message = data?.error?.message || 'The requested resource was not found.';
            break;
            
          case 500:
            // Internal Server Error
            error.message = data?.error?.message || 'An internal server error occurred. Please try again later.';
            break;
            
          default:
            // Other HTTP errors
            error.message = data?.error?.message || `Request failed with status ${status}.`;
            break;
        }
      } else if (error.request) {
        // Request was made but no response received (network error)
        error.message = 'Network error. Please check your internet connection and try again.';
      } else {
        // Something else happened while setting up the request
        error.message = error.message || 'An unexpected error occurred.';
      }
      
      return Promise.reject(error);
    }
  );
};

/**
 * Handle 401 Unauthorized errors
 * Clears authentication state and redirects to login page
 */
const handleUnauthorizedError = () => {
  // Clear authentication token from localStorage
  localStorage.removeItem('authToken');
  
  // Redirect to login page
  // Note: Using window.location instead of router to ensure clean state
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};
