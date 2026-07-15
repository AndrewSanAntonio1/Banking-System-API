import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('Rendering', () => {
    it('should render spinner with default props', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('spinner-border');
      expect(spinner).toHaveClass('text-primary');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render spinner with small size', () => {
      render(<LoadingSpinner size="sm" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-border-sm');
    });

    it('should render spinner with medium size (default)', () => {
      render(<LoadingSpinner size="md" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).not.toHaveClass('spinner-border-sm');
    });

    it('should render spinner with large size', () => {
      render(<LoadingSpinner size="lg" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveStyle({ width: '3rem', height: '3rem' });
    });
  });

  describe('Color variants', () => {
    const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

    colors.forEach((color) => {
      it(`should render spinner with ${color} color`, () => {
        render(<LoadingSpinner color={color} />);
        
        const spinner = screen.getByRole('status');
        expect(spinner).toHaveClass(`text-${color}`);
      });
    });
  });

  describe('Full screen mode', () => {
    it('should render in full screen overlay when fullScreen is true', () => {
      const { container } = render(<LoadingSpinner fullScreen={true} />);
      
      const overlay = container.querySelector('.position-fixed');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('top-0', 'start-0', 'w-100', 'h-100');
      expect(overlay).toHaveStyle({ zIndex: '9999' });
    });

    it('should not render overlay when fullScreen is false', () => {
      const { container } = render(<LoadingSpinner fullScreen={false} />);
      
      const overlay = container.querySelector('.position-fixed');
      expect(overlay).not.toBeInTheDocument();
    });

    it('should render centered spinner when not in fullScreen mode', () => {
      const { container } = render(<LoadingSpinner />);
      
      const wrapper = container.querySelector('.d-flex');
      expect(wrapper).toHaveClass('justify-content-center', 'align-items-center', 'p-3');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<LoadingSpinner />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have visually hidden loading text', () => {
      render(<LoadingSpinner />);
      
      const loadingText = screen.getByText('Loading...');
      expect(loadingText).toHaveClass('visually-hidden');
    });
  });

  describe('Combined props', () => {
    it('should render with all custom props', () => {
      const { container } = render(
        <LoadingSpinner size="lg" color="success" fullScreen={true} />
      );
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-success');
      expect(spinner).toHaveStyle({ width: '3rem', height: '3rem' });
      
      const overlay = container.querySelector('.position-fixed');
      expect(overlay).toBeInTheDocument();
    });

    it('should render small spinner in fullScreen mode', () => {
      const { container } = render(
        <LoadingSpinner size="sm" fullScreen={true} />
      );
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-border-sm');
      
      const overlay = container.querySelector('.position-fixed');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.5 - loading spinner component with variants', () => {
      // Test different variants for loading states
      const { rerender } = render(<LoadingSpinner size="sm" color="primary" />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      rerender(<LoadingSpinner size="lg" color="danger" fullScreen={true} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should validate Requirements 19.1 - display loading spinner during data fetch', () => {
      // Simulate data fetching state
      render(<LoadingSpinner color="primary" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('spinner-border', 'text-primary');
    });
  });
});
