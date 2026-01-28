import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AdBanner({ slot = 'horizontal', isDark = true }) {
  const [user, setUser] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    fetchUser();
  }, []);

  // Only show ads for free users (non-premium)
  const isPremium = user?.subscription_tier === 'premium' || user?.subscription_tier === 'pro';
  
  if (isPremium || dismissed || !user) return null;

  const handleUpgrade = () => {
    window.location.href = '/settings?tab=billing';
  };

  return (
    <div className={`relative ${
      slot === 'horizontal' ? 'w-full h-24' : 'w-72 h-96'
    } rounded-lg border ${
      isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
    } flex items-center justify-center overflow-hidden`}>
      {/* Placeholder Ad Content */}
      <div className="text-center p-4">
        <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          📢 Advertisement
        </p>
        <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Remove ads with Premium
        </p>
        <Button
          size="sm"
          onClick={handleUpgrade}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
        >
          Upgrade Now
        </Button>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setDismissed(true)}
        className={`absolute top-2 right-2 p-1 rounded ${
          isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
        }`}
        aria-label="Dismiss ad"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Google Ads Script Placeholder */}
      <div
        id={`google-ad-${slot}`}
        className="hidden"
        data-ad-client={process.env.GOOGLE_ADS_CLIENT_ID || 'ca-pub-placeholder'}
        data-ad-slot={slot}
      />
    </div>
  );
}