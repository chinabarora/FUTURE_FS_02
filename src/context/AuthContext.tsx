import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User as AuthUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  profile: { id: string; full_name?: string; avatar_url?: string } | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null; data?: { user: AuthUser | null; session: Session | null } }>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ id: string; full_name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthContext] Error fetching profile:', error);
        // Profile might not exist yet, try to create it
        if (error.code === 'PGRST116') {
          console.log('[AuthContext] Profile not found, creating...');
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: userId }]);

          if (insertError) {
            console.error('[AuthContext] Error creating profile:', insertError);
          } else {
            // Retry fetch
            const { data: newProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            setProfile(newProfile);
          }
        }
      } else {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('[AuthContext] Exception fetching profile:', err);
    }
  }, []);

  useEffect(() => {
    console.log('[AuthContext] Initializing auth state...');

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthContext] Error getting session:', error);
        } else {
          console.log('[AuthContext] Session retrieved:', session ? 'active' : 'none');
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await fetchProfile(session.user.id);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Exception getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] Auth state changed:', event, session ? 'session exists' : 'no session');

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Small delay to ensure profile trigger has completed
        setTimeout(() => fetchProfile(session.user.id), 500);
      } else {
        setProfile(null);
      }
    });

    return () => {
      console.log('[AuthContext] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    console.log('[AuthContext] Attempting sign in for:', email);

    if (!email || !password) {
      console.error('[AuthContext] Sign in validation failed: missing fields');
      return { error: 'Email and password are required' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('[AuthContext] Sign in error:', error);
        return { error: formatAuthError(error) };
      }

      console.log('[AuthContext] Sign in successful');
      return { error: null };
    } catch (err) {
      console.error('[AuthContext] Sign in exception:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: string | null; data?: { user: AuthUser | null; session: Session | null } }> => {
    console.log('[AuthContext] Attempting sign up for:', email, 'name:', fullName);

    // Validation
    if (!email || !password) {
      console.error('[AuthContext] Sign up validation failed: missing email or password');
      return { error: 'Email and password are required' };
    }

    if (password.length < 6) {
      console.error('[AuthContext] Sign up validation failed: password too short');
      return { error: 'Password must be at least 6 characters' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('[AuthContext] Sign up validation failed: invalid email format');
      return { error: 'Please enter a valid email address' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || '',
          },
        },
      });

      if (error) {
        console.error('[AuthContext] Sign up error:', error);
        return { error: formatAuthError(error) };
      }

      console.log('[AuthContext] Sign up successful:', data);

      // Check if user already exists
      if (data.user && !data.session) {
        console.log('[AuthContext] User created but email confirmation required');
        return {
          error: null,
          data: { user: data.user, session: data.session },
        };
      }

      return { error: null, data: { user: data.user, session: data.session } };
    } catch (err) {
      console.error('[AuthContext] Sign up exception:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signOut = async () => {
    console.log('[AuthContext] Signing out...');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      console.log('[AuthContext] Sign out successful');
    } catch (err) {
      console.error('[AuthContext] Sign out error:', err);
    }
  };

  const updateProfile = async (fullName: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) {
        console.error('[AuthContext] Error updating profile:', error);
        return { error: error.message };
      }

      setProfile({ ...profile, full_name: fullName } as typeof profile);
      return { error: null };
    } catch (err) {
      console.error('[AuthContext] Exception updating profile:', err);
      return { error: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to format auth errors into user-friendly messages
function formatAuthError(error: AuthError): string {
  console.log('[AuthContext] Formatting auth error:', error.status, error.message);

  switch (error.message.toLowerCase()) {
    case 'invalid login credentials':
    case 'invalid credentials':
      return 'Invalid email or password. Please try again.';
    case 'email not confirmed':
      return 'Please check your email and click the confirmation link before signing in.';
    case 'user already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'signup is disabled':
      return 'New account registration is currently disabled.';
    case 'email rate limit exceeded':
      return 'Too many attempts. Please wait a few minutes before trying again.';
    case 'password is too short':
      return 'Password must be at least 6 characters.';
    case 'user not found':
      return 'No account found with this email. Please sign up first.';
    default:
      // Check for specific status codes
      if (error.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (error.status === 400) {
        return 'Invalid request. Please check your input and try again.';
      }
      // Return the original message if we can't provide a better one
      return error.message || 'An authentication error occurred. Please try again.';
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
