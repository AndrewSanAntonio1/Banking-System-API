import PropTypes from 'prop-types';
import Modal from './Modal';

/**
 * ConfirmDialog Component
 * 
 * A confirmation dialog with yes/no actions, built on top of the Modal component.
 * Used for destructive or important actions that require user confirmation.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Controls dialog visibility
 * @param {Function} props.onClose - Callback when dialog is canceled or closed
 * @param {Function} props.onConfirm - Callback when user confirms the action
 * @param {string} [props.title='Confirm Action'] - Dialog header title
 * @param {string} props.message - Confirmation message to display
 * @param {string} [props.confirmText='Confirm'] - Text for confirm button
 * @param {string} [props.cancelText='Cancel'] - Text for cancel button
 * @param {string} [props.variant='default'] - Style variant: 'default' or 'danger'
 * @param {boolean} [props.closeOnBackdrop=true] - Whether clicking backdrop closes dialog
 * @param {boolean} [props.closeOnEscape=true] - Whether ESC key closes dialog
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  /**
   * Handle confirm button click
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  /**
   * Determine button class based on variant
   */
  const confirmButtonClass = variant === 'danger' ? 'btn btn-danger' : 'btn btn-primary';

  /**
   * Footer with action buttons
   */
  const footer = (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onClose}
        data-testid="confirm-dialog-cancel"
      >
        {cancelText}
      </button>
      <button
        type="button"
        className={confirmButtonClass}
        onClick={handleConfirm}
        data-testid="confirm-dialog-confirm"
      >
        {confirmText}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="small"
      closeOnBackdrop={closeOnBackdrop}
      closeOnEscape={closeOnEscape}
    >
      <p className="mb-0" data-testid="confirm-dialog-message">
        {message}
      </p>
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'danger']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
};

export default ConfirmDialog;
