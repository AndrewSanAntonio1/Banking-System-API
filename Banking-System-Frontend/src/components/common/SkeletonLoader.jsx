import PropTypes from 'prop-types';

/**
 * SkeletonLoader Component
 * 
 * Displays placeholder loading UI that mimics the shape of content being loaded.
 * 
 * @param {Object} props - Component props
 * @param {number} [props.count=1] - Number of skeleton elements to render
 * @param {string} [props.height='20px'] - Height of each skeleton element
 * @param {string} [props.width='100%'] - Width of each skeleton element
 * @param {string} [props.variant='text'] - Variant type: 'text', 'rectangular', 'circular'
 * 
 * Validates: Requirements 14.6, 19.2
 */
const SkeletonLoader = ({ count = 1, height = '20px', width = '100%', variant = 'text' }) => {
  // Define styles based on variant
  const getSkeletonStyle = () => {
    const baseStyle = {
      height,
      width,
      backgroundColor: '#e0e0e0',
      backgroundImage: 'linear-gradient(90deg, #e0e0e0 0px, #f0f0f0 40px, #e0e0e0 80px)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      marginBottom: '0.5rem'
    };

    switch (variant) {
      case 'circular':
        return {
          ...baseStyle,
          borderRadius: '50%',
          width: height // Make width equal to height for perfect circle
        };
      case 'rectangular':
        return {
          ...baseStyle,
          borderRadius: '4px'
        };
      case 'text':
      default:
        return {
          ...baseStyle,
          borderRadius: '4px'
        };
    }
  };

  const skeletonStyle = getSkeletonStyle();

  // Create array of skeleton elements
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} style={skeletonStyle} className="skeleton-loader" />
  ));

  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <div className="skeleton-loader-container">
        {skeletons}
      </div>
    </>
  );
};

SkeletonLoader.propTypes = {
  count: PropTypes.number,
  height: PropTypes.string,
  width: PropTypes.string,
  variant: PropTypes.oneOf(['text', 'rectangular', 'circular'])
};

export default SkeletonLoader;
