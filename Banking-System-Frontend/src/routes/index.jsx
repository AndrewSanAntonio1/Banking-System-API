import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy load all route components for code splitting and performance
// Public pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

// User pages
const UserLayout = lazy(() => import('../components/layout/UserLayout'));
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const DepositPage = lazy(() => import('../pages/user/DepositPage'));
const WithdrawPage = lazy(() => import('../pages/user/WithdrawPage'));
const TransferPage = lazy(() => import('../pages/user/TransferPage'));
const TransactionHistoryPage = lazy(() => import('../pages/user/TransactionHistoryPage'));
const TransactionDetailPage = lazy(() => import('../pages/user/TransactionDetailPage'));
const ViewProfilePage = lazy(() => import('../pages/user/ViewProfilePage'));
const EditProfilePage = lazy(() => import('../pages/user/EditProfilePage'));
const ChangePasswordPage = lazy(() => import('../pages/user/ChangePasswordPage'));
const BeneficiaryListPage = lazy(() => import('../pages/user/BeneficiaryListPage'));

// Admin pages
const AdminLayout = lazy(() => import('../components/layout/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CustomerListPage = lazy(() => import('../pages/admin/CustomerListPage'));
const CustomerDetailPage = lazy(() => import('../pages/admin/CustomerDetailPage'));
const CustomerFormPage = lazy(() => import('../pages/admin/CustomerFormPage'));
const AccountListPage = lazy(() => import('../pages/admin/AccountListPage'));
const AccountDetailPage = lazy(() => import('../pages/admin/AccountDetailPage'));
const TransactionListPage = lazy(() => import('../pages/admin/TransactionListPage'));
const AdminTransactionDetailPage = lazy(() => import('../pages/admin/AdminTransactionDetailPage'));
const AuditLogPage = lazy(() => import('../pages/admin/AuditLogPage'));
const FraudMonitoringPage = lazy(() => import('../pages/admin/FraudMonitoringPage'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));

/**
 * Router configuration for the Banking System Frontend
 * 
 * Route Structure:
 * - Public routes: /login, /register, /forgot-password, /reset-password
 * - User routes: /user/* (dashboard, banking operations, profile, beneficiaries)
 * - Admin routes: /admin/* (dashboard, customers, accounts, transactions, audit, fraud, reports)
 * 
 * All routes use lazy loading for optimal code splitting and performance.
 * Root path (/) redirects to /login.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  // Public routes - accessible without authentication
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  // User routes - protected, requires USER role
  {
    path: '/user',
    element: <ProtectedRoute requiredRole="USER" />,
    children: [
      {
        path: '',
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/user/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <UserDashboard />,
          },
          // Banking operations routes
          {
            path: 'deposit',
            element: <DepositPage />,
          },
          {
            path: 'withdraw',
            element: <WithdrawPage />,
          },
          {
            path: 'transfer',
            element: <TransferPage />,
          },
          {
            path: 'transactions',
            element: <TransactionHistoryPage />,
          },
          {
            path: 'transactions/:transactionId',
            element: <TransactionDetailPage />,
          },
          // Profile management routes
          {
            path: 'profile',
            element: <ViewProfilePage />,
          },
          {
            path: 'profile/edit',
            element: <EditProfilePage />,
          },
          {
            path: 'profile/change-password',
            element: <ChangePasswordPage />,
          },
          // Beneficiary management routes
          {
            path: 'beneficiaries',
            element: <BeneficiaryListPage />,
          },
        ],
      },
    ],
  },
  // Admin routes - protected, requires ADMIN role
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="ADMIN" />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
        {
          index: true,
          element: <Navigate to="/admin/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <AdminDashboard />,
        },
        // Customer management routes
        {
          path: 'customers',
          element: <CustomerListPage />,
        },
        {
          path: 'customers/create',
          element: <CustomerFormPage />,
        },
        {
          path: 'customers/:customerId',
          element: <CustomerDetailPage />,
        },
        {
          path: 'customers/:customerId/edit',
          element: <CustomerFormPage />,
        },
        // Account management routes
        {
          path: 'accounts',
          element: <AccountListPage />,
        },
        {
          path: 'accounts/:accountNumber',
          element: <AccountDetailPage />,
        },
        // Transaction management routes
        {
          path: 'transactions',
          element: <TransactionListPage />,
        },
        {
          path: 'transactions/:transactionId',
          element: <AdminTransactionDetailPage />,
        },
        // Audit logs routes
        {
          path: 'audit',
          element: <AuditLogPage />,
        },
        // Fraud monitoring routes
        {
          path: 'fraud',
          element: <FraudMonitoringPage />,
        },
        // Reports routes
        {
          path: 'reports',
          element: <ReportsPage />,
        },
      ],
    },
  ],
},
]);

export default router;
