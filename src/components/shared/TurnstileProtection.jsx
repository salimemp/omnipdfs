import React, { useEffect, useRef, useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';

export default function TurnstileProtection({ onVerify, isDark = true }) {
  const turnstileRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const siteKey = process.env.CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

    // Load Cloudflare Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.turnstile && turnstileRef.current) {
        try {
          window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            theme: isDark ? 'dark' : 'light',
            callback: (token) => {
              setLoading(false);
              onVerify?.(token);
            },
            'error-callback': () => {
              setError(true);
              setLoading(false);
            },
          });
        } catch (err) {
          console.error('Turnstile render error:', err);
          setError(true);
          setLoading(false);
        }
      }
    };

    script.onerror = () => {
      setError(true);
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.turnstile && turnstileRef.current) {
        try {
          window.turnstile.remove(turnstileRef.current);
        } catch (err) {
          console.error('Turnstile cleanup error:', err);
        }
      }
    };
  }, [isDark, onVerify]);

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