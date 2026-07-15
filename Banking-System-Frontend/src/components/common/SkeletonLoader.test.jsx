import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SkeletonLoader from './SkeletonLoader';

describe('SkeletonLoader Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(1);
    });

    it('should render multiple skeleton elements based on count prop', () => {
      const { container } = render(<SkeletonLoader count={5} />);
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(5);
    });

    it('should render single skeleton when count is 1', () => {
      const { container } = render(<SkeletonLoader count={1} />);
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(1);
    });

    it('should render no skeletons when count is 0', () => {
      const { container } = render(<SkeletonLoader count={0} />);
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(0);
    });
  });

  describe('Size customization', () => {
    it('should apply custom height', () => {
      const { container } = render(<SkeletonLoader height="50px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ height: '50px' });
    });

    it('should apply custom width', () => {
      const { container } = render(<SkeletonLoader width="200px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ width: '200px' });
    });

    it('should apply default height of 20px', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ height: '20px' });
    });

    it('should apply default width of 100%', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ width: '100%' });
    });

    it('should apply both custom height and width', () => {
      const { container } = render(<SkeletonLoader height="30px" width="150px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ height: '30px', width: '150px' });
    });
  });

  describe('Variant types', () => {
    it('should render text variant with default border radius', () => {
      const { container } = render(<SkeletonLoader variant="text" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ borderRadius: '4px' });
    });

    it('should render rectangular variant with border radius', () => {
      const { container } = render(<SkeletonLoader variant="rectangular" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ borderRadius: '4px' });
    });

    it('should render circular variant with 50% border radius', () => {
      const { container } = render(<SkeletonLoader variant="circular" height="40px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ borderRadius: '50%' });
    });

    it('should make circular variant width equal to height', () => {
      const { container } = render(<SkeletonLoader variant="circular" height="60px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ width: '60px', height: '60px' });
    });
  });

  describe('Styling and animations', () => {
    it('should have shimmer animation', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ animation: 'shimmer 1.5s infinite' });
    });

    it('should have gradient background', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({
        backgroundImage: 'linear-gradient(90deg, #e0e0e0 0px, #f0f0f0 40px, #e0e0e0 80px)'
      });
    });

    it('should have base background color', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ backgroundColor: '#e0e0e0' });
    });

    it('should have margin bottom for spacing', () => {
      const { container } = render(<SkeletonLoader />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ marginBottom: '0.5rem' });
    });

    it('should include shimmer keyframes in style tag', () => {
      const { container } = render(<SkeletonLoader />);
      
      const styleTag = container.querySelector('style');
      expect(styleTag).toBeInTheDocument();
      expect(styleTag.textContent).toContain('@keyframes shimmer');
      expect(styleTag.textContent).toContain('background-position');
    });
  });

  describe('Multiple skeletons with different props', () => {
    it('should render multiple skeletons with same styling', () => {
      const { container } = render(
        <SkeletonLoader count={3} height="25px" width="80%" variant="rectangular" />
      );
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(3);
      
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveStyle({
          height: '25px',
          width: '80%',
          borderRadius: '4px'
        });
      });
    });

    it('should render multiple circular skeletons', () => {
      const { container } = render(
        <SkeletonLoader count={4} height="50px" variant="circular" />
      );
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(4);
      
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveStyle({
          borderRadius: '50%',
          width: '50px',
          height: '50px'
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle very small height', () => {
      const { container } = render(<SkeletonLoader height="2px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ height: '2px' });
    });

    it('should handle very large height', () => {
      const { container } = render(<SkeletonLoader height="500px" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ height: '500px' });
    });

    it('should handle percentage-based width', () => {
      const { container } = render(<SkeletonLoader width="50%" />);
      
      const skeleton = container.querySelector('.skeleton-loader');
      expect(skeleton).toHaveStyle({ width: '50%' });
    });

    it('should handle large count', () => {
      const { container } = render(<SkeletonLoader count={20} />);
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(20);
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.6 - skeleton loader component with variants', () => {
      // Test different skeleton loader variants
      const { rerender, container } = render(
        <SkeletonLoader count={3} variant="text" height="20px" />
      );
      
      let skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(3);

      rerender(<SkeletonLoader count={1} variant="circular" height="60px" />);
      skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(1);
      expect(skeletons[0]).toHaveStyle({ borderRadius: '50%' });
    });

    it('should validate Requirements 19.2 - display skeleton loaders during initial page load', () => {
      // Simulate initial page loading state with multiple content sections
      const { container } = render(
        <>
          <SkeletonLoader count={1} height="40px" width="200px" variant="rectangular" />
          <SkeletonLoader count={3} height="20px" variant="text" />
          <SkeletonLoader count={1} height="100px" variant="rectangular" />
        </>
      );
      
      const skeletons = container.querySelectorAll('.skeleton-loader');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Container structure', () => {
    it('should wrap skeletons in a container', () => {
      const { container } = render(<SkeletonLoader count={2} />);
      
      const skeletonContainer = container.querySelector('.skeleton-loader-container');
      expect(skeletonContainer).toBeInTheDocument();
    });

    it('should have all skeletons inside container', () => {
      const { container } = render(<SkeletonLoader count={3} />);
      
      const skeletonContainer = container.querySelector('.skeleton-loader-container');
      const skeletons = skeletonContainer.querySelectorAll('.skeleton-loader');
      expect(skeletons).toHaveLength(3);
    });
  });
});
