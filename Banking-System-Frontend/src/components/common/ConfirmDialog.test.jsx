import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog Component', () => {
  let mockOnClose;
  let mockOnConfirm;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnConfirm = vi.fn();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should render dialog when isOpen is true', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Delete Item"
          message="Are you sure you want to delete this item?"
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    });

    it('should not render dialog when isOpen is false', () => {
      render(
        <ConfirmDialog
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('should render with default title when title not provided', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Are you sure?"
        />
      );

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    it('should render with custom title', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Custom Title"
          message="Test message"
        />
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should render message in dialog body', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="This is a confirmation message"
        />
      );

      const message = screen.getByTestId('confirm-dialog-message');
      expect(message).toHaveTextContent('This is a confirmation message');
    });

    it('should render cancel button with default text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('Cancel');
    });

    it('should render confirm button with default text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Confirm');
    });

    it('should render cancel button with custom text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          cancelText="No"
        />
      );

      expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('No');
    });

    it('should render confirm button with custom text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          confirmText="Yes"
        />
      );

      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Yes');
    });
  });

  describe('Variant styles', () => {
    it('should render confirm button with primary style for default variant', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          variant="default"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      expect(confirmButton).toHaveClass('btn', 'btn-primary');
      expect(confirmButton).not.toHaveClass('btn-danger');
    });

    it('should render confirm button with primary style when variant not specified', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      expect(confirmButton).toHaveClass('btn', 'btn-primary');
    });

    it('should render confirm button with danger style for danger variant', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          variant="danger"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      expect(confirmButton).toHaveClass('btn', 'btn-danger');
      expect(confirmButton).not.toHaveClass('btn-primary');
    });

    it('should always render cancel button with secondary style', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          variant="danger"
        />
      );

      const cancelButton = screen.getByTestId('confirm-dialog-cancel');
      expect(cancelButton).toHaveClass('btn', 'btn-secondary');
    });
  });

  describe('Button interactions', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const cancelButton = screen.getByTestId('confirm-dialog-cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should call both onConfirm and onClose when confirm button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onConfirm before onClose', async () => {
      const user = userEvent.setup();
      const callOrder = [];

      mockOnConfirm.mockImplementation(() => callOrder.push('confirm'));
      mockOnClose.mockImplementation(() => callOrder.push('close'));

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      await user.click(confirmButton);

      expect(callOrder).toEqual(['confirm', 'close']);
    });
  });

  describe('Modal integration', () => {
    it('should render as small size modal', () => {
      const { container } = render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).toHaveClass('modal-sm');
    });

    it('should close on ESC key by default', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should not close on ESC key when closeOnEscape is false', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          closeOnEscape={false}
        />
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should close on backdrop click by default', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const modal = screen.getByTestId('modal');
      await user.click(modal);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('should not close on backdrop click when closeOnBackdrop is false', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          closeOnBackdrop={false}
        />
      );

      const modal = screen.getByTestId('modal');
      await user.click(modal);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should close when clicking modal close button', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const closeButton = screen.getByTestId('modal-close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Use case scenarios', () => {
    it('should render delete confirmation dialog', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Delete Beneficiary"
          message="Are you sure you want to delete this beneficiary? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
        />
      );

      expect(screen.getByText('Delete Beneficiary')).toBeInTheDocument();
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Delete');
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveClass('btn-danger');
    });

    it('should render account freeze confirmation dialog', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Freeze Account"
          message="Are you sure you want to freeze this account?"
          confirmText="Freeze"
          cancelText="Cancel"
          variant="default"
        />
      );

      expect(screen.getByText('Freeze Account')).toBeInTheDocument();
      expect(screen.getByText(/freeze this account/)).toBeInTheDocument();
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Freeze');
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveClass('btn-primary');
    });

    it('should render logout confirmation dialog', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Yes, Logout"
          cancelText="No"
          variant="default"
        />
      );

      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Yes, Logout');
      expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('No');
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.4 - ConfirmDialog with yes/no actions', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Confirm this action?"
          confirmText="Yes"
          cancelText="No"
        />
      );

      // Verify both buttons exist
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveTextContent('Yes');
      expect(screen.getByTestId('confirm-dialog-cancel')).toHaveTextContent('No');

      // Test "Yes" action
      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      await user.click(confirmButton);

      expect(mockOnConfirm).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should validate Requirements 14.4 - variant support for default style', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Default variant test"
          variant="default"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      expect(confirmButton).toHaveClass('btn-primary');
    });

    it('should validate Requirements 14.4 - variant support for danger style', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Danger variant test"
          variant="danger"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      expect(confirmButton).toHaveClass('btn-danger');
    });

    it('should validate Requirements 4.8 - display confirmation dialog before delete', async () => {
      const user = userEvent.setup();
      const mockDeleteBeneficiary = vi.fn();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockDeleteBeneficiary}
          title="Delete Beneficiary"
          message="Are you sure you want to delete this beneficiary?"
          confirmText="Delete"
          variant="danger"
        />
      );

      // User sees the confirmation dialog
      expect(screen.getByText('Delete Beneficiary')).toBeInTheDocument();

      // User clicks confirm
      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      await user.click(confirmButton);

      // Delete action is triggered
      expect(mockDeleteBeneficiary).toHaveBeenCalledTimes(1);
    });

    it('should validate Requirements 8.10 - display confirmation dialog before account status change', async () => {
      const user = userEvent.setup();
      const mockFreezeAccount = vi.fn();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockFreezeAccount}
          title="Freeze Account"
          message="Are you sure you want to freeze this account?"
          confirmText="Freeze"
        />
      );

      // Admin sees confirmation dialog
      expect(screen.getByText('Freeze Account')).toBeInTheDocument();

      // Admin confirms action
      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      await user.click(confirmButton);

      // Freeze action is triggered
      expect(mockFreezeAccount).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge cases', () => {
    it('should handle very long messages', () => {
      const longMessage = 'This is a very long confirmation message. '.repeat(20);

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message={longMessage}
        />
      );

      const messageElement = screen.getByTestId('confirm-dialog-message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement.textContent).toContain('This is a very long confirmation message.');
    });

    it('should handle empty button text', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
          confirmText=""
          cancelText=""
        />
      );

      // Buttons should still render but with empty text
      expect(screen.getByTestId('confirm-dialog-confirm')).toBeInTheDocument();
      expect(screen.getByTestId('confirm-dialog-cancel')).toBeInTheDocument();
    });

    it('should handle rapid open/close state changes', () => {
      const { rerender } = render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();

      rerender(
        <ConfirmDialog
          isOpen={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

      rerender(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should handle multiple rapid confirm button clicks', async () => {
      const user = userEvent.setup();

      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const confirmButton = screen.getByTestId('confirm-dialog-confirm');
      
      // Click multiple times rapidly
      await user.click(confirmButton);
      await user.click(confirmButton);
      await user.click(confirmButton);

      // All callbacks should have been called
      // Note: In a real app, you'd likely want to prevent multiple clicks
      expect(mockOnConfirm).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle message with HTML special characters', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Delete <account> & confirm?"
        />
      );

      expect(screen.getByText('Delete <account> & confirm?')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should inherit modal accessibility features', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('role', 'dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should have button type attributes', () => {
      render(
        <ConfirmDialog
          isOpen={true}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          message="Test message"
        />
      );

      expect(screen.getByTestId('confirm-dialog-cancel')).toHaveAttribute('type', 'button');
      expect(screen.getByTestId('confirm-dialog-confirm')).toHaveAttribute('type', 'button');
    });
  });
});
