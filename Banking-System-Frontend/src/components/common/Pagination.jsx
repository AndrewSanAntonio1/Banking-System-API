import PropTypes from 'prop-types';

/**
 * Pagination Component
 * 
 * Provides page navigation controls with Bootstrap styling
 * Features:
 * - Previous/Next buttons with disabled states
 * - Current page / total pages display
 * - Page size selector dropdown
 * - Page number input for direct navigation
 * 
 * @component
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   pageSize={25}
 *   onPageChange={(page) => console.log(page)}
 *   onPageSizeChange={(size) => console.log(size)}
 * />
 */
const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };

  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
      {/* Page size selector */}
      <div className="d-flex align-items-center gap-2">
        <label htmlFor="pageSize" className="mb-0 text-nowrap">
          Items per page:
        </label>
        <select
          id="pageSize"
          className="form-select form-select-sm"
          style={{ width: 'auto' }}
          value={pageSize}
          onChange={handlePageSizeChange}
          aria-label="Select page size"
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination mb-0">
          {/* Previous button */}
          <li className={`page-item ${isFirstPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={handlePrevious}
              disabled={isFirstPage}
              aria-label="Previous page"
            >
              Previous
            </button>
          </li>

          {/* Page number display and input */}
          <li className="page-item">
            <div className="page-link d-flex align-items-center gap-2">
              <span className="text-nowrap">Page</span>
              <input
                type="number"
                className="form-control form-control-sm"
                style={{ width: '60px' }}
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={handlePageInput}
                aria-label="Current page number"
              />
              <span className="text-nowrap">of {totalPages}</span>
            </div>
          </li>

          {/* Next button */}
          <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={handleNext}
              disabled={isLastPage}
              aria-label="Next page"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
};

export default Pagination;
