import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';

/**
 * FormField Component
 * 
 * Reusable form field component with React Hook Form integration.
 * Supports validation, error display, and Bootstrap styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for React Hook Form registration
 * @param {string} props.label - Label text for the field
 * @param {string} [props.type='text'] - Input type (text, email, password, number, etc.)
 * @param {Object} [props.validation={}] - React Hook Form validation rules
 * @param {string} [props.placeholder=''] - Placeholder text
 * @param {boolean} [props.disabled=false] - Whether the field is disabled
 * @param {string} [props.helpText=''] - Optional help text displayed below the field
 * @param {string} [props.className=''] - Additional CSS classes for the input
 * 
 * Validates: Requirements 14.2, 14.11, 17.2, 17.9
 */
const FormField = ({
  name,
  label,
  type = 'text',
  validation = {},
  placeholder = '',
  disabled = false,
  helpText = '',
  className = '',
  ...rest
}) => {
  const { register, formState: { errors }, control } = useFormContext();
  
  const error = errors[name];
  const hasError = !!error;

  // For most input types, use register directly
  if (type !== 'textarea' && type !== 'select') {
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {validation.required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        
        <input
          id={name}
          type={type}
          className={`form-control ${hasError ? 'is-invalid' : ''} ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name, validation)}
          {...rest}
        />
        
        {hasError && (
          <div className="invalid-feedback d-block">
            {error.message}
          </div>
        )}
        
        {helpText && !hasError && (
          <div className="form-text">{helpText}</div>
        )}
      </div>
    );
  }

  // For textarea
  if (type === 'textarea') {
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {validation.required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        
        <textarea
          id={name}
          className={`form-control ${hasError ? 'is-invalid' : ''} ${className}`}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name, validation)}
          {...rest}
        />
        
        {hasError && (
          <div className="invalid-feedback d-block">
            {error.message}
          </div>
        )}
        
        {helpText && !hasError && (
          <div className="form-text">{helpText}</div>
        )}
      </div>
    );
  }

  // For select elements using Controller for better control
  if (type === 'select') {
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {validation.required && <span className="text-danger ms-1">*</span>}
          </label>
        )}
        
        <Controller
          name={name}
          control={control}
          rules={validation}
          render={({ field }) => (
            <select
              {...field}
              id={name}
              className={`form-select ${hasError ? 'is-invalid' : ''} ${className}`}
              disabled={disabled}
              {...rest}
            >
              {rest.children}
            </select>
          )}
        />
        
        {hasError && (
          <div className="invalid-feedback d-block">
            {error.message}
          </div>
        )}
        
        {helpText && !hasError && (
          <div className="form-text">{helpText}</div>
        )}
      </div>
    );
  }

  return null;
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  helpText: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
};

export default FormField;
