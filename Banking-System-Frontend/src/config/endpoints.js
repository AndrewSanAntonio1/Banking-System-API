/**
 * API Endpoint Constants
 * 
 * Centralized configuration for all REST API endpoint URLs.
 * This file defines all backend endpoint paths used throughout the application.
 */

const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VALIDATE_TOKEN: '/api/auth/validate-token',
  },

  // User banking operations endpoints
  BANKING: {
    GET_BALANCE: '/api/banking/balance',
    DEPOSIT: '/api/banking/deposit',
    WITHDRAW: '/api/banking/withdraw',
    TRANSFER: '/api/banking/transfer',
    TRANSACTIONS: '/api/banking/transactions',
    TRANSACTION_DETAIL: (id) => `/api/banking/transactions/${id}`,
  },

  // Beneficiary management endpoints
  BENEFICIARIES: {
    LIST: '/api/beneficiaries',
    CREATE: '/api/beneficiaries',
    UPDATE: (id) => `/api/beneficiaries/${id}`,
    DELETE: (id) => `/api/beneficiaries/${id}`,
    GET_BY_ID: (id) => `/api/beneficiaries/${id}`,
  },

  // User profile management endpoints
  PROFILE: {
    GET: '/api/profile',
    UPDATE: '/api/profile',
    CHANGE_PASSWORD: '/api/profile/change-password',
  },

  // Admin - Customer management endpoints
  ADMIN: {
    CUSTOMERS: {
      LIST: '/api/admin/customers',
      CREATE: '/api/admin/customers',
      DETAIL: (id) => `/api/admin/customers/${id}`,
      UPDATE: (id) => `/api/admin/customers/${id}`,
      UPDATE_STATUS: (id) => `/api/admin/customers/${id}/status`,
      SEARCH: '/api/admin/customers/search',
    },

    // Admin - Account management endpoints
    ACCOUNTS: {
      LIST: '/api/admin/accounts',
      DETAIL: (accountNumber) => `/api/admin/accounts/${accountNumber}`,
      FREEZE: (accountNumber) => `/api/admin/accounts/${accountNumber}/freeze`,
      UNFREEZE: (accountNumber) => `/api/admin/accounts/${accountNumber}/unfreeze`,
      CLOSE: (accountNumber) => `/api/admin/accounts/${accountNumber}/close`,
    },

    // Admin - Transaction management endpoints
    TRANSACTIONS: {
      LIST: '/api/admin/transactions',
      DETAIL: (id) => `/api/admin/transactions/${id}`,
      SEARCH: '/api/admin/transactions/search',
    },

    // Admin - Audit log endpoints
    AUDIT: {
      USER_ACTIVITY: '/api/admin/audit/user-activity',
      LOGIN_HISTORY: '/api/admin/audit/login-history',
      TRANSACTION_LOGS: '/api/admin/audit/transaction-logs',
    },

    // Admin - Fraud monitoring endpoints
    FRAUD: {
      MONITORING: '/api/admin/fraud/monitoring',
      SUSPICIOUS_TRANSACTIONS: '/api/admin/fraud/suspicious-transactions',
    },

    // Admin - Reports endpoints
    REPORTS: {
      DAILY: '/api/admin/reports/daily',
      MONTHLY: '/api/admin/reports/monthly',
      EXPORT: '/api/admin/reports/export',
    },

    // Admin - Dashboard statistics endpoints
    STATISTICS: '/api/admin/statistics',
  },
};

export default API_ENDPOINTS;
