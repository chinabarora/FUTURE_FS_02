import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Mail, Lock, User, ArrowRight, Building2, CheckCircle, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { accentConfig } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password);

        if (signInError) {
          setError(signInError);
        } else {
          setSuccess('Sign in successful! Redirecting...');
          setTimeout(() => {
            onSuccess?.();
          }, 500);
        }
      } else {
        if (!fullName.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { error: signUpError, data } = await signUp(email, password, fullName);

        if (signUpError) {
          setError(signUpError);
        } else if (data?.user && !data.session) {
          setSuccess('Account created! Please check your email for a confirmation link to complete your registration.');
        } else if (data?.session) {
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            onSuccess?.();
          }, 500);
        } else {
          setSuccess('Account created! You can now sign in.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error('[AuthForm] Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setSuccess(null);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accentConfig.primaryLight} 0%, transparent 50%),
                       radial-gradient(circle at 70% 80%, ${accentConfig.primaryLight} 0%, transparent 50%)`
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in">
        <div
          className="backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10"
          style={{
            backgroundColor: 'var(--theme-bg-secondary)',
            border: '1px solid var(--theme-border)'
          }}
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentConfig.primary}, ${accentConfig.primaryDark})`,
                boxShadow: `0 8px 30px ${accentConfig.glow}`
              }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>CRM Pro</h1>
            <p style={{ color: 'var(--theme-text-muted)' }}>
              {isLogin ? 'Welcome back! Please sign in.' : 'Create your account to get started.'}
            </p>
          </div>

          {success ? (
            <div className="space-y-6 animate-fade-in">
              <div
                className="p-4 rounded-xl flex items-start gap-3"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-emerald-400 font-medium">{success}</p>
                </div>
              </div>

              {!success.includes('Redirecting') && (
                <button
                  onClick={() => {
                    resetForm();
                    setIsLogin(true);
                  }}
                  className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200"
                  style={{
                    background: `linear-gradient(to right, ${accentConfig.primary}, ${accentConfig.primaryDark})`,
                    boxShadow: `0 4px 15px ${accentConfig.glow}`
                  }}
                >
                  Continue to Sign In
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative animate-slide-down">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'var(--theme-bg-tertiary)',
                      border: '1px solid var(--theme-border)',
                      color: 'var(--theme-text)'
                    }}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--theme-bg-tertiary)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)'
                  }}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--theme-bg-tertiary)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)'
                  }}
                />
              </div>

              {error && (
                <div
                  className="p-3.5 rounded-xl text-sm flex items-start gap-3 animate-fade-in"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444'
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(to right, ${accentConfig.primary}, ${accentConfig.primaryDark})`,
                  boxShadow: `0 4px 15px ${accentConfig.glow}`
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <p style={{ color: 'var(--theme-text-muted)' }}>
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={toggleMode}
                  disabled={loading}
                  className="ml-2 font-medium transition-colors duration-200 disabled:opacity-50"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--theme-text-muted)' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
