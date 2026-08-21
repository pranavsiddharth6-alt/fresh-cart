import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          // Get active Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            localStorage.setItem('supabase_auth_token', session.access_token);
            await loadProfile(session.user.id, session.user.email);
          }

          // Listen for Supabase auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setUser(session.user);
              localStorage.setItem('supabase_auth_token', session.access_token);
              await loadProfile(session.user.id, session.user.email);
            } else {
              setUser(null);
              setProfile(null);
              localStorage.removeItem('supabase_auth_token');
            }
          });

          return () => subscription.unsubscribe();
        } else {
          // Local fallback session
          const stored = localStorage.getItem('freshcart_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            await loadProfile(parsed.id, parsed.email);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // Fetch or create user profile from backend
  async function loadProfile(userId, email) {
    try {
      const data = await api.getProfile(userId);
      setProfile(data);
    } catch {
      // Create fallback profile
      const fallback = {
        id: userId,
        email: email || 'user@example.com',
        name: email ? email.split('@')[0].toUpperCase() : 'Valued Customer',
        phone: '',
        role: email?.includes('admin') ? 'admin' : 'customer'
      };
      setProfile(fallback);
    }
  }

  // Email / Password Login
  async function login(email, password) {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setUser(data.user);
        if (data.session) {
          localStorage.setItem('supabase_auth_token', data.session.access_token);
        }
        await loadProfile(data.user.id, data.user.email);
        return { success: true };
      } else {
        // Local simulation for beginner ease of testing
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'customer';
        const simulatedUser = {
          id: role === 'admin' ? 'admin-user-id' : 'demo-user-id',
          email,
          user_metadata: { name: email.split('@')[0] }
        };
        setUser(simulatedUser);
        localStorage.setItem('freshcart_user', JSON.stringify(simulatedUser));
        await loadProfile(simulatedUser.id, email);
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  }

  // Email / Password Signup
  async function signup(name, email, password) {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name }
          }
        });
        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          await loadProfile(data.user.id, data.user.email);
        }
        return { success: true, message: 'Account created! Please check your email if confirmation is enabled.' };
      } else {
        const simulatedUser = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { name }
        };
        setUser(simulatedUser);
        localStorage.setItem('freshcart_user', JSON.stringify(simulatedUser));
        await loadProfile(simulatedUser.id, email);
        return { success: true, message: 'Account created successfully!' };
      }
    } finally {
      setLoading(false);
    }
  }

  // Google OAuth Login
  async function loginWithGoogle() {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } else {
      // Friendly simulation notification
      const googleUser = {
        id: 'google-user-demo-id',
        email: 'google.shopper@example.com',
        user_metadata: { name: 'Google Shopper' }
      };
      setUser(googleUser);
      localStorage.setItem('freshcart_user', JSON.stringify(googleUser));
      await loadProfile(googleUser.id, googleUser.email);
    }
  }

  // Logout
  async function logout() {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      localStorage.removeItem('supabase_auth_token');
      localStorage.removeItem('freshcart_user');
    } finally {
      setLoading(false);
    }
  }

  // Update Profile
  async function updateUserProfile(updates) {
    if (!user) return;
    const res = await api.updateProfile(user.id, updates);
    if (res.profile) {
      setProfile(res.profile);
    }
    return res;
  }

  const isAdmin = profile?.role === 'admin' || user?.email?.toLowerCase().includes('admin');

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateUserProfile,
    isSupabaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
