import { Menu, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { profile } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-xl border-b"
      style={{
        backgroundColor: 'var(--theme-bg)',
        borderColor: 'var(--theme-border)'
      }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl w-64 lg:w-96"
            style={{
              backgroundColor: 'var(--theme-bg-secondary)',
              border: '1px solid var(--theme-border)'
            }}
          >
            <Search className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
            <input
              type="text"
              placeholder="Search leads..."
              className="flex-1 bg-transparent text-sm placeholder-current focus:outline-none"
              style={{ color: 'var(--theme-text)' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            <Settings className="w-5 h-5" />
          </button>

          <div
            className="hidden sm:flex items-center gap-3 pl-4 ml-2"
            style={{ borderLeft: '1px solid var(--theme-border)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))'
              }}
            >
              {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{profile?.full_name || 'User'}</p>
              <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
