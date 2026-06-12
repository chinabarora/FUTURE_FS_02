import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES, ACCENT_COLORS, ThemeName, AccentColor } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Button, Input } from '../components/ui';
import { User, Lock, Bell, Moon, Save, CheckCircle } from 'lucide-react';

export function SettingsPage() {
  const { profile, updateProfile } = useAuth();
  const { theme, accentColor, setTheme, setAccentColor } = useTheme();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');

  const handleUpdateProfile = async () => {
    setLoading(true);
    const result = await updateProfile(fullName);
    setLoading(false);

    if (!result.error) {
      setSuccess(true);
      showToast('Profile updated successfully');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    showToast(`Theme changed to ${THEMES[newTheme].label}`, 'info');
  };

  const handleAccentChange = (newAccent: AccentColor) => {
    setAccentColor(newAccent);
    showToast(`Accent color changed to ${ACCENT_COLORS[newAccent].label}`, 'info');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Moon },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>Settings</h1>
        <p className="mt-1" style={{ color: 'var(--theme-text-muted)' }}>Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div
            className="rounded-2xl border p-2"
            style={{
              backgroundColor: 'var(--theme-bg-secondary)',
              borderColor: 'var(--theme-border)'
            }}
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'active-accent'
                    : ''
                }`}
                style={{
                  color: activeTab === id ? 'var(--accent-primary)' : 'var(--theme-text-muted)'
                }}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: 'var(--theme-bg-secondary)',
              borderColor: 'var(--theme-border)'
            }}
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                  <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--accent-primary-light)' }}>
                    <User className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Profile Settings</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Update your personal information</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Email</label>
                    <div
                      className="px-4 py-3 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--theme-bg-tertiary)',
                        borderColor: 'var(--theme-border)',
                        color: 'var(--theme-text-muted)'
                      }}
                    >
                      {profile?.id ? 'user@example.com' : 'Loading...'}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Email cannot be changed</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button onClick={handleUpdateProfile} loading={loading}>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  {success && (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Profile updated successfully</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Security Settings</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Manage your password and security</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    type="password"
                    label="Current Password"
                    placeholder="Enter current password"
                  />
                  <Input
                    type="password"
                    label="New Password"
                    placeholder="Enter new password"
                  />
                  <Input
                    type="password"
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="pt-4">
                  <Button>
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                  <div className="p-2 rounded-xl bg-amber-500/10">
                    <Bell className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Notification Settings</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Choose what notifications you receive</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', description: 'Receive email updates about your leads' },
                    { label: 'New lead alerts', description: 'Get notified when a new lead is added' },
                    { label: 'Status change alerts', description: 'Get notified when lead status changes' },
                    { label: 'Weekly summary', description: 'Receive weekly performance summary' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--theme-bg-tertiary)',
                        borderColor: 'var(--theme-border)'
                      }}
                    >
                      <div>
                        <p className="font-medium" style={{ color: 'var(--theme-text)' }}>{item.label}</p>
                        <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                        <div
                          className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: 'var(--theme-border-secondary)'
                          }}
                        />
                        <style>{`
                          .peer:checked + div {
                            background-color: var(--accent-primary) !important;
                          }
                        `}</style>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
                  <div className="p-2 rounded-xl bg-cyan-500/10">
                    <Moon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Appearance Settings</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>Customize the look and feel</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Theme Selection */}
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--theme-bg-tertiary)',
                      borderColor: 'var(--theme-border)'
                    }}
                  >
                    <p className="font-medium mb-4" style={{ color: 'var(--theme-text)' }}>Theme</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {Object.values(THEMES).map((themeOption) => (
                        <button
                          key={themeOption.name}
                          onClick={() => handleThemeChange(themeOption.name)}
                          className={`relative p-4 rounded-xl border transition-all ${theme === themeOption.name ? 'ring-2' : ''}`}
                          style={{
                            backgroundColor: themeOption.colors.bgSecondary,
                            borderColor: theme === themeOption.name ? 'var(--accent-primary)' : 'var(--theme-border)',
                            boxShadow: theme === themeOption.name ? 'var(--accent-glow)' : 'none',
                            color: themeOption.colors.text
                          }}
                        >
                          {theme === themeOption.name && (
                            <div
                              className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'var(--accent-primary)' }}
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                          <div
                            className="w-8 h-8 rounded-lg mb-2"
                            style={{ backgroundColor: themeOption.colors.bgTertiary }}
                          />
                          <span className="text-sm font-medium">{themeOption.label}</span>
                          <div className="flex gap-1 mt-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: themeOption.colors.bg }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: themeOption.colors.bgSecondary }}
                            />
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: themeOption.colors.bgTertiary }}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Selection */}
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--theme-bg-tertiary)',
                      borderColor: 'var(--theme-border)'
                    }}
                  >
                    <p className="font-medium mb-4" style={{ color: 'var(--theme-text)' }}>Accent Color</p>
                    <div className="flex flex-wrap gap-3">
                      {Object.values(ACCENT_COLORS).map((accentOption) => (
                        <button
                          key={accentOption.name}
                          onClick={() => handleAccentChange(accentOption.name)}
                          className={`relative w-12 h-12 rounded-xl transition-all hover:scale-110 ${accentColor === accentOption.name ? 'ring-2 ring-offset-2' : ''}`}
                          style={{
                            backgroundColor: accentOption.primary,
                            boxShadow: accentColor === accentOption.name ? `0 4px 15px ${accentOption.glow}` : undefined,
                            '--tw-ring-color': accentColor === accentOption.name ? accentOption.primary : 'transparent',
                            '--tw-ring-offset-color': 'var(--theme-bg-tertiary)'
                          } as React.CSSProperties}
                        >
                          {accentColor === accentOption.name && (
                            <CheckCircle className="absolute inset-0 m-auto w-5 h-5 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {Object.values(ACCENT_COLORS).map((accentOption) => (
                        <span
                          key={accentOption.name}
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: accentColor === accentOption.name ? 'var(--accent-primary-light)' : 'transparent',
                            color: accentColor === accentOption.name ? 'var(--accent-primary)' : 'var(--theme-text-muted)'
                          }}
                        >
                          {accentOption.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preview Card */}
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--theme-bg-tertiary)',
                      borderColor: 'var(--theme-border)'
                    }}
                  >
                    <p className="font-medium mb-4" style={{ color: 'var(--theme-text)' }}>Preview</p>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 rounded-lg text-white font-medium"
                          style={{
                            background: `linear-gradient(to right, var(--accent-primary), var(--accent-primary-dark))`,
                            boxShadow: `0 4px 15px var(--accent-glow)`
                          }}
                        >
                          Primary Button
                        </button>
                        <button
                          className="px-4 py-2 rounded-lg font-medium border"
                          style={{
                            borderColor: 'var(--theme-border)',
                            color: 'var(--theme-text-secondary)'
                          }}
                        >
                          Secondary
                        </button>
                      </div>
                      <div
                        className="p-3 rounded-lg border"
                        style={{
                          backgroundColor: 'var(--accent-primary-light)',
                          borderColor: 'var(--accent-primary)',
                          color: 'var(--accent-primary)'
                        }}
                      >
                        Accent highlighted card
                      </div>
                      <div className="flex gap-2">
                        {['New', 'Contacted', 'Converted'].map((status) => (
                          <span
                            key={status}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: 'var(--theme-bg-secondary)',
                              border: '1px solid var(--theme-border)',
                              color: 'var(--theme-text-secondary)'
                            }}
                          >
                            {status}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
