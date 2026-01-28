import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function usePremiumCheck() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setIsPremium(
          userData?.subscription_tier === 'premium' || 
          userData?.subscription_tier === 'pro'
        );
      } catch (e) {
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };
    checkPremium();
  }, []);

  return { user, isPremium, loading };
}