import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

/**
 * Test suite for ProtectedRoute Component
 * 
 * Validates requirements: 15.1, 15.2, 15.3, 15.5
 */

// Mock the AuthContext module at the top level
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Import the mocked useAuth
import { useAuth } from '../../contexts/AuthContext';

// Mock child component that will be rendered inside protected routes
const ProtectedContent = () => <div>Protected Content</div>;
const UserContent = () => <div>User Content</div>;
const AdminContent = () => <div>Admin Content</div>;

// Helper function to render ProtectedRoute with custom auth state
const renderWithAuth = (authState, initialRoute = '/', routeConfig) => {
  // Set the mock return value for this test
  useAuth.mockReturnValue(authState);

  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        {routeConfig}
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('Requirement 15.5: Loading State Display', () => {
    it('should display loading spinner while authentication is being checked', () => {
      const authState = {
        isAuthenticated: false,
        isLoading: true,
        user: null,
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
        </>
      );

      // Verify loading spinner is displayed
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Verify protected content is NOT displayed
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 15.1: Unauthenticated Route Protection', () => {
    it('should redirect to login page when user is not authenticated', () => {
      const authState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </>
      );

      // Verify redirect to login page
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to custom redirectTo path when specified and user is not authenticated', () => {
      const authState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute redirectTo="/custom-login" />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
          <Route path="/custom-login" element={<div>Custom Login Page</div>} />
        </>
      );

      // Verify redirect to custom login page
      expect(screen.getByText('Custom Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 15.2: USER Role Attempting ADMIN Routes', () => {
    it('should redirect USER to user dashboard when attempting to access ADMIN route', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'USER',
          accountNumber: 'ACC123456789',
        },
      };

      renderWithAuth(
        authState,
        '/admin/dashboard',
        <>
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminContent />} />
          </Route>
          <Route path="/user/dashboard" element={<div>User Dashboard</div>} />
        </>
      );

      // Verify redirect to user dashboard
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 15.3: ADMIN Role Attempting USER Routes', () => {
    it('should redirect ADMIN to admin dashboard when attempting to access USER route', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '2',
          email: 'admin@example.com',
          name: 'Test Admin',
          role: 'ADMIN',
          accountNumber: 'ACC987654321',
        },
      };

      renderWithAuth(
        authState,
        '/user/dashboard',
        <>
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/user/dashboard" element={<UserContent />} />
          </Route>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </>
      );

      // Verify redirect to admin dashboard
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('User Content')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 15.5: Outlet Pattern for Nested Routes', () => {
    it('should render protected content using Outlet when authenticated and authorized', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'USER',
          accountNumber: 'ACC123456789',
        },
      };

      renderWithAuth(
        authState,
        '/user/dashboard',
        <>
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/user/dashboard" element={<UserContent />} />
          </Route>
        </>
      );

      // Verify protected content is rendered
      expect(screen.getByText('User Content')).toBeInTheDocument();
    });

    it('should allow access to routes without role requirement when authenticated', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'USER',
          accountNumber: 'ACC123456789',
        },
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
        </>
      );

      // Verify content is rendered when no specific role is required
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should allow ADMIN to access routes without role requirement', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '2',
          email: 'admin@example.com',
          name: 'Test Admin',
          role: 'ADMIN',
          accountNumber: 'ACC987654321',
        },
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
        </>
      );

      // Verify content is rendered when no specific role is required
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing user object gracefully', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: null, // Edge case: authenticated but no user object
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </>
      );

      // Should render content (no role check will fail with null user)
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should handle undefined role gracefully', () => {
      const authState = {
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: undefined,
          accountNumber: 'ACC123456789',
        },
      };

      renderWithAuth(
        authState,
        '/protected',
        <>
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/protected" element={<ProtectedContent />} />
          </Route>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </>
      );

      // Should render content (undefined role won't match 'ADMIN')
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
