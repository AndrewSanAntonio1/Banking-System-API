import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    pageSize: 25,
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render pagination component with all elements', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Current page number')).toBeInTheDocument();
      expect(screen.getByText('of 10')).toBeInTheDocument();
      expect(screen.getByLabelText('Select page size')).toBeInTheDocument();
    });

    it('should display correct current page and total pages', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={20} />);
      
      const pageInput = screen.getByLabelText('Current page number');
      expect(pageInput).toHaveValue(5);
      expect(screen.getByText('of 20')).toBeInTheDocument();
    });

    it('should display selected page size', () => {
      render(<Pagination {...defaultProps} pageSize={50} />);
      
      const select = screen.getByLabelText('Select page size');
      expect(select).toHaveValue('50');
    });
  });

  describe('Previous button', () => {
    it('should be disabled on first page', () => {
      render(<Pagination {...defaultProps} currentPage={1} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).toBeDisabled();
      expect(prevButton.closest('li')).toHaveClass('disabled');
    });

    it('should be enabled when not on first page', () => {
      render(<Pagination {...defaultProps} currentPage={2} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      expect(prevButton).not.toBeDisabled();
      expect(prevButton.closest('li')).not.toHaveClass('disabled');
    });

    it('should call onPageChange with previous page number when clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);
      
      expect(onPageChange).toHaveBeenCalledWith(4);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should not call onPageChange when disabled', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);
      
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Next button', () => {
    it('should be disabled on last page', () => {
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} />);
      
      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).toBeDisabled();
      expect(nextButton.closest('li')).toHaveClass('disabled');
    });

    it('should be enabled when not on last page', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);
      
      const nextButton = screen.getByLabelText('Next page');
      expect(nextButton).not.toBeDisabled();
      expect(nextButton.closest('li')).not.toHaveClass('disabled');
    });

    it('should call onPageChange with next page number when clicked', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);
      
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      
      expect(onPageChange).toHaveBeenCalledWith(6);
      expect(onPageChange).toHaveBeenCalledTimes(1);
    });

    it('should not call onPageChange when disabled', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={10} totalPages={10} onPageChange={onPageChange} />);
      
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('Page number input', () => {
    it('should display current page number', () => {
      render(<Pagination {...defaultProps} currentPage={7} />);
      
      const pageInput = screen.getByLabelText('Current page number');
      expect(pageInput).toHaveValue(7);
    });

    it('should call onPageChange with valid page number', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
      
      const pageInput = screen.getByLabelText('Current page number');
      fireEvent.change(pageInput, { target: { value: '5' } });
      
      expect(onPageChange).toHaveBeenCalledWith(5);
    });

    it('should not call onPageChange for invalid page numbers', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} onPageChange={onPageChange} />);
      
      const pageInput = screen.getByLabelText('Current page number');
      
      // Test page number too high
      fireEvent.change(pageInput, { target: { value: '15' } });
      expect(onPageChange).not.toHaveBeenCalled();
      
      // Test page number too low
      fireEvent.change(pageInput, { target: { value: '0' } });
      expect(onPageChange).not.toHaveBeenCalled();
      
      // Test negative number
      fireEvent.change(pageInput, { target: { value: '-1' } });
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should not call onPageChange for non-numeric input', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={5} onPageChange={onPageChange} />);
      
      const pageInput = screen.getByLabelText('Current page number');
      fireEvent.change(pageInput, { target: { value: 'abc' } });
      
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('should have correct min and max attributes', () => {
      render(<Pagination {...defaultProps} totalPages={20} />);
      
      const pageInput = screen.getByLabelText('Current page number');
      expect(pageInput).toHaveAttribute('min', '1');
      expect(pageInput).toHaveAttribute('max', '20');
    });
  });

  describe('Page size selector', () => {
    it('should render default page size options', () => {
      render(<Pagination {...defaultProps} />);
      
      const select = screen.getByLabelText('Select page size');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveValue('10');
      expect(options[1]).toHaveValue('25');
      expect(options[2]).toHaveValue('50');
      expect(options[3]).toHaveValue('100');
    });

    it('should render custom page size options', () => {
      render(<Pagination {...defaultProps} pageSizeOptions={[5, 15, 30]} />);
      
      const select = screen.getByLabelText('Select page size');
      const options = select.querySelectorAll('option');
      
      expect(options).toHaveLength(3);
      expect(options[0]).toHaveValue('5');
      expect(options[1]).toHaveValue('15');
      expect(options[2]).toHaveValue('30');
    });

    it('should display current page size as selected', () => {
      render(<Pagination {...defaultProps} pageSize={50} />);
      
      const select = screen.getByLabelText('Select page size');
      expect(select).toHaveValue('50');
    });

    it('should call onPageSizeChange when page size is changed', () => {
      const onPageSizeChange = vi.fn();
      render(<Pagination {...defaultProps} pageSize={25} onPageSizeChange={onPageSizeChange} />);
      
      const select = screen.getByLabelText('Select page size');
      fireEvent.change(select, { target: { value: '50' } });
      
      expect(onPageSizeChange).toHaveBeenCalledWith(50);
      expect(onPageSizeChange).toHaveBeenCalledTimes(1);
    });

    it('should render label for page size selector', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByText('Items per page:')).toBeInTheDocument();
    });
  });

  describe('Bootstrap classes', () => {
    it('should have correct Bootstrap pagination classes', () => {
      const { container } = render(<Pagination {...defaultProps} />);
      
      const pagination = container.querySelector('.pagination');
      expect(pagination).toBeInTheDocument();
      expect(pagination).toHaveClass('mb-0');
    });

    it('should have page-item and page-link classes', () => {
      render(<Pagination {...defaultProps} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      
      expect(prevButton).toHaveClass('page-link');
      expect(nextButton).toHaveClass('page-link');
      expect(prevButton.closest('li')).toHaveClass('page-item');
      expect(nextButton.closest('li')).toHaveClass('page-item');
    });

    it('should have form-select classes for page size selector', () => {
      render(<Pagination {...defaultProps} />);
      
      const select = screen.getByLabelText('Select page size');
      expect(select).toHaveClass('form-select', 'form-select-sm');
    });
  });

  describe('Accessibility', () => {
    it('should have navigation landmark', () => {
      const { container } = render(<Pagination {...defaultProps} />);
      
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Page navigation');
    });

    it('should have accessible labels for all interactive elements', () => {
      render(<Pagination {...defaultProps} />);
      
      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
      expect(screen.getByLabelText('Current page number')).toBeInTheDocument();
      expect(screen.getByLabelText('Select page size')).toBeInTheDocument();
    });

    it('should have proper disabled state accessibility', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Edge cases', () => {
    it('should handle single page scenario', () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      
      expect(prevButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should handle middle page scenario', () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={10} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
    });

    it('should handle navigation from page 2 to page 1', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={2} onPageChange={onPageChange} />);
      
      const prevButton = screen.getByLabelText('Previous page');
      fireEvent.click(prevButton);
      
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('should handle navigation from second-to-last to last page', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={9} totalPages={10} onPageChange={onPageChange} />);
      
      const nextButton = screen.getByLabelText('Next page');
      fireEvent.click(nextButton);
      
      expect(onPageChange).toHaveBeenCalledWith(10);
    });
  });

  describe('Requirements validation', () => {
    it('should validate Requirements 14.9 - pagination component with page navigation', () => {
      const onPageChange = vi.fn();
      render(<Pagination {...defaultProps} currentPage={3} totalPages={10} onPageChange={onPageChange} />);
      
      // Test page navigation controls
      const prevButton = screen.getByLabelText('Previous page');
      const nextButton = screen.getByLabelText('Next page');
      
      expect(prevButton).not.toBeDisabled();
      expect(nextButton).not.toBeDisabled();
      
      fireEvent.click(nextButton);
      expect(onPageChange).toHaveBeenCalledWith(4);
      
      fireEvent.click(prevButton);
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('should validate Requirements 14.9 - page size selection', () => {
      const onPageSizeChange = vi.fn();
      render(<Pagination {...defaultProps} onPageSizeChange={onPageSizeChange} />);
      
      const select = screen.getByLabelText('Select page size');
      const options = select.querySelectorAll('option');
      
      // Verify page size options (10, 25, 50, 100)
      expect(options).toHaveLength(4);
      expect(options[0]).toHaveValue('10');
      expect(options[1]).toHaveValue('25');
      expect(options[2]).toHaveValue('50');
      expect(options[3]).toHaveValue('100');
      
      // Test page size change
      fireEvent.change(select, { target: { value: '100' } });
      expect(onPageSizeChange).toHaveBeenCalledWith(100);
    });

    it('should validate all required props are used correctly', () => {
      const onPageChange = vi.fn();
      const onPageSizeChange = vi.fn();
      
      render(
        <Pagination
          currentPage={5}
          totalPages={20}
          pageSize={50}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      );
      
      // Verify currentPage is displayed
      const pageInput = screen.getByLabelText('Current page number');
      expect(pageInput).toHaveValue(5);
      
      // Verify totalPages is displayed
      expect(screen.getByText('of 20')).toBeInTheDocument();
      
      // Verify pageSize is selected
      const select = screen.getByLabelText('Select page size');
      expect(select).toHaveValue('50');
      
      // Verify onPageChange is called
      fireEvent.click(screen.getByLabelText('Next page'));
      expect(onPageChange).toHaveBeenCalled();
      
      // Verify onPageSizeChange is called
      fireEvent.change(select, { target: { value: '100' } });
      expect(onPageSizeChange).toHaveBeenCalled();
    });
  });

  describe('Layout responsiveness', () => {
    it('should have responsive flex classes', () => {
      const { container } = render(<Pagination {...defaultProps} />);
      
      const wrapper = container.querySelector('.d-flex');
      expect(wrapper).toHaveClass('flex-column', 'flex-md-row', 'justify-content-between', 'align-items-center');
    });

    it('should have gap spacing between elements', () => {
      const { container } = render(<Pagination {...defaultProps} />);
      
      const wrapper = container.querySelector('.d-flex');
      expect(wrapper).toHaveClass('gap-3');
    });
  });
});
