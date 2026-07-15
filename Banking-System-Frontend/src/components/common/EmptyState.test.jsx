import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from './EmptyState';

describe('EmptyState Component', () => {
  describe('Rendering', () => {
    it('should render with required props only', () => {
      render(<EmptyState title="No Data" message="There is no data to display" />);
      
      expect(screen.getByText('No Data')).toBeInTheDocument();
      expect(screen.getByText('There is no data to display')).toBeInTheDocument();
    });

    it('should render title as h4 heading', () => {
      render(<EmptyState title="Empty List" message="No items found" />);
      
      const title = screen.getByText('Empty List');
      expect(title.tagName).toBe('H4');
      expect(title).toHaveClass('text-muted');
    });

    it('should render message paragraph', () => {
      render(<EmptyState title="No Results" message="Try adjusting your filters" />);
      
      const message = screen.getByText('Try adjusting your filters');
      expect(message.tagName).toBe('P');
      expect(message).toHaveClass('text-muted');
    });
  });

  describe('Icon rendering', () => {
    it('should render icon when provided', () => {
      const { container } = render(
        <EmptyState icon="inbox" title="Empty Inbox" message="No messages" />
      );
      
      const icon = container.querySelector('.bi-inbox');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-muted');
    });

    it('should not render icon when not provided', () => {
      const { container } = render(
        <EmptyState title="No Data" message="No data available" />
      );
      
      const icon = container.querySelector('i');
      expect(icon).not.toBeInTheDocument();
    });

    it('should render different icon types', () => {
      const icons = ['inbox', 'search', 'folder', 'file-earmark', 'people'];
      
      icons.forEach((iconName) => {
        const { container, unmount } = render(
          <EmptyState icon={iconName} title="Test" message="Test message" />
        );
        
        const icon = container.querySelector(`.bi-${iconName}`);
        expect(icon).toBeInTheDocument();
        
        unmount();
      });
    });

    it('should apply large font size to icon', () => {
      const { container } = render(
        <EmptyState icon="inbox" title="Empty" message="Nothing here" />
      );
      
      const icon = container.querySelector('i');
      expect(icon).toHaveStyle({ fontSize: '4rem' });
    });
  });

  describe('Action button', () => {
    it('should not render action button when actionLabel is not provided', () => {
      render(<EmptyState title="Empty" message="No data" />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not render action button when onAction is not provided', () => {
      render(<EmptyState title="Empty" message="No data" actionLabel="Add Item" />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render action button when both actionLabel and onAction are provided', () => {
      const mockAction = vi.fn();
      render(
        <EmptyState
          title="Empty List"
          message="No items"
          actionLabel="Add New Item"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Add New Item' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('should call onAction when button is clicked', async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();
      
      render(
        <EmptyState
          title="Empty"
          message="No data"
          actionLabel="Create"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Create' });
      await user.click(button);
      
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('should call onAction multiple times on multiple clicks', async () => {
      const user = userEvent.setup();
      const mockAction = vi.fn();
      
      render(
        <EmptyState
          title="Empty"
          message="No data"
          actionLabel="Add"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Add' });
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockAction).toHaveBeenCalledTimes(3);
    });
  });

  describe('Layout and styling', () => {
    it('should center content with flexbox', () => {
      const { container } = render(
        <EmptyState title="Empty" message="No data" />
      );
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(
        'd-flex',
        'flex-column',
        'align-items-center',
        'justify-content-center',
        'text-center'
      );
    });

    it('should apply padding to container', () => {
      const { container } = render(
        <EmptyState title="Empty" message="No data" />
      );
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('py-5', 'px-3');
    });

    it('should limit message width for readability', () => {
      render(<EmptyState title="Empty" message="Long message here" />);
      
      const message = screen.getByText('Long message here');
      expect(message).toHaveStyle({ maxWidth: '400px' });
    });
  });

  describe('Complete component with all props', () => {
    it('should render all elements when all props are provided', () => {
      const mockAction = vi.fn();
      const { container } = render(
        <EmptyState
          icon="inbox"
          title="No Messages"
          message="Your inbox is empty. Start by sending a message."
          actionLabel="New Message"
          onAction={mockAction}
        />
      );
      
      // Check icon
      expect(container.querySelector('.bi-inbox')).toBeInTheDocument();
      
      // Check title
      expect(screen.getByText('No Messages')).toBeInTheDocument();
      
      // Check message
      expect(screen.getByText('Your inbox is empty. Start by sending a message.')).toBeInTheDocument();
      
      // Check button
      expect(screen.getByRole('button', { name: 'New Message' })).toBeInTheDocument();
    });
  });

  describe('Different use cases', () => {
    it('should render empty transaction list state', () => {
      const mockAction = vi.fn();
      render(
        <EmptyState
          icon="receipt"
          title="No Transactions"
          message="You haven't made any transactions yet."
          actionLabel="Make a Transaction"
          onAction={mockAction}
        />
      );
      
      expect(screen.getByText('No Transactions')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Make a Transaction' })).toBeInTheDocument();
    });

    it('should render empty search results state', () => {
      render(
        <EmptyState
          icon="search"
          title="No Results Found"
          message="Try adjusting your search criteria or filters."
        />
      );
      
      expect(screen.getByText('No Results Found')).toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render empty beneficiary list state', () => {
      const mockAction = vi.fn();
      render(
        <EmptyState
          icon="people"
          title="No Beneficiaries"
          message="Add beneficiaries to make transfers easier."
          actionLabel="Add Beneficiary"
          onAction={mockAction}
        />
      );
      
      expect(screen.getByText('No Beneficiaries')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add Beneficiary' })).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle very long titles', () => {
      const longTitle = 'This is a very long title that might wrap to multiple lines in the UI';
      render(<EmptyState title={longTitle} message="Message" />);
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(300);
      render(<EmptyState title="Title" message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should handle special characters in text', () => {
      const titleText = 'No Data: <>&"\'';
      const messageText = 'Special chars: <>&"\'';
      
      render(
        <EmptyState
          title={titleText}
          message={messageText}
        />
      );
      
      expect(screen.getByText(titleText)).toBeInTheDocument();
      expect(screen.getByText(messageText)).toBeInTheDocument();
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.7 - empty state component with icon, title, message, and action', () => {
      const mockAction = vi.fn();
      const { container } = render(
        <EmptyState
          icon="inbox"
          title="Empty State"
          message="No data available"
          actionLabel="Take Action"
          onAction={mockAction}
        />
      );
      
      // Verify all required elements
      expect(container.querySelector('.bi-inbox')).toBeInTheDocument();
      expect(screen.getByText('Empty State')).toBeInTheDocument();
      expect(screen.getByText('No data available')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Take Action' })).toBeInTheDocument();
    });

    it('should validate Requirements 19.3 - display empty state when data fetch returns empty result', () => {
      // Simulate empty data fetch result
      render(
        <EmptyState
          icon="folder"
          title="No Records Found"
          message="The system returned no results for your query."
        />
      );
      
      expect(screen.getByText('No Records Found')).toBeInTheDocument();
      expect(screen.getByText('The system returned no results for your query.')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<EmptyState title="Empty" message="No data" />);
      
      const heading = screen.getByRole('heading', { level: 4 });
      expect(heading).toHaveTextContent('Empty');
    });

    it('should have accessible button when action is provided', () => {
      const mockAction = vi.fn();
      render(
        <EmptyState
          title="Empty"
          message="No data"
          actionLabel="Add Item"
          onAction={mockAction}
        />
      );
      
      const button = screen.getByRole('button', { name: 'Add Item' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
