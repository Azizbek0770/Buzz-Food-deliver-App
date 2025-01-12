import React from 'react';
import PropTypes from 'prop-types';
import './Form.css';

export const FormGroup = ({ children, className = '', error }) => {
  return (
    <div className={`form-group ${className} ${error ? 'form-group--error' : ''}`}>
      {children}
      {error && <span className="form-group__error">{error}</span>}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  error: PropTypes.string,
};

export const FormLabel = ({ children, htmlFor, required, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`form-label ${className}`}>
      {children}
      {required && <span className="form-label__required">*</span>}
    </label>
  );
};

FormLabel.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export const FormInput = React.forwardRef(({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
      {...props}
    />
  );
});

FormInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

FormInput.displayName = 'FormInput';

export const FormTextarea = React.forwardRef(({
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`form-textarea ${error ? 'form-textarea--error' : ''} ${className}`}
      {...props}
    />
  );
});

FormTextarea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
};

FormTextarea.displayName = 'FormTextarea';

export const FormSelect = React.forwardRef(({
  options,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  placeholder,
  className = '',
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`form-select ${error ? 'form-select--error' : ''} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

FormSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

FormSelect.displayName = 'FormSelect';

export const FormCheckbox = React.forwardRef(({
  label,
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`form-checkbox ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={error ? 'form-checkbox__input--error' : ''}
        {...props}
      />
      <span className="form-checkbox__label">{label}</span>
    </label>
  );
});

FormCheckbox.propTypes = {
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

FormCheckbox.displayName = 'FormCheckbox'; 