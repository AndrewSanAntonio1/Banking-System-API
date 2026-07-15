import { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Modal Component
 * 
 * A reusable modal dialog with customizable header, body, and footer.
 * Supports backdrop click and ESC key to close, with multiple size variants.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Callback function when modal is closed
 * @param {string} [props.title] - Modal header title
 * @param {React.ReactNode} props.children - Modal body content
 * @param {React.ReactNode} [props.footer] - Optional footer content (buttons, etc.)
 * @param {string} [props.size='medium'] - Modal size: 'small', 'medium', 'large', 'xl', 'fullscreen'
 * @param {boolean} [props.closeOnBackdrop=true] - Whether clicking backdrop closes modal
 * @param {boolean} [props.closeOnEscape=true] - Whether ESC key closes modal
 * @param {boolean} [props.showCloseButton=true] - Whether to show X close button in header
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
}) => {
  // Map size prop to Bootstrap modal size classes
  const sizeToClass = {
    small: 'modal-sm',
    medium: '',
    large: 'modal-lg',
    xl: 'modal-xl',
    fullscreen: 'modal-fullscreen',
  };

  const modalSizeClass = sizeToClass[size] || '';

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback(
    (e) => {
      // Only close if clicking the backdrop itself, not modal content
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  /**
   * Handle ESC key press
   */
  const handleEscapeKey = useCallback(
    (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  /**
   * Set up ESC key listener and body scroll lock when modal is open
   */
  useEffect(() => {
    if (isOpen) {
      // Add ESC key listener
      document.addEventListener('keydown', handleEscapeKey);

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Focus management - focus first focusable element in modal
      const modalElement = document.querySelector('.modal.show');
      if (modalElement) {
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        data-testid="modal-backdrop"
      />

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        onClick={handleBackdropClick}
        data-testid="modal"
      >
        <div className={`modal-dialog ${modalSizeClass}`} role="document">
          <div className="modal-content">
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && (
                  <h5 className="modal-title" data-testid="modal-title">
                    {title}
                  </h5>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                    data-testid="modal-close-button"
                  />
                )}
              </div>
            )}

            {/* Modal Body */}
            <div className="modal-body" data-testid="modal-body">
              {children}
            </div>

            {/* Modal Footer */}
            {footer && (
              <div className="modal-footer" data-testid="modal-footer">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl', 'fullscreen']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
};

export default Modal;
