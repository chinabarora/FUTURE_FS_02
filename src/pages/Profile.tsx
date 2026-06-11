import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { Camera, Mail, Calendar, Shield, Edit, Save, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(fullName);
    setLoading(false);

    if (!result.error) {
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
        <p className="text-slate-400 mt-1">View and manage your profile information</p>
      </div>

      <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-4xl shadow-2xl shadow-blue-500/25 ring-4 ring-slate-800">
                {getInitials(fullName || 'User')}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="flex-1 sm:pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{fullName || 'User'}</h2>
                  <p className="text-slate-400">Administrator</p>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} loading={loading}>
                        <Save className="w-4 h-4" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {success && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400">Profile updated successfully!</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
          <div className="space-y-4">
            {isEditing ? (
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Full Name</p>
                <p className="text-white">{fullName || 'Not set'}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Mail className="w-3 h-3" />
                Email Address
              </div>
              <p className="text-white">{user?.email || 'user@example.com'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <Calendar className="w-3 h-3" />
                Member Since
              </div>
              <p className="text-white">
                {user?.created_at ? format(new Date(user.created_at), 'MMMM d, yyyy') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Security</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-medium text-white">Two-Factor Authentication</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">
                Add an extra layer of security to your account
              </p>
              <Button variant="secondary" size="sm">
                Enable 2FA
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <span className="text-sm text-slate-400">Password</span>
              <p className="text-white mt-1">••••••••</p>
              <Button variant="ghost" size="sm" className="mt-3">
                Change Password
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
              <span className="text-sm text-slate-400">Last Login</span>
              <p className="text-white mt-1">
                {user?.last_sign_in_at
                  ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy h:mm a')
                  : 'Today'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
