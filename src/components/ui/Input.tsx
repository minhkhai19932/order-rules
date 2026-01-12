import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Input component props.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Reusable input component with orange brand theme.
 * Includes optional label and error message with accessible focus states.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles =
      'block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const errorStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : '';

    const combinedClassName = `${baseStyles} ${errorStyles} ${className}`.trim();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={combinedClassName}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

