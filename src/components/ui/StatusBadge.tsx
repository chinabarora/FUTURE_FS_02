import { LeadStatus } from '../../types';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusStyles: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  new: {
    bg: 'rgba(59, 130, 246, 0.1)',
    text: '#3B82F6',
    dot: '#3B82F6',
  },
  contacted: {
    bg: 'rgba(245, 158, 11, 0.1)',
    text: '#F59E0B',
    dot: '#F59E0B',
  },
  converted: {
    bg: 'rgba(16, 185, 129, 0.1)',
    text: '#10B981',
    dot: '#10B981',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeStyles[size]}`}
      style={{
        backgroundColor: styles.bg,
        borderColor: `${styles.text}40`,
        color: styles.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: styles.dot }}
      />
      <span className="capitalize">{status}</span>
    </span>
  );
}
