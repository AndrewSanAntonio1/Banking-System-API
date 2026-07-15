# API Client Infrastructure

This directory contains the Axios-based API client infrastructure for communicating with the Spring Boot REST API backend.

## Components

### `apiClient.js`
The base Axios instance configured with:
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable (defaults to `http://localhost:8080`)
- **Timeout**: 10 seconds
- **Default Headers**: 
  - `Content-Type: application/json`
  - `Accept: application/json`

### `interceptors.js`
Request and response interceptors providing:

**Request Interceptor:**
- Automatically attaches JWT authentication token from `localStorage` to all requests
- Adds `Authorization: Bearer <token>` header when token exists

**Response Interceptor:**
- **401 Unauthorized**: Clears authentication state and redirects to login
- **403 Forbidden**: Returns unauthorized access error message
- **404 Not Found**: Returns resource not found error message
- **500 Internal Server Error**: Returns server error message
- **Network Errors**: Returns network connectivity error message

## Usage

### Basic Request Example

```javascript
import apiClient from '@/services/api/apiClient';

// GET request
const getBalance = async () => {
  try {
    const response = await apiClient.get('/api/banking/balance');
    return response.data;
  } catch (error) {
    console.error('Failed to get balance:', error.message);
    throw error;
  }
};

// POST request
const deposit = async (amount, description) => {
  try {
    const response = await apiClient.post('/api/banking/deposit', {
      amount,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Deposit failed:', error.message);
    throw error;
  }
};

// PUT request
const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/api/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Profile update failed:', error.message);
    throw error;
  }
};

// DELETE request
const deleteBeneficiary = async (id) => {
  try {
    const response = await apiClient.delete(`/api/beneficiaries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete beneficiary failed:', error.message);
    throw error;
  }
};
```

### Using with Endpoints Configuration

```javascript
import apiClient from '@/services/api/apiClient';
import API_ENDPOINTS from '@/config/endpoints';

// Using endpoint constants
const login = async (email, password) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
};

// Using dynamic endpoint function
const getTransactionDetail = async (transactionId) => {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.BANKING.TRANSACTION_DETAIL(transactionId)
    );
    return response.data;
  } catch (error) {
    console.error('Failed to get transaction:', error.message);
    throw error;
  }
};
```

### Error Handling

The API client automatically handles common error scenarios:

```javascript
import apiClient from '@/services/api/apiClient';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/api/some-endpoint');
    return response.data;
  } catch (error) {
    // Error message is already formatted by the interceptor
    // error.message contains user-friendly message
    
    if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.message);
      
      // Check specific status codes if needed
      if (error.response.status === 403) {
        // Handle permission error
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error:', error.message);
    } else {
      // Other error
      console.error('Error:', error.message);
    }
    
    throw error;
  }
};
```

### Authentication Flow

The authentication token is automatically managed:

```javascript
import apiClient from '@/services/api/apiClient';

// 1. Login - store token
const login = async (email, password) => {
  const response = await apiClient.post('/api/auth/login', {
    email,
    password
  });
  
  // Store token in localStorage
  localStorage.setItem('authToken', response.data.token);
  
  return response.data;
};

// 2. Make authenticated requests
// Token is automatically attached by request interceptor
const getProfile = async () => {
  const response = await apiClient.get('/api/profile');
  return response.data;
};

// 3. Logout - clear token
const logout = () => {
  localStorage.removeItem('authToken');
  // Subsequent requests will not include Authorization header
};
```

### Query Parameters

```javascript
import apiClient from '@/services/api/apiClient';

// Using params option
const getTransactions = async (page = 0, size = 10, type = null) => {
  const response = await apiClient.get('/api/banking/transactions', {
    params: {
      page,
      size,
      ...(type && { type })
    }
  });
  return response.data;
};

// URL: /api/banking/transactions?page=0&size=10&type=DEPOSIT
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Development
VITE_API_BASE_URL=http://localhost:8080

# Production
# VITE_API_BASE_URL=https://api.bankingsystem.com
```

### Timeout Configuration

To modify the timeout, update `apiClient.js`:

```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000, // 15 seconds
  // ...
});
```

## Testing

Unit tests are provided in `apiClient.test.js` covering:
- Base configuration (URL, timeout, headers)
- Request interceptor token attachment
- Response interceptor error handling (401, 403, 404, 500, network errors)
- Successful response handling

Run tests:
```bash
npm test -- src/services/api/apiClient.test.js --run
```
