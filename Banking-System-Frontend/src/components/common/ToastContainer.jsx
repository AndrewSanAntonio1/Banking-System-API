import { useNotification } from '../../contexts/NotificationContext';
import Toast from './Toast';

/**
 * ToastContainer Component
 * 
 * Container component that displays multiple toast notifications in a stacked layout.
 * Automatically manages toast positioning and rendering based on notification state
 * from the NotificationContext.
 * 
 * Features:
 * - Fixed positioning in top-right corner
 * - Stacked layout with vertical spacing
 * - Responsive positioning for mobile devices
 * - Automatic toast lifecycle management
 * 
 * @example
 * // Include once in App.jsx or main layout
 * <ToastContainer />
 */
const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{
        zIndex: 9999,
        maxWidth: '400px',
        width: '100%',
      }}
      data-testid="toast-container"
    >
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onDismiss={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
