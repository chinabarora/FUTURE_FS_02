import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 transition-opacity"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={onClose}
        />

        <div
          className={`relative w-full ${sizeClasses[size]} rounded-2xl border shadow-2xl transform transition-all animate-bounce-in`}
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            borderColor: 'var(--theme-border)'
          }}
        >
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--theme-border)' }}>
            <h2 className="text-xl font-semibold" style={{ color: 'var(--theme-text)' }}>{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--theme-text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
