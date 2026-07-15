import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from './StatusBadge';

describe('StatusBadge Component', () => {
  describe('Status variants - color mapping', () => {
    it('should render Active status with green badge (bg-success)', () => {
      render(<StatusBadge status="active" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('badge', 'bg-success');
      expect(badge).toHaveTextContent('Active');
    });

    it('should render Inactive status with gray badge (bg-secondary)', () => {
      render(<StatusBadge status="inactive" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-secondary');
      expect(badge).toHaveTextContent('Inactive');
    });

    it('should render Pending status with yellow badge (bg-warning)', () => {
      render(<StatusBadge status="pending" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-warning');
      expect(badge).toHaveTextContent('Pending');
    });

    it('should render Frozen status with blue badge (bg-info)', () => {
      render(<StatusBadge status="frozen" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-info');
      expect(badge).toHaveTextContent('Frozen');
    });

    it('should render Closed status with red badge (bg-danger)', () => {
      render(<StatusBadge status="closed" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-danger');
      expect(badge).toHaveTextContent('Closed');
    });

    it('should render Completed status with green badge (bg-success)', () => {
      render(<StatusBadge status="completed" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-success');
      expect(badge).toHaveTextContent('Completed');
    });

    it('should render Failed status with red badge (bg-danger)', () => {
      render(<StatusBadge status="failed" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-danger');
      expect(badge).toHaveTextContent('Failed');
    });
  });

  describe('Case insensitivity', () => {
    it('should handle uppercase status values', () => {
      render(<StatusBadge status="ACTIVE" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-success');
      expect(badge).toHaveTextContent('Active');
    });

    it('should handle mixed case status values', () => {
      render(<StatusBadge status="Pending" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-warning');
      expect(badge).toHaveTextContent('Pending');
    });

    it('should handle lowercase status values', () => {
      render(<StatusBadge status="frozen" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('bg-info');
      expect(badge).toHaveTextContent('Frozen');
    });
  });

  describe('Custom label support', () => {
    it('should display custom label when provided', () => {
      render(<StatusBadge status="active" label="Running" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('Running');
      expect(badge).toHaveClass('bg-success');
    });

    it('should use default label when custom label not provided', () => {
      render(<StatusBadge status="pending" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('Pending');
    });

    it('should display custom label for completed status', () => {
      render(<StatusBadge status="completed" label="Done" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('Done');
    });
  });

  describe('Unknown status handling', () => {
    it('should default to secondary badge for unknown status', () => {
      render(<StatusBadge status="unknown" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveClass('badge', 'bg-secondary');
      expect(badge).toHaveTextContent('unknown');
    });

    it('should display unknown status text as-is', () => {
      render(<StatusBadge status="processing" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveTextContent('processing');
      expect(badge).toHaveClass('bg-secondary');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<StatusBadge status="active" />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have aria-label with status information', () => {
      render(<StatusBadge status="active" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Status: Active');
    });

    it('should have aria-label with custom label', () => {
      render(<StatusBadge status="active" label="Running" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toHaveAttribute('aria-label', 'Status: Running');
    });
  });

  describe('Bootstrap classes', () => {
    it('should always include badge class', () => {
      const statuses = ['active', 'inactive', 'pending', 'frozen', 'closed', 'completed', 'failed'];
      
      statuses.forEach((status) => {
        const { unmount } = render(<StatusBadge status={status} />);
        const badge = screen.getByRole('status');
        expect(badge).toHaveClass('badge');
        unmount();
      });
    });

    it('should render as span element', () => {
      render(<StatusBadge status="active" />);
      
      const badge = screen.getByRole('status');
      expect(badge.tagName).toBe('SPAN');
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.10 - status badge with color coding', () => {
      // Test color-coded status variants
      const { rerender } = render(<StatusBadge status="active" />);
      expect(screen.getByRole('status')).toHaveClass('bg-success');

      rerender(<StatusBadge status="pending" />);
      expect(screen.getByRole('status')).toHaveClass('bg-warning');

      rerender(<StatusBadge status="failed" />);
      expect(screen.getByRole('status')).toHaveClass('bg-danger');
    });

    it('should validate all required status types are supported', () => {
      const requiredStatuses = [
        { status: 'active', expectedClass: 'bg-success' },
        { status: 'inactive', expectedClass: 'bg-secondary' },
        { status: 'pending', expectedClass: 'bg-warning' },
        { status: 'frozen', expectedClass: 'bg-info' },
        { status: 'closed', expectedClass: 'bg-danger' },
        { status: 'completed', expectedClass: 'bg-success' },
        { status: 'failed', expectedClass: 'bg-danger' },
      ];

      requiredStatuses.forEach(({ status, expectedClass }) => {
        const { unmount } = render(<StatusBadge status={status} />);
        const badge = screen.getByRole('status');
        expect(badge).toHaveClass(expectedClass);
        unmount();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string status', () => {
      render(<StatusBadge status="" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-secondary');
    });

    it('should handle status with spaces', () => {
      render(<StatusBadge status="  active  " />);
      
      const badge = screen.getByRole('status');
      // toLowerCase with trim would normalize this
      expect(badge).toBeInTheDocument();
    });

    it('should handle empty custom label by falling back to default', () => {
      render(<StatusBadge status="active" label="" />);
      
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      // Empty label falls back to default label logic (label || default)
      // Since empty string is falsy, it uses default
      expect(badge).toHaveTextContent('Active');
    });
  });
});
