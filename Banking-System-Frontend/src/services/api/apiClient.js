/**
 * API Client Configuration
 * 
 * Base Axios instance configured with:
 * - Base URL from environment variables
 * - 10-second timeout
 * - Default headers
 * - Request/response interceptors
 */

import axios from 'axios';
import { setupInterceptors } from './interceptors';

/**
 * Create base Axios instance with configuration
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Setup request and response interceptors
 * This must be called after the apiClient is created
 */
setupInterceptors(apiClient);

export default apiClient;
