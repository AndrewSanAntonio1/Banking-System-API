import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from './Toast';

describe('Toast Component', () => {
  let mockOnDismiss;

  beforeEach(() => {
    mockOnDismiss = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render toast with success variant', () => {
      render(
        <Toast
          id="test-1"
          type="success"
          message="Success message"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByTestId('toast-success')).toBeInTheDocument();
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('alert-success');
    });

    it('should render toast with error variant', () => {
      render(
        <Toast
          id="test-2"
          type="error"
          message="Error message"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByTestId('toast-error')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('alert-danger');
    });

    it('should render toast with warning variant', () => {
      render(
        <Toast
          id="test-3"
          type="warning"
          message="Warning message"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByTestId('toast-warning')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('alert-warning');
    });

    it('should render toast with info variant', () => {
      render(
        <Toast
          id="test-4"
          type="info"
          message="Info message"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByTestId('toast-info')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('alert-info');
    });

    it('should render with close button', () => {
      render(
        <Toast
          id="test-5"
          type="info"
          message="Test message"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Auto-dismiss functionality', () => {
    it('should auto-dismiss after specified duration', async () => {
      render(
        <Toast
          id="test-6"
          type="success"
          message="Auto-dismiss test"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(mockOnDismiss).not.toHaveBeenCalled();

      // Fast-forward time by duration + animation time
      await vi.advanceTimersByTimeAsync(5300);

      expect(mockOnDismiss).toHaveBeenCalledWith('test-6');
    });

    it('should not auto-dismiss when duration is 0', async () => {
      render(
        <Toast
          id="test-7"
          type="info"
          message="No auto-dismiss"
          duration={0}
          onDismiss={mockOnDismiss}
        />
      );

      // Fast-forward time significantly
      await vi.advanceTimersByTimeAsync(10000);

      expect(mockOnDismiss).not.toHaveBeenCalled();
    });

    it('should use default duration of 5000ms when not specified', async () => {
      render(
        <Toast
          id="test-8"
          type="info"
          message="Default duration"
          onDismiss={mockOnDismiss}
        />
      );

      // Fast-forward by 5000ms + animation time
      await vi.advanceTimersByTimeAsync(5300);

      expect(mockOnDismiss).toHaveBeenCalledWith('test-8');
    });
  });

  describe('Manual dismiss functionality', () => {
    it('should dismiss when clicking on toast body', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      
      render(
        <Toast
          id="test-9"
          type="info"
          message="Click to dismiss"
          duration={0}
          onDismiss={mockOnDismiss}
        />
      );

      const toast = screen.getByRole('alert');
      await user.click(toast);

      // Wait for animation time
      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('test-9');
      }, { timeout: 1000 });
      
      vi.useFakeTimers();
    });

    it('should dismiss when clicking close button', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      
      render(
        <Toast
          id="test-10"
          type="success"
          message="Close button test"
          duration={0}
          onDismiss={mockOnDismiss}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Wait for animation time
      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('test-10');
      }, { timeout: 1000 });
      
      vi.useFakeTimers();
    });

    it('should stop propagation when clicking close button', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      const toastClickHandler = vi.fn();
      
      render(
        <div onClick={toastClickHandler}>
          <Toast
            id="test-11"
            type="warning"
            message="Stop propagation test"
            duration={0}
            onDismiss={mockOnDismiss}
          />
        </div>
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // The close button click should not propagate to parent div
      expect(toastClickHandler).not.toHaveBeenCalled();
      
      vi.useFakeTimers();
    });
  });

  describe('Toast styling and appearance', () => {
    it('should have cursor pointer style', () => {
      render(
        <Toast
          id="test-12"
          type="info"
          message="Cursor test"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      const toast = screen.getByRole('alert');
      expect(toast).toHaveStyle({ cursor: 'pointer' });
    });

    it('should have box shadow for elevation', () => {
      render(
        <Toast
          id="test-13"
          type="success"
          message="Shadow test"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      const toast = screen.getByRole('alert');
      expect(toast).toHaveStyle({ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' });
    });

    it('should display appropriate icon for each type', () => {
      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
      };

      Object.entries(icons).forEach(([type, icon]) => {
        const { unmount } = render(
          <Toast
            id={`test-icon-${type}`}
            type={type}
            message="Icon test"
            duration={5000}
            onDismiss={mockOnDismiss}
          />
        );

        expect(screen.getByText(icon)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Animation behavior', () => {
    it('should apply show class initially', () => {
      render(
        <Toast
          id="test-14"
          type="info"
          message="Animation test"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('show');
    });

    it('should trigger exit animation on dismiss', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      
      render(
        <Toast
          id="test-15"
          type="info"
          message="Exit animation test"
          duration={0}
          onDismiss={mockOnDismiss}
        />
      );

      const toast = screen.getByRole('alert');
      expect(toast).toHaveStyle({ opacity: 1 });

      await user.click(toast);

      // Wait for animation to complete
      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith('test-15');
      }, { timeout: 1000 });
      
      vi.useFakeTimers();
    });
  });

  describe('Accessibility', () => {
    it('should have role="alert"', () => {
      render(
        <Toast
          id="test-16"
          type="info"
          message="Accessibility test"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have aria-label on close button', () => {
      render(
        <Toast
          id="test-17"
          type="success"
          message="ARIA test"
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      const closeButton = screen.getByRole('button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close');
    });
  });

  describe('Edge cases', () => {
    it('should handle very short durations', async () => {
      render(
        <Toast
          id="test-18"
          type="info"
          message="Short duration"
          duration={100}
          onDismiss={mockOnDismiss}
        />
      );

      await vi.advanceTimersByTimeAsync(400);

      expect(mockOnDismiss).toHaveBeenCalledWith('test-18');
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(500);
      
      render(
        <Toast
          id="test-19"
          type="warning"
          message={longMessage}
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle empty message', () => {
      render(
        <Toast
          id="test-20"
          type="info"
          message=""
          duration={5000}
          onDismiss={mockOnDismiss}
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
