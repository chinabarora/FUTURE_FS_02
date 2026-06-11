import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-200 resize-none ${className}`}
          style={{
            backgroundColor: 'var(--theme-bg-tertiary)',
            border: `1px solid ${error ? '#ef4444' : 'var(--theme-border)'}`,
            color: 'var(--theme-text)',
          }}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
