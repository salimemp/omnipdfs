import React, { useEffect, useRef, useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';

export default function TurnstileProtection({ onVerify, isDark = true, siteKey }) {
  const turnstileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [widgetId, setWidgetId] = useState(null);

  const initializeTurnstile = (key) => {
    if (!window.turnstile || !turnstileRef.current) return;
    
    try {
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: key,
        theme: isDark ? 'dark' : 'light',
        callback: (token) => {
          setLoading(false);
          onVerify?.(token);
        },
        'error-callback': () => {
          setError(true);
          setLoading(false);
        },
        'expired-callback': () => {
          setLoading(true);
          // Auto-refresh on expiry
          if (widgetId) {
            window.turnstile.reset(widgetId);
          }
        }
      });
      setWidgetId(id);
      setLoading(false);
    } catch (err) {
      console.error('Turnstile render error:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    // ISSUE: Environment variables aren't accessible in frontend
    // Frontend should use the CLOUDFLARE_TURNSTILE_SITE_KEY directly
    const siteKey = '0x4AAAAAAA3MqhOZ9vvvvvvv'; // Replace with actual site key from Cloudflare dashboard
    
    // Check if script already loaded
    if (document.querySelector('script[src*="challenges.cloudflare.com"]')) {
      if (window.turnstile && turnstileRef.current) {
        initializeTurnstile(siteKey);
      }
      return;
    }

    // Load Cloudflare Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeTurnstile(siteKey);
    };

    script.onerror = () => {
      setError(true);
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid re-downloads
      if (window.turnstile && widgetId) {
        try {
          window.turnstile.remove(widgetId);
        } catch (err) {
          console.error('Turnstile cleanup error:', err);
        }
      }
    };
  }, [isDark, onVerify, siteKey]);

  if (error) {
    return (
      <div className={`p-4 rounded-lg border ${
        isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
      }`}>
        <p className="text-sm">Unable to load security verification. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <Shield className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
          Security verification
        </span>
      </div>
      
      <div className={`relative min-h-[65px] rounded-lg ${
        isDark ? 'bg-slate-800/50' : 'bg-slate-50'
      } flex items-center justify-center`}>
        {loading && (
          <div className="flex items-center gap-2 text-violet-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading verification...</span>
          </div>
        )}
        <div ref={turnstileRef} className={loading ? 'opacity-0' : 'opacity-100'} />
      </div>
    </div>
  );
}