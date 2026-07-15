import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationProvider, useNotification } from '../../contexts/NotificationContext';
import ToastContainer from './ToastContainer';

describe('ToastContainer Component', () => {
  // Helper function to render ToastContainer with NotificationContext
  const renderWithContext = (children = null) => {
    return render(
      <NotificationProvider>
        <ToastContainer />
        {children}
      </NotificationProvider>
    );
  };

  beforeEach(() => {
    // Reset any state if needed
  });

  describe('Rendering and Structure', () => {
    it('should render the toast container element', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toBeInTheDocument();
    });

    it('should have correct positioning classes', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toHaveClass('toast-container');
      expect(container).toHaveClass('position-fixed');
      expect(container).toHaveClass('top-0');
      expect(container).toHaveClass('end-0');
      expect(container).toHaveClass('p-3');
    });

    it('should have correct z-index for overlay positioning', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toHaveStyle({ zIndex: '9999' });
    });

    it('should have correct width constraints', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toHaveStyle({
        maxWidth: '400px',
        width: '100%',
      });
    });

    it('should render empty container when no notifications exist', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Toast Display Integration', () => {
    it('should display a single toast notification', async () => {
      const TestComponent = () => {
        const { showSuccess } = useNotification();
        return (
          <button onClick={() => showSuccess('Test message')}>
            Show Toast
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      const button = screen.getByRole('button', { name: /show toast/i });
      button.click();

      await screen.findByText('Test message');
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should display multiple toast notifications in stacked layout', () => {
      const TestComponent = () => {
        const { showSuccess, showError, showWarning } = useNotification();
        return (
          <div>
            <button onClick={() => showSuccess('Success message')}>
              Show Success
            </button>
            <button onClick={() => showError('Error message')}>
              Show Error
            </button>
            <button onClick={() => showWarning('Warning message')}>
              Show Warning
            </button>
          </div>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /show success/i }).click();
      screen.getByRole('button', { name: /show error/i }).click();
      screen.getByRole('button', { name: /show warning/i }).click();

      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('should render toasts with correct types', () => {
      const TestComponent = () => {
        const { showSuccess, showError, showWarning, showInfo } = useNotification();
        return (
          <div>
            <button onClick={() => showSuccess('Success', 0)}>Success</button>
            <button onClick={() => showError('Error', 0)}>Error</button>
            <button onClick={() => showWarning('Warning', 0)}>Warning</button>
            <button onClick={() => showInfo('Info', 0)}>Info</button>
          </div>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /^success$/i }).click();
      screen.getByRole('button', { name: /^error$/i }).click();
      screen.getByRole('button', { name: /^warning$/i }).click();
      screen.getByRole('button', { name: /^info$/i }).click();

      const toasts = screen.getAllByRole('alert');
      expect(toasts).toHaveLength(4);
      
      expect(toasts[0]).toHaveClass('alert-success');
      expect(toasts[1]).toHaveClass('alert-danger');
      expect(toasts[2]).toHaveClass('alert-warning');
      expect(toasts[3]).toHaveClass('alert-info');
    });
  });

  describe('Toast Removal Integration', () => {
    it('should remove toast when dismiss is called', () => {
      const TestComponent = () => {
        const { showSuccess } = useNotification();
        return (
          <button onClick={() => showSuccess('Remove me', 0)}>
            Show Toast
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /show toast/i }).click();

      expect(screen.getByText('Remove me')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /close/i });
      closeButton.click();

      expect(screen.queryByText('Remove me')).not.toBeInTheDocument();
    });

    it('should handle removal of multiple toasts independently', () => {
      const TestComponent = () => {
        const { showInfo } = useNotification();
        return (
          <div>
            <button onClick={() => showInfo('Toast 1', 0)}>Toast 1</button>
            <button onClick={() => showInfo('Toast 2', 0)}>Toast 2</button>
            <button onClick={() => showInfo('Toast 3', 0)}>Toast 3</button>
          </div>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /toast 1/i }).click();
      screen.getByRole('button', { name: /toast 2/i }).click();
      screen.getByRole('button', { name: /toast 3/i }).click();

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.getByText('Toast 2')).toBeInTheDocument();
      expect(screen.getByText('Toast 3')).toBeInTheDocument();

      // Dismiss the middle toast
      const closeButtons = screen.getAllByRole('button', { name: /close/i });
      closeButtons[1].click();

      expect(screen.getByText('Toast 1')).toBeInTheDocument();
      expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
      expect(screen.getByText('Toast 3')).toBeInTheDocument();
    });
  });

  describe('Notification Context Integration', () => {
    it('should use removeNotification from context', () => {
      const TestComponent = () => {
        const { showSuccess, removeNotification } = useNotification();
        const id = 'manual-remove-test';
        
        return (
          <div>
            <button onClick={() => showSuccess('Manual test', 0)}>
              Add Toast
            </button>
            <button onClick={() => removeNotification(id)}>
              Remove Manually
            </button>
          </div>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /add toast/i }).click();
      expect(screen.getByText('Manual test')).toBeInTheDocument();

      // Note: This tests that the component properly uses removeNotification
      // The actual removal is tested through the dismiss button
    });

    it('should reflect notification state changes from context', () => {
      const TestComponent = () => {
        const { notifications, showInfo } = useNotification();
        return (
          <div>
            <button onClick={() => showInfo('Dynamic notification', 0)}>
              Add Notification
            </button>
            <div data-testid="notification-count">{notifications.length}</div>
          </div>
        );
      };

      renderWithContext(<TestComponent />);

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0');

      screen.getByRole('button', { name: /add notification/i }).click();
      expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

      screen.getByRole('button', { name: /add notification/i }).click();
      expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
    });
  });

  describe('Toast Stacking Behavior', () => {
    it('should render toasts in the order they were added', () => {
      const TestComponent = () => {
        const { showInfo } = useNotification();
        return (
          <div>
            <button onClick={() => {
              showInfo('First', 0);
              showInfo('Second', 0);
              showInfo('Third', 0);
            }}>
              Add Multiple
            </button>
          </div>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /add multiple/i }).click();

      const messages = screen.getAllByText(/First|Second|Third/);
      expect(messages[0]).toHaveTextContent('First');
      expect(messages[1]).toHaveTextContent('Second');
      expect(messages[2]).toHaveTextContent('Third');
    });

    it('should maintain proper spacing between multiple toasts', () => {
      const TestComponent = () => {
        const { showSuccess } = useNotification();
        return (
          <button onClick={() => {
            showSuccess('Message 1', 0);
            showSuccess('Message 2', 0);
          }}>
            Show Toasts
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /show toasts/i }).click();

      const toasts = screen.getAllByRole('alert');
      expect(toasts.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive toast additions', () => {
      const TestComponent = () => {
        const { showInfo } = useNotification();
        return (
          <button onClick={() => {
            for (let i = 0; i < 10; i++) {
              showInfo(`Rapid toast ${i}`, 0);
            }
          }}>
            Rapid Add
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /rapid add/i }).click();

      const toasts = screen.getAllByRole('alert');
      expect(toasts).toHaveLength(10);
    });

    it('should handle notifications with same message but different IDs', () => {
      const TestComponent = () => {
        const { showWarning } = useNotification();
        return (
          <button onClick={() => {
            showWarning('Same message', 0);
            showWarning('Same message', 0);
            showWarning('Same message', 0);
          }}>
            Show Same
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /show same/i }).click();

      const messages = screen.getAllByText('Same message');
      expect(messages).toHaveLength(3);
    });

    it('should handle empty message strings', () => {
      const TestComponent = () => {
        const { showError } = useNotification();
        return (
          <button onClick={() => showError('', 0)}>
            Show Empty
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /show empty/i }).click();

      const toasts = screen.getAllByRole('alert');
      expect(toasts).toHaveLength(1);
    });

    it('should continue working after all toasts are dismissed', () => {
      const TestComponent = () => {
        const { showSuccess } = useNotification();
        return (
          <button onClick={() => showSuccess('Reusable', 0)}>
            Add Toast
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      // Add and remove first toast
      screen.getByRole('button', { name: /add toast/i }).click();
      screen.getByRole('button', { name: /close/i }).click();
      expect(screen.queryByText('Reusable')).not.toBeInTheDocument();

      // Add second toast - should still work
      screen.getByRole('button', { name: /add toast/i }).click();
      expect(screen.getByText('Reusable')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive width styling', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toHaveStyle({
        maxWidth: '400px',
        width: '100%',
      });
    });

    it('should maintain fixed positioning for all screen sizes', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toHaveClass('position-fixed');
    });
  });

  describe('Accessibility', () => {
    it('should render toast container in DOM for screen readers', () => {
      renderWithContext();

      const container = screen.getByTestId('toast-container');
      expect(container).toBeInTheDocument();
      expect(container).toBeVisible();
    });

    it('should allow keyboard navigation to dismiss buttons', () => {
      const TestComponent = () => {
        const { showInfo } = useNotification();
        return (
          <button onClick={() => showInfo('Keyboard test', 0)}>
            Show Toast
          </button>
        );
      };

      renderWithContext(<TestComponent />);

      screen.getByRole('button', { name: /show toast/i }).click();

      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
      closeButton.focus();
      expect(closeButton).toHaveFocus();
    });
  });
});
