import { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(to right, var(--accent-primary), var(--accent-primary-dark))',
          boxShadow: '0 4px 15px var(--accent-glow)',
          color: 'white',
          focusRing: 'var(--accent-primary)',
          focusOffset: 'var(--theme-bg-secondary)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--theme-bg-tertiary)',
          border: '1px solid var(--theme-border)',
          color: 'var(--theme-text)',
          focusRing: 'var(--theme-border-secondary)',
          focusOffset: 'var(--theme-bg)'
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          focusRing: '#ef4444',
          focusOffset: 'var(--theme-bg)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--theme-text-muted)',
          focusRing: 'var(--accent-primary)',
          focusOffset: 'var(--theme-bg)'
        };
      default:
        return {};
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      style={{
        ...styles
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
