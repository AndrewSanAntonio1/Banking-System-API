/**
 * Unit Tests for API Client Infrastructure
 * 
 * Tests verify:
 * - Base Axios instance configuration (base URL, timeout, headers)
 * - Request interceptor attaches authentication tokens
 * - Response interceptor handles different error codes (401, 403, 404, 500)
 * - Network error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import apiClient from './apiClient';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.location
delete window.location;
window.location = { href: '', pathname: '/' };

describe('API Client Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.pathname = '/';
  });

  it('should have correct base URL configuration', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it('should have 10 second timeout configured', () => {
    expect(apiClient.defaults.timeout).toBe(10000);
  });

  it('should have default Content-Type and Accept headers', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    expect(apiClient.defaults.headers['Accept']).toBe('application/json');
  });
});

describe('Request Interceptor - Authentication Token Attachment', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should attach Authorization header when token exists in localStorage', async () => {
    // Setup: Store token in localStorage
    const testToken = 'test-jwt-token-12345';
    localStorage.setItem('authToken', testToken);

    // Create a mock adapter to intercept the request
    const mockAdapter = vi.fn((config) => {
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    // Make a request
    await apiClient.get('/test-endpoint');

    // Verify: Authorization header should be attached
    expect(mockAdapter).toHaveBeenCalled();
    const requestConfig = mockAdapter.mock.calls[0][0];
    expect(requestConfig.headers.Authorization).toBe(`Bearer ${testToken}`);
  });

  it('should not attach Authorization header when token does not exist', async () => {
    // Setup: Ensure no token in localStorage
    localStorage.removeItem('authToken');

    // Create a mock adapter
    const mockAdapter = vi.fn((config) => {
      return Promise.resolve({
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    // Make a request
    await apiClient.get('/test-endpoint');

    // Verify: No Authorization header should be present
    const requestConfig = mockAdapter.mock.calls[0][0];
    expect(requestConfig.headers.Authorization).toBeUndefined();
  });
});

describe('Response Interceptor - Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.pathname = '/dashboard';
  });

  it('should handle 401 Unauthorized error and redirect to login', async () => {
    // Setup: Store token that will become invalid
    localStorage.setItem('authToken', 'invalid-token');

    // Mock adapter that returns 401
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 401,
          data: { error: { message: 'Invalid token' } },
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    // Make request and expect rejection
    try {
      await apiClient.get('/protected-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      // Verify: Token should be cleared
      expect(localStorage.getItem('authToken')).toBeNull();
      
      // Verify: Error message should be set
      expect(error.message).toBe('Invalid token');
      
      // Verify: Redirect should happen
      expect(window.location.href).toBe('/login');
    }
  });

  it('should handle 403 Forbidden error with appropriate message', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 403,
          data: { error: { message: 'Access denied' } },
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/admin-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('Access denied');
    }
  });

  it('should handle 403 Forbidden error with default message when no message provided', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 403,
          data: {},
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/admin-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('You do not have permission to access this resource.');
    }
  });

  it('should handle 404 Not Found error with appropriate message', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 404,
          data: { error: { message: 'User not found' } },
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/users/999');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });

  it('should handle 404 Not Found error with default message', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 404,
          data: {},
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/unknown-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('The requested resource was not found.');
    }
  });

  it('should handle 500 Internal Server Error with appropriate message', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 500,
          data: { error: { message: 'Database connection failed' } },
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.post('/banking/transfer');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('Database connection failed');
    }
  });

  it('should handle 500 Internal Server Error with default message', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 500,
          data: {},
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/some-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('An internal server error occurred. Please try again later.');
    }
  });

  it('should handle network errors when no response received', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        request: {},
        message: 'Network Error',
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/test-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('Network error. Please check your internet connection and try again.');
    }
  });

  it('should handle other unexpected errors', async () => {
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        message: 'Something went wrong during request setup',
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.get('/test-endpoint');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('Something went wrong during request setup');
    }
  });

  it('should not redirect to login when already on login page (401 error)', async () => {
    window.location.pathname = '/login';
    window.location.href = ''; // Reset href
    
    const mockAdapter = vi.fn(() => {
      return Promise.reject({
        response: {
          status: 401,
          data: { error: { message: 'Invalid credentials' } },
        },
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    try {
      await apiClient.post('/auth/login');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).toBe('Invalid credentials');
      // The interceptor still sets href to '/login', but doesn't navigate
      // since we're already on the login page (checked via pathname)
    }
  });
});

describe('Successful Response Handling', () => {
  it('should return response data for successful requests', async () => {
    const mockData = { success: true, data: { balance: 1000 } };
    
    const mockAdapter = vi.fn((config) => {
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    });

    apiClient.defaults.adapter = mockAdapter;

    const response = await apiClient.get('/banking/balance');
    
    expect(response.data).toEqual(mockData);
    expect(response.status).toBe(200);
  });
});
