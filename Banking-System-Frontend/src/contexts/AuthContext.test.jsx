import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

/**
 * Test suite for AuthContext
 * 
 * Validates requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7
 */

// Test component that uses the AuthContext
const TestComponent = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, register, updateUser } = useAuth();

  return (
    <div>
      <div data-testid="isAuthenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="isLoading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'null'}</div>
      <div data-testid="token">{token || 'null'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => register({ name: 'Test User', email: 'test@example.com', phone: '1234567890', password: 'password123' })}>
        Register
      </button>
      <button onClick={() => updateUser({ name: 'Updated Name' })}>
        Update User
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within AuthProvider');

    console.error = originalError;
  });

  it('should initialize with default state (Requirement 20.1)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');
  });

  it('should store authentication state after login (Requirement 20.3)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Click login button
    await act(async () => {
      screen.getByText('Login').click();
    });

    // Wait for authentication state to update
    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    // Verify user data is stored
    const userData = JSON.parse(screen.getByTestId('user').textContent);
    expect(userData).toHaveProperty('email', 'test@example.com');
    expect(userData).toHaveProperty('role');

    // Verify token is stored
    expect(screen.getByTestId('token').textContent).not.toBe('null');

    // Verify localStorage persistence (Requirement 20.6)
    expect(localStorage.getItem('authToken')).not.toBeNull();
    expect(localStorage.getItem('userData')).not.toBeNull();
  });

  it('should clear authentication state on logout (Requirement 20.4)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Login first
    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    // Now logout
    await act(async () => {
      screen.getByText('Logout').click();
    });

    // Verify state is cleared
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');

    // Verify localStorage is cleared
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('userData')).toBeNull();
  });

  it('should restore session from localStorage (Requirement 20.5)', async () => {
    // Pre-populate localStorage with session data
    const mockToken = 'existing-token';
    const mockUser = {
      id: '1',
      email: 'existing@example.com',
      name: 'Existing User',
      role: 'USER',
      accountNumber: 'ACC123456789',
    };

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('userData', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Verify session is restored
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    expect(screen.getByTestId('token').textContent).toBe(mockToken);

    const userData = JSON.parse(screen.getByTestId('user').textContent);
    expect(userData).toEqual(mockUser);
  });

  it('should provide register method (Requirement 20.2)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Click register button - should not throw error
    await act(async () => {
      screen.getByText('Register').click();
    });

    // Registration doesn't change auth state, but method should exist
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
  });

  it('should update user data with updateUser method (Requirement 20.2)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Login first
    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    // Update user
    await act(async () => {
      screen.getByText('Update User').click();
    });

    // Verify user data is updated
    const userData = JSON.parse(screen.getByTestId('user').textContent);
    expect(userData.name).toBe('Updated Name');

    // Verify localStorage is updated
    const storedUser = JSON.parse(localStorage.getItem('userData'));
    expect(storedUser.name).toBe('Updated Name');
  });

  it('should persist token in localStorage (Requirement 20.6)', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoading').textContent).toBe('false');
    });

    // Verify no token initially
    expect(localStorage.getItem('authToken')).toBeNull();

    // Login
    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    // Verify token is persisted
    const storedToken = localStorage.getItem('authToken');
    expect(storedToken).not.toBeNull();
    expect(storedToken.length).toBeGreaterThan(0);
  });

  it('should provide context wrapper (Requirement 20.7)', () => {
    // Simply rendering without error proves the provider works
    const { container } = render(
      <AuthProvider>
        <div>Content</div>
      </AuthProvider>
    );

    expect(container.querySelector('div')).toHaveTextContent('Content');
  });
});
