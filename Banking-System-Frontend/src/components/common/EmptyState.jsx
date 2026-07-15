import PropTypes from 'prop-types';

/**
 * EmptyState Component
 * 
 * Displays a message when data lists or tables are empty, with optional action button.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.icon] - Bootstrap icon class name (e.g., 'inbox', 'search')
 * @param {string} props.title - Main heading text
 * @param {string} props.message - Descriptive message text
 * @param {string} [props.actionLabel] - Label for the action button (optional)
 * @param {Function} [props.onAction] - Callback function when action button is clicked (optional)
 * 
 * Validates: Requirements 14.7, 19.3
 */
const EmptyState = ({ icon, title, message, actionLabel, onAction }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5 px-3">
      {icon && (
        <div className="mb-3">
          <i 
            className={`bi bi-${icon} text-muted`} 
            style={{ fontSize: '4rem' }}
          />
        </div>
      )}
      
      <h4 className="text-muted mb-2">{title}</h4>
      
      <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
        {message}
      </p>
      
      {actionLabel && onAction && (
        <button 
          type="button"
          className="btn btn-primary"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;
