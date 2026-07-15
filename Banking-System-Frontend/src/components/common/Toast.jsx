import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Toast Component
 * 
 * Displays a notification message with various severity levels.
 * Supports auto-dismiss after a configurable duration and manual dismiss on click.
 * 
 * @param {object} props - Component props
 * @param {string} props.id - Unique identifier for the toast
 * @param {string} props.type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {string} props.message - Message text to display
 * @param {number} props.duration - Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
 * @param {Function} props.onDismiss - Callback function when toast is dismissed
 */
const Toast = ({ id, type, message, duration = 5000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Map toast types to Bootstrap alert classes
  const typeToAlertClass = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
  };

  // Map toast types to icons
  const typeToIcon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const alertClass = typeToAlertClass[type] || 'alert-info';
  const icon = typeToIcon[type] || 'ℹ';

  /**
   * Handle toast dismissal with fade-out animation
   */
  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Wait for animation to complete before calling onDismiss
    setTimeout(() => {
      setIsVisible(false);
      onDismiss(id);
    }, 300); // Match CSS transition duration
  }, [id, onDismiss]);

  useEffect(() => {
    // Auto-dismiss after duration if duration > 0
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, handleDismiss]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`alert ${alertClass} alert-dismissible fade ${isExiting ? '' : 'show'} toast-notification`}
      role="alert"
      onClick={handleDismiss}
      style={{
        cursor: 'pointer',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease-in-out',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
      }}
      data-testid={`toast-${type}`}
    >
      <span
        style={{
          fontSize: '1.25rem',
          marginRight: '0.75rem',
          fontWeight: 'bold',
        }}
      >
        {icon}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        style={{ marginLeft: '0.5rem' }}
      />
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onDismiss: PropTypes.func.isRequired,
};

export default Toast;
