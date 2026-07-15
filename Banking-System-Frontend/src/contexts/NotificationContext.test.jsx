import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { NotificationProvider, useNotification } from './NotificationContext';

/**
 * Test suite for NotificationContext
 * 
 * Validates notification management functionality
 */

// Test component that uses the NotificationContext
const TestComponent = () => {
  const { notifications, showSuccess, showError, showWarning, showInfo, removeNotification } = useNotification();

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <div data-testid="notifications">
        {notifications.map((notification) => (
          <div key={notification.id} data-testid={`notification-${notification.type}`}>
            {notification.message}
          </div>
        ))}
      </div>
      <button onClick={() => showSuccess('Success message')}>Show Success</button>
      <button onClick={() => showError('Error message')}>Show Error</button>
      <button onClick={() => showWarning('Warning message')}>Show Warning</button>
      <button onClick={() => showInfo('Info message')}>Show Info</button>
      <button onClick={() => {
        if (notifications.length > 0) {
          removeNotification(notifications[0].id);
        }
      }}>
        Remove First
      </button>
    </div>
  );
};

describe('NotificationContext', () => {
  it('should throw error when useNotification is used outside NotificationProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useNotification must be used within NotificationProvider');

    console.error = originalError;
  });

  it('should initialize with empty notifications', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId('notification-count').textContent).toBe('0');
  });

  it('should display success notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Success').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    expect(screen.getByTestId('notification-success')).toHaveTextContent('Success message');
  });

  it('should display error notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Error').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    expect(screen.getByTestId('notification-error')).toHaveTextContent('Error message');
  });

  it('should display warning notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Warning').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    expect(screen.getByTestId('notification-warning')).toHaveTextContent('Warning message');
  });

  it('should display info notification', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Info').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('1');
    expect(screen.getByTestId('notification-info')).toHaveTextContent('Info message');
  });

  it('should display multiple notifications', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Success').click();
    });

    await act(async () => {
      screen.getByText('Show Error').click();
    });

    await act(async () => {
      screen.getByText('Show Warning').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('3');
  });

  it('should remove notification manually', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Success').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('1');

    await act(async () => {
      screen.getByText('Remove First').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('0');
  });

  it('should set timeout for auto-dismissal', async () => {
    // Mock setTimeout to verify it's called correctly
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await act(async () => {
      screen.getByText('Show Success').click();
    });

    // Verify setTimeout was called for auto-dismissal
    expect(setTimeoutSpy).toHaveBeenCalled();
    
    // Verify notification exists before timeout
    expect(screen.getByTestId('notification-count').textContent).toBe('1');

    setTimeoutSpy.mockRestore();
  });

  it('should schedule timeout for multiple notifications', async () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    // Add multiple notifications
    await act(async () => {
      screen.getByText('Show Success').click();
    });

    await act(async () => {
      screen.getByText('Show Error').click();
    });

    expect(screen.getByTestId('notification-count').textContent).toBe('2');
    
    // Verify setTimeout was called for each notification
    expect(setTimeoutSpy).toHaveBeenCalledTimes(2);

    setTimeoutSpy.mockRestore();
  });

  it('should provide all notification methods', () => {
    const TestMethodsComponent = () => {
      const context = useNotification();

      return (
        <div>
          <div data-testid="has-showSuccess">{typeof context.showSuccess === 'function' ? 'true' : 'false'}</div>
          <div data-testid="has-showError">{typeof context.showError === 'function' ? 'true' : 'false'}</div>
          <div data-testid="has-showWarning">{typeof context.showWarning === 'function' ? 'true' : 'false'}</div>
          <div data-testid="has-showInfo">{typeof context.showInfo === 'function' ? 'true' : 'false'}</div>
          <div data-testid="has-removeNotification">{typeof context.removeNotification === 'function' ? 'true' : 'false'}</div>
        </div>
      );
    };

    render(
      <NotificationProvider>
        <TestMethodsComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId('has-showSuccess').textContent).toBe('true');
    expect(screen.getByTestId('has-showError').textContent).toBe('true');
    expect(screen.getByTestId('has-showWarning').textContent).toBe('true');
    expect(screen.getByTestId('has-showInfo').textContent).toBe('true');
    expect(screen.getByTestId('has-removeNotification').textContent).toBe('true');
  });
});
