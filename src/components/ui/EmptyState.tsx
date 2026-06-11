import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{
          backgroundColor: 'var(--theme-bg-secondary)',
          border: '1px solid var(--theme-border)'
        }}
      >
        <Icon className="w-10 h-10" style={{ color: 'var(--theme-text-muted)' }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>{title}</h3>
      <p className="max-w-md mb-6" style={{ color: 'var(--theme-text-muted)' }}>{description}</p>
      {action}
    </div>
  );
}
