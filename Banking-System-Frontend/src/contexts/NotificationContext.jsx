import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * NotificationContext
 * 
 * Manages global toast notifications for user feedback including:
 * - Success messages (green)
 * - Error messages (red)
 * - Warning messages (yellow)
 * - Info messages (blue)
 * 
 * Notifications auto-dismiss after a configurable duration.
 */

const NotificationContext = createContext(null);

/**
 * Default notification duration in milliseconds
 */
const DEFAULT_DURATION = 5000; // 5 seconds

/**
 * Generate unique ID for notifications
 */
let notificationIdCounter = 0;
const generateId = () => {
  notificationIdCounter += 1;
  return `notification-${notificationIdCounter}-${Date.now()}`;
};

/**
 * NotificationProvider Component
 * 
 * Wraps the application component tree and provides notification state
 * and methods to all child components via Context API.
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Remove a notification by ID
   * 
   * @param {string} id - Notification ID to remove
   */
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  /**
   * Add a notification to the queue
   * 
   * @param {string} type - Notification type (success, error, warning, info)
   * @param {string} message - Notification message text
   * @param {number} duration - Auto-dismiss duration in milliseconds
   * @returns {string} Notification ID
   */
  const addNotification = useCallback(
    (type, message, duration = DEFAULT_DURATION) => {
      const id = generateId();
      const notification = {
        id,
        type,
        message,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification]
  );

  /**
   * Display success notification
   * 
   * @param {string} message - Success message text
   * @param {number} [duration=5000] - Auto-dismiss duration in milliseconds
   * @returns {string} Notification ID
   * 
   * @example
   * showSuccess('Transaction completed successfully');
   */
  const showSuccess = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      return addNotification('success', message, duration);
    },
    [addNotification]
  );

  /**
   * Display error notification
   * 
   * @param {string} message - Error message text
   * @param {number} [duration=5000] - Auto-dismiss duration in milliseconds
   * @returns {string} Notification ID
   * 
   * @example
   * showError('Failed to process transaction');
   */
  const showError = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      return addNotification('error', message, duration);
    },
    [addNotification]
  );

  /**
   * Display warning notification
   * 
   * @param {string} message - Warning message text
   * @param {number} [duration=5000] - Auto-dismiss duration in milliseconds
   * @returns {string} Notification ID
   * 
   * @example
   * showWarning('Your session will expire soon');
   */
  const showWarning = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      return addNotification('warning', message, duration);
    },
    [addNotification]
  );

  /**
   * Display info notification
   * 
   * @param {string} message - Info message text
   * @param {number} [duration=5000] - Auto-dismiss duration in milliseconds
   * @returns {string} Notification ID
   * 
   * @example
   * showInfo('System maintenance scheduled for tonight');
   */
  const showInfo = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      return addNotification('info', message, duration);
    },
    [addNotification]
  );

  /**
   * Context value provided to consumers
   * Includes notification state and methods for displaying notifications
   */
  const value = {
    // State
    notifications,
    // Methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook for accessing NotificationContext
 * 
 * @returns {object} Notification context value
 * @throws {Error} If used outside of NotificationProvider
 * 
 * @example
 * const { showSuccess, showError, showWarning, showInfo } = useNotification();
 * showSuccess('Operation completed successfully!');
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;
