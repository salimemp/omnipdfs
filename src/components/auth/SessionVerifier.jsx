import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Shield } from 'lucide-react';

export default function SessionVerifier({ isDark = true }) {
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationReason, setVerificationReason] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let os = 'Unknown';
    let deviceType = 'desktop';

    if (ua.indexOf('Win') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'MacOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    else if (ua.indexOf('Android') !== -1) { os = 'Android'; deviceType = 'mobile'; }
    else if (ua.indexOf('iOS') !== -1) { os = 'iOS'; deviceType = 'mobile'; }

    if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

    const browserMatch = ua.match(/(firefox|msie|chrome|safari|trident|edg)[\/\s]([\d.]+)/i);
    const browser = browserMatch ? `${browserMatch[1]} ${browserMatch[2]}` : 'Unknown';

    const deviceFingerprint = btoa(`${os}-${browser}-${navigator.language}-${screen.width}x${screen.height}`);

    return {
      deviceFingerprint,
      os,
      browser,
      deviceType,
      screenResolution: `${screen.width}x${screen.height}`
    };
  };

  const getLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        city: data.city,
        country: data.country_name,
        timezone: data.timezone
      };
    } catch {
      return {
        city: 'Unknown',
        country: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  };

  const getIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'Unknown';
    }
  };

  const checkSession = async () => {
    try {
      const user = await base44.auth.isAuthenticated();
      if (!user) return;

      const deviceInfo = getDeviceInfo();
      const location = await getLocation();
      const ipAddress = await getIpAddress();

      const response = await base44.functions.invoke('sessionVerification', {
        action: 'verify_session',
        sessionData: {
          ...deviceInfo,
          location,
          ipAddress
        }
      });

      if (response.data.success) {
        if (response.data.needsVerification) {
          setNeedsVerification(true);
          setVerificationReason(response.data.reason);
          setSessionId(response.data.sessionId);
          toast.warning('Security Alert: New device or location detected');
        } else if (response.data.isFirstTime) {
          toast.success('Session verified - Welcome!');
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      const response = await base44.functions.invoke('sessionVerification', {
        action: 'confirm_verification',
        sessionData: { sessionId }
      });

      if (response.data.success) {
        setNeedsVerification(false);
        toast.success('Session verified successfully');
      }
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <Dialog open={needsVerification} onOpenChange={() => {}}>
      <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white'}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                Security Verification Required
              </DialogTitle>
              <DialogDescription>
                We detected unusual activity on your account
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Change Detected
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {verificationReason}
              </p>
            </div>
          </div>
        </div>

        <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <p>If this was you, please verify to continue. Otherwise, secure your account immediately.</p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex-1"
          >
            Not Me - Logout
          </Button>
          <Button
            onClick={handleVerify}
            disabled={verifying}
            className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {verifying ? 'Verifying...' : 'Verify It\'s Me'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}