import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * SearchBar Component
 * 
 * Reusable search bar component with debounced input handling.
 * Includes search icon and clear button functionality.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback function triggered with debounced search value
 * @param {string} [props.placeholder='Search...'] - Placeholder text for the input
 * @param {number} [props.debounceMs=300] - Debounce delay in milliseconds
 * @param {string} [props.initialValue=''] - Initial search value
 * @param {string} [props.className=''] - Additional CSS classes for the container
 * @param {boolean} [props.disabled=false] - Whether the search bar is disabled
 * 
 * Validates: Requirements 14.11, 17.2
 */
const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  initialValue = '',
  className = '',
  disabled = false
}) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue, debounceMs, onSearch]);

  // Handle input change
  const handleChange = useCallback((e) => {
    setSearchValue(e.target.value);
  }, []);

  // Handle clear button click
  const handleClear = useCallback(() => {
    setSearchValue('');
  }, []);

  return (
    <div className={`position-relative ${className}`}>
      <div className="input-group">
        <span className="input-group-text bg-white">
          <i className="bi bi-search" aria-hidden="true"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
          disabled={disabled}
          aria-label="Search"
        />
        {searchValue && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
            title="Clear search"
          >
            <i className="bi bi-x-circle" aria-hidden="true"></i>
          </button>
        )}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
  initialValue: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default SearchBar;
