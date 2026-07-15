import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render search input with default placeholder', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} placeholder="Search users..." />);

      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    });

    it('should render search icon', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const searchIcon = container.querySelector('.bi-search');
      expect(searchIcon).toBeInTheDocument();
    });

    it('should not render clear button initially', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('should render clear button when input has value', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('should render with initial value', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} initialValue="initial search" />);

      expect(screen.getByRole('textbox')).toHaveValue('initial search');
      expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('should render disabled state', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} disabled={true} />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should accept custom className', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(
        <SearchBar onSearch={mockOnSearch} className="custom-search-class" />
      );

      const wrapper = container.querySelector('.custom-search-class');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Debounced Input', () => {
    it('should debounce search with default 300ms delay', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 't');

      // Should not call immediately
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Fast-forward time by 300ms
      vi.advanceTimersByTime(300);

      // Now should be called
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('t');
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
      });
    });

    it('should debounce search with custom delay', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} debounceMs={500} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Should not call before delay
      vi.advanceTimersByTime(300);
      expect(mockOnSearch).not.toHaveBeenCalled();

      // Should call after custom delay
      vi.advanceTimersByTime(200);
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      });
    });

    it('should only trigger search once after rapid typing', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'hello');

      // Advance timer only once at the end
      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('hello');
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
      });
    });

    it('should reset debounce timer on each keystroke', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      
      // Type first character
      await user.type(input, 'h');
      vi.advanceTimersByTime(200);
      
      // Type second character (resets timer)
      await user.type(input, 'e');
      vi.advanceTimersByTime(200);
      
      // Should not have been called yet
      expect(mockOnSearch).not.toHaveBeenCalled();
      
      // Complete the debounce delay
      vi.advanceTimersByTime(100);
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('he');
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onSearch with empty string on mount with default value', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      // Initial call should happen after debounce
      vi.advanceTimersByTime(300);

      expect(mockOnSearch).toHaveBeenCalledWith('');
    });

    it('should call onSearch with initial value on mount', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} initialValue="test" />);

      vi.advanceTimersByTime(300);

      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  describe('Clear Button Functionality', () => {
    it('should clear input when clear button is clicked', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'search text');

      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      expect(input).toHaveValue('');
    });

    it('should call onSearch with empty string after clearing', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'search text');
      
      mockOnSearch.mockClear();

      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      });
    });

    it('should hide clear button after clearing', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'search text');

      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);

      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('should disable clear button when SearchBar is disabled', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} initialValue="test" disabled={true} />);

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeDisabled();
    });

    it('should show x-circle icon in clear button', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      const clearButton = screen.getByLabelText('Clear search');
      const icon = clearButton.querySelector('.bi-x-circle');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update input value on user typing', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test query');

      expect(input).toHaveValue('test query');
    });

    it('should handle backspace/delete correctly', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} initialValue="test" />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      expect(input).toHaveValue('');
    });

    it('should handle paste events', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.paste('pasted text');

      expect(input).toHaveValue('pasted text');

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('pasted text');
      });
    });

    it('should not allow interaction when disabled', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} disabled={true} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Input should remain empty as it's disabled
      expect(input).toHaveValue('');
      expect(input).toBeDisabled();
    });
  });

  describe('Bootstrap Styling', () => {
    it('should apply input-group class', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      expect(container.querySelector('.input-group')).toBeInTheDocument();
    });

    it('should apply form-control class to input', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      expect(screen.getByRole('textbox')).toHaveClass('form-control');
    });

    it('should apply input-group-text class to icon wrapper', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const iconWrapper = container.querySelector('.input-group-text');
      expect(iconWrapper).toBeInTheDocument();
      expect(iconWrapper).toHaveClass('bg-white');
    });

    it('should apply btn classes to clear button', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveClass('btn', 'btn-outline-secondary');
    });

    it('should apply position-relative to container', () => {
      const mockOnSearch = vi.fn();
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('position-relative');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on search input', () => {
      const mockOnSearch = vi.fn();
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search');
    });

    it('should have aria-label on clear button', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveAttribute('aria-label', 'Clear search');
    });

    it('should have aria-hidden on icons', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      // Search icon
      const searchIcon = container.querySelector('.bi-search');
      expect(searchIcon).toHaveAttribute('aria-hidden', 'true');

      // Clear button icon (after typing)
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      const clearIcon = container.querySelector('.bi-x-circle');
      expect(clearIcon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have title attribute on clear button', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toHaveAttribute('title', 'Clear search');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string input', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} initialValue="test" />);

      const input = screen.getByRole('textbox');
      await user.clear(input);

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('');
      });
    });

    it('should handle special characters', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, '@#$%^&*()');

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('@#$%^&*()');
      });
    });

    it('should handle very long search strings', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const longString = 'a'.repeat(1000);
      const input = screen.getByRole('textbox');
      await user.type(input, longString);

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(longString);
      });
    });

    it('should handle rapid clear and type', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'first');
      
      const clearButton = screen.getByLabelText('Clear search');
      await user.click(clearButton);
      
      await user.type(input, 'second');

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('second');
      });
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirement 14.11 - search bar component with debounced input', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'search query');

      // Should not call immediately (debounced)
      expect(mockOnSearch).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('search query');
      });
    });

    it('should validate Requirement 14.11 - search icon and clear button functionality', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      const { container } = render(<SearchBar onSearch={mockOnSearch} />);

      // Verify search icon
      expect(container.querySelector('.bi-search')).toBeInTheDocument();

      // Type to show clear button
      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      // Verify clear button appears
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
      expect(container.querySelector('.bi-x-circle')).toBeInTheDocument();

      // Click clear button
      await user.click(clearButton);

      // Verify input is cleared
      expect(input).toHaveValue('');
      expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('should validate Requirement 17.2 - debounced input reduces unnecessary API calls', async () => {
      const mockOnSearch = vi.fn();
      const user = userEvent.setup({ delay: null });
      render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);

      const input = screen.getByRole('textbox');
      
      // Type multiple characters rapidly
      await user.type(input, 'test');
      
      // Should not have called onSearch yet
      expect(mockOnSearch).not.toHaveBeenCalled();
      
      // Wait for debounce
      vi.advanceTimersByTime(300);
      
      // Should only call once with final value
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('test');
      });
    });
  });
});
