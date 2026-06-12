import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-200 ${className}`}
          style={{
            backgroundColor: 'var(--theme-bg-tertiary)',
            border: `1px solid ${error ? '#ef4444' : 'var(--theme-border)'}`,
            color: 'var(--theme-text)',
          }}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
