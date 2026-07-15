import PropTypes from 'prop-types';

/**
 * StatusBadge Component
 * 
 * Displays a color-coded status badge using Bootstrap badge classes
 * 
 * @component
 * @example
 * <StatusBadge status="active" />
 * <StatusBadge status="pending" label="Processing" />
 */
const StatusBadge = ({ status, label }) => {
  // Map status to Bootstrap badge variant
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    frozen: { variant: 'info', label: 'Frozen' },
    closed: { variant: 'danger', label: 'Closed' },
    completed: { variant: 'success', label: 'Completed' },
    failed: { variant: 'danger', label: 'Failed' },
  };

  const normalizedStatus = status.toLowerCase();
  const config = statusConfig[normalizedStatus];

  // If status not found in config, default to secondary
  const variant = config ? config.variant : 'secondary';
  const displayLabel = label || (config ? config.label : status);

  return (
    <span className={`badge bg-${variant}`} role="status" aria-label={`Status: ${displayLabel}`}>
      {displayLabel}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.oneOf([
    'active',
    'inactive',
    'pending',
    'frozen',
    'closed',
    'completed',
    'failed',
    'Active',
    'Inactive',
    'Pending',
    'Frozen',
    'Closed',
    'Completed',
    'Failed',
    'ACTIVE',
    'INACTIVE',
    'PENDING',
    'FROZEN',
    'CLOSED',
    'COMPLETED',
    'FAILED',
  ]).isRequired,
  label: PropTypes.string,
};

export default StatusBadge;
