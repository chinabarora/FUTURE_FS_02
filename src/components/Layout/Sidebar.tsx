import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  User,
  LogOut,
  X,
  Building2,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { signOut, profile } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: 'var(--theme-bg-secondary)',
          borderColor: 'var(--theme-border)'
        }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b" style={{ borderColor: 'var(--theme-border)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))',
                    boxShadow: `0 4px 15px var(--accent-glow)`
                  }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>CRM Pro</h1>
                  <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Enterprise Edition</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg transition-colors"
                style={{ color: 'var(--theme-text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? '' : ''
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'var(--accent-primary-light)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--theme-text-muted)'
                })}
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t" style={{ borderColor: 'var(--theme-border)' }}>
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ backgroundColor: 'var(--theme-bg-tertiary)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-primary-dark))'
                }}
              >
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--theme-text)' }}>
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--theme-text-muted)' }}>Administrator</p>
              </div>
              <button
                onClick={signOut}
                className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: 'var(--theme-text-muted)' }}
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
