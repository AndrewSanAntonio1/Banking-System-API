import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Guards routes based on authentication status and user role.
 * Implements the following authorization logic:
 * 
 * 1. If user is not authenticated -> redirect to login
 * 2. If user has USER role attempting ADMIN route -> redirect to user dashboard
 * 3. If user has ADMIN role attempting USER route -> redirect to admin dashboard
 * 4. If user is authenticated and has correct role -> render the route content
 * 
 * Uses the Outlet pattern for rendering nested routes.
 * Displays loading spinner while authentication state is being checked.
 * 
 * Validates: Requirements 15.1, 15.2, 15.3, 15.5
 * 
 * @param {object} props - Component props
 * @param {string} [props.requiredRole] - Required role for accessing the route ('USER' or 'ADMIN')
 * @param {string} [props.redirectTo] - Custom redirect path if authorization fails
 * @returns {JSX.Element} The protected route content or redirect
 */
const ProtectedRoute = ({ requiredRole = null, redirectTo = '/login' }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication state is being checked
  // This prevents flash of redirect during initial session validation
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Requirement 15.1: Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Preserve the attempted location to redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Requirement 15.2: Redirect USER attempting ADMIN routes to user dashboard
  if (requiredRole === 'ADMIN' && user?.role === 'USER') {
    return <Navigate to="/user/dashboard" replace />;
  }

  // Requirement 15.3: Redirect ADMIN attempting USER routes to admin dashboard
  if (requiredRole === 'USER' && user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User is authenticated and has the correct role (or no role requirement)
  // Render nested routes using Outlet pattern
  return <Outlet />;
};

ProtectedRoute.propTypes = {
  /**
   * Required role for accessing the route.
   * If specified, user's role must match to access the route.
   * Valid values: 'USER', 'ADMIN', or null (no role requirement)
   */
  requiredRole: PropTypes.oneOf(['USER', 'ADMIN', null]),
  
  /**
   * Custom redirect path if user is not authenticated.
   * Defaults to '/login' if not specified.
   */
  redirectTo: PropTypes.string,
};

export default ProtectedRoute;
