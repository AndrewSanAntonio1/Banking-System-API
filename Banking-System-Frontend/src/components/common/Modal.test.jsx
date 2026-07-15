import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal Component', () => {
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = vi.fn();
  });

  afterEach(() => {
    // Restore body overflow style after each test
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    });

    it('should render modal with title', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="My Title">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-title')).toHaveTextContent('My Title');
    });

    it('should render modal without title when not provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-title')).not.toBeInTheDocument();
    });

    it('should render modal body with children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <div data-testid="custom-content">Custom content</div>
        </Modal>
      );

      expect(screen.getByTestId('modal-body')).toBeInTheDocument();
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should render footer when provided', () => {
      const footer = (
        <div>
          <button>Cancel</button>
          <button>Confirm</button>
        </div>
      );

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" footer={footer}>
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-footer')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
    });

    it('should render close button by default', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
    });

    it('should not render close button when showCloseButton is false', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" showCloseButton={false}>
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
    });
  });

  describe('Size variants', () => {
    it('should render with small size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="small">
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).toHaveClass('modal-sm');
    });

    it('should render with medium size (default)', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="medium">
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).not.toHaveClass('modal-sm');
      expect(modalDialog).not.toHaveClass('modal-lg');
      expect(modalDialog).not.toHaveClass('modal-xl');
      expect(modalDialog).not.toHaveClass('modal-fullscreen');
    });

    it('should render with large size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="large">
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).toHaveClass('modal-lg');
    });

    it('should render with xl size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="xl">
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).toHaveClass('modal-xl');
    });

    it('should render with fullscreen size', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="fullscreen">
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).toHaveClass('modal-fullscreen');
    });

    it('should default to medium size when size not specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).not.toHaveClass('modal-sm');
      expect(modalDialog).not.toHaveClass('modal-lg');
    });
  });

  describe('Backdrop click functionality', () => {
    it('should close modal when clicking backdrop by default', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      await user.click(modal);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close modal when clicking modal content', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modalBody = screen.getByTestId('modal-body');
      await user.click(modalBody);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not close modal when closeOnBackdrop is false', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnBackdrop={false} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      await user.click(modal);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('ESC key functionality', () => {
    it('should close modal when pressing ESC key by default', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not close modal when pressing other keys', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" showCloseButton={false}>
          <p>Content</p>
        </Modal>
      );

      // Focus on modal body to avoid accidentally clicking close button
      const modalBody = screen.getByTestId('modal-body');
      modalBody.focus();

      await user.keyboard('{Enter}');
      await user.keyboard('{Space}');

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not close modal when closeOnEscape is false', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} closeOnEscape={false} title="Test">
          <p>Content</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Close button functionality', () => {
    it('should close modal when clicking close button', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByTestId('modal-close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Body scroll lock', () => {
    it('should lock body scroll when modal is open', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when modal is closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('');
    });

    it('should restore body scroll when modal unmounts', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('role', 'dialog');
    });

    it('should have aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should have tabIndex="-1"', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveAttribute('tabIndex', '-1');
    });

    it('should have aria-label on close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByTestId('modal-close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });
  });

  describe('Z-index layering', () => {
    it('should render backdrop with z-index 1040', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop).toHaveStyle({ zIndex: 1040 });
    });

    it('should render modal with z-index 1050', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveStyle({ zIndex: 1050 });
    });
  });

  describe('Complex content scenarios', () => {
    it('should render modal with complex JSX children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Complex Modal">
          <div>
            <h3>Section 1</h3>
            <p>Paragraph content</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </Modal>
      );

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('should render modal with form in body', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Form Modal">
          <form data-testid="modal-form">
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
          </form>
        </Modal>
      );

      expect(screen.getByTestId('modal-form')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });

    it('should render modal with action buttons in footer', () => {
      const footer = (
        <>
          <button type="button" className="btn btn-secondary">
            Cancel
          </button>
          <button type="button" className="btn btn-primary">
            Save changes
          </button>
        </>
      );

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Actions Modal" footer={footer}>
          <p>Make your changes</p>
        </Modal>
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save changes')).toBeInTheDocument();
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.3 - modal with customizable header, body, footer', () => {
      const footer = <button>Custom Footer</button>;
      
      render(
        <Modal
          isOpen={true}
          onClose={mockOnClose}
          title="Custom Header"
          footer={footer}
        >
          <div>Custom Body Content</div>
        </Modal>
      );

      expect(screen.getByText('Custom Header')).toBeInTheDocument();
      expect(screen.getByText('Custom Body Content')).toBeInTheDocument();
      expect(screen.getByText('Custom Footer')).toBeInTheDocument();
    });

    it('should validate Requirements 14.3 - backdrop click and ESC key to close', async () => {
      const user = userEvent.setup();
      
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      // Test ESC key
      await user.keyboard('{Escape}');
      expect(mockOnClose).toHaveBeenCalledTimes(1);

      // Reset mock
      mockOnClose.mockClear();

      // Re-render for backdrop test
      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      // Test backdrop click
      const modal = screen.getByTestId('modal');
      await user.click(modal);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should validate Requirements 14.3 - size variants', () => {
      const sizes = ['small', 'medium', 'large', 'xl', 'fullscreen'];
      const sizeClasses = {
        small: 'modal-sm',
        medium: '',
        large: 'modal-lg',
        xl: 'modal-xl',
        fullscreen: 'modal-fullscreen',
      };

      sizes.forEach((size) => {
        const { container, unmount } = render(
          <Modal isOpen={true} onClose={mockOnClose} size={size}>
            <p>Content</p>
          </Modal>
        );

        const modalDialog = container.querySelector('.modal-dialog');
        if (sizeClasses[size]) {
          expect(modalDialog).toHaveClass(sizeClasses[size]);
        }

        unmount();
        document.body.style.overflow = '';
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid open/close state changes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should handle empty string title', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="">
          <p>Content</p>
        </Modal>
      );

      // Empty string title still renders title element
      const title = screen.queryByTestId('modal-title');
      // Modal doesn't render empty title, should not be present
      expect(title).not.toBeInTheDocument();
    });

    it('should handle invalid size prop gracefully', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="invalid">
          <p>Content</p>
        </Modal>
      );

      const modalDialog = container.querySelector('.modal-dialog');
      expect(modalDialog).toBeInTheDocument();
    });

    it('should handle both closeOnBackdrop and closeOnEscape disabled', async () => {
      const user = userEvent.setup();
      
      render(
        <Modal
          isOpen={true}
          onClose={mockOnClose}
          closeOnBackdrop={false}
          closeOnEscape={false}
          title="Test"
        >
          <p>Content</p>
        </Modal>
      );

      // Try ESC key
      await user.keyboard('{Escape}');
      expect(mockOnClose).not.toHaveBeenCalled();

      // Try backdrop click
      const modal = screen.getByTestId('modal');
      await user.click(modal);
      expect(mockOnClose).not.toHaveBeenCalled();

      // Close button should still work
      const closeButton = screen.getByTestId('modal-close-button');
      await user.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
