import PropTypes from 'prop-types';

/**
 * LoadingSpinner Component
 * 
 * Displays a Bootstrap spinner for loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Size of the spinner: 'sm', 'md', 'lg'
 * @param {string} [props.color='primary'] - Bootstrap color variant: 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
 * @param {boolean} [props.fullScreen=false] - Whether to display spinner in fullscreen overlay
 * 
 * Validates: Requirements 14.5, 19.1
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', fullScreen = false }) => {
  // Map size to Bootstrap spinner class
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  
  // Calculate spinner dimensions for different sizes
  const spinnerStyle = size === 'lg' ? { width: '3rem', height: '3rem' } : {};

  const spinner = (
    <div
      className={`spinner-border text-${color} ${sizeClass}`}
      role="status"
      style={spinnerStyle}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  // If fullScreen mode, wrap in overlay
  if (fullScreen) {
    return (
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75"
        style={{ zIndex: 9999 }}
      >
        {spinner}
      </div>
    );
  }

  // Otherwise, just return centered spinner
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      {spinner}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;
