import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        if (mounted) {
          setUser(userData);
          setError(null);
        }
      } catch (e) {
        if (mounted) {
          // User not authenticated - this is normal for public apps
          setUser(null);
          setError(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setError(null);
      return userData;
    } catch (e) {
      setUser(null);
      setError(null);
      return null;
    }
  };

  const logout = async (redirectUrl) => {
    await base44.auth.logout(redirectUrl);
    setUser(null);
  };

  const login = () => {
    base44.auth.redirectToLogin();
  };

  const value = {
    user,
    loading,
    error,
    refreshUser,
    logout,
    login,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}