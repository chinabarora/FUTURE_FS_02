import { LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  gradient?: string;
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon }: StatCardProps) {
  const { accentConfig } = useTheme();

  const changeColors = {
    positive: '#10b981',
    negative: '#ef4444',
    neutral: 'var(--theme-text-muted)',
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
      style={{
        backgroundColor: 'var(--theme-bg-secondary)',
        border: '1px solid var(--theme-border)',
      }}
    >
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${accentConfig.primary}, ${accentConfig.primaryDark})` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--theme-text-muted)' }}>{title}</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>{value}</p>
          {change && (
            <p className="text-sm mt-2" style={{ color: changeColors[changeType] }}>
              {change}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${accentConfig.primary}, ${accentConfig.primaryDark})`,
            boxShadow: `0 4px 15px ${accentConfig.glow}`
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
