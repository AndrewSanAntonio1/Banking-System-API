import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AuthContext
 * 
 * Manages authentication state globally including:
 * - User information (id, email, name, role, accountNumber)
 * - Authentication token (JWT)
 * - Authentication status
 * - Loading state during session checks
 * 
 * Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7
 */

const AuthContext = createContext(null);

/**
 * Initial authentication state
 */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

/**
 * AuthProvider Component
 * 
 * Wraps the application component tree and provides authentication state
 * and methods to all child components via Context API.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  /**
   * Check for existing session on component mount
   * Validates token stored in localStorage and restores session
   */
  useEffect(() => {
    checkSession();
  }, []);

  /**
   * Check for existing authentication session
   * 
   * Validates: Requirement 20.5
   * 
   * Reads token from localStorage and attempts to restore the session.
   * If token exists but is invalid, clears localStorage.
   */
  const checkSession = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setState({ ...initialState, isLoading: false });
        return;
      }

      // For now, we'll just restore the token and user data from localStorage
      // In a real implementation, this would validate with the API
      const userDataString = localStorage.getItem('userData');
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setState({
          user: userData,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Token exists but no user data - clear token
        localStorage.removeItem('authToken');
        setState({ ...initialState, isLoading: false });
      }
    } catch (error) {
      // If there's any error parsing or validating, clear everything
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setState({ ...initialState, isLoading: false });
    }
  };

  /**
   * Login user with credentials
   * 
   * Validates: Requirement 20.3
   * 
   * @param {object} credentials - Login credentials (email, password)
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<object>} Response data from authentication API
   * @throws {Error} If authentication fails
   */
  const login = async (credentials) => {
    try {
      // This will be replaced with actual API call via authService
      // For now, we're just setting up the structure
      // const response = await authService.login(credentials);
      
      // Simulated response structure
      const response = {
        data: {
          token: 'simulated-jwt-token',
          user: {
            id: '1',
            email: credentials.email,
            name: 'User Name',
            role: 'USER',
            accountNumber: 'ACC123456789',
            status: 'ACTIVE',
          },
        },
      };

      const { token, user } = response.data;

      // Persist token in localStorage (Requirement 20.6)
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));

      // Update context state
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      // Clear any partial state on error
      setState({ ...initialState, isLoading: false });
      throw error;
    }
  };

  /**
   * Logout user and clear authentication state
   * 
   * Validates: Requirement 20.4
   * 
   * Clears all authentication state including token and user data
   * from both context and localStorage.
   */
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');

    // Reset context state to initial values
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  /**
   * Register new user account
   * 
   * Validates: Requirement 20.2
   * 
   * @param {object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email address
   * @param {string} userData.phone - User phone number
   * @param {string} userData.password - User password
   * @returns {Promise<object>} Response data from registration API
   * @throws {Error} If registration fails
   */
  const register = async (userData) => {
    try {
      // This will be replaced with actual API call via authService
      // const response = await authService.register(userData);
      
      // For now, just return a simulated success response
      const response = {
        data: {
          success: true,
          message: 'Registration successful. Please login.',
        },
      };

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update user profile information
   * 
   * Validates: Requirement 20.2
   * 
   * @param {object} updatedUserData - Updated user information
   * @param {string} updatedUserData.name - Updated user name
   * @param {string} updatedUserData.email - Updated email address
   * @param {string} updatedUserData.phone - Updated phone number
   * @returns {Promise<object>} Response data from profile update API
   * @throws {Error} If update fails
   */
  const updateUser = async (updatedUserData) => {
    try {
      // This will be replaced with actual API call via profileService
      // const response = await profileService.updateProfile(updatedUserData);
      
      // Update the user data in state
      const updatedUser = {
        ...state.user,
        ...updatedUserData,
      };

      // Persist updated user data
      localStorage.setItem('userData', JSON.stringify(updatedUser));

      setState({
        ...state,
        user: updatedUser,
      });

      return { data: updatedUser };
    } catch (error) {
      throw error;
    }
  };

  /**
   * Context value provided to consumers
   * Includes state and methods for authentication management
   */
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    // Methods
    login,
    logout,
    register,
    checkSession,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for accessing AuthContext
 * 
 * @returns {object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};

export default AuthContext;
