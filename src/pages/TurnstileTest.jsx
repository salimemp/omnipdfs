import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import TurnstileProtection from '@/components/shared/TurnstileProtection';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TurnstileTest({ theme }) {
  const isDark = theme === 'dark';
  const [token, setToken] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(null);

  const handleVerify = async (turnstileToken) => {
    setToken(turnstileToken);
    toast.success('Turnstile token received');
  };

  const testVerification = async () => {
    if (!token) {
      toast.error('Please complete the Turnstile challenge first');
      return;
    }

    setVerifying(true);
    try {
      const result = await base44.functions.invoke('verifyTurnstile', { token });

      if (result.data.success) {
        setVerified(true);
        toast.success('Verification successful!');
      } else {
        setVerified(false);
        toast.error('Verification failed');
      }
    } catch (e) {
      setVerified(false);
      toast.error('Backend verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Cloudflare Turnstile Test
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Test and verify Turnstile integration
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Site Key
                </p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ? 'Configured' : 'Missing'}
                </p>
              </div>
              {process.env.CLOUDFLARE_TURNSTILE_SITE_KEY ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Token Received
                </p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {token ? 'Yes' : 'Pending'}
                </p>
              </div>
              {token ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Verification
                </p>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {verified === null ? 'Not tested' : verified ? 'Passed' : 'Failed'}
                </p>
              </div>
              {verified === null ? (
                <Shield className="w-5 h-5 text-slate-400" />
              ) : verified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Turnstile Widget */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Shield className="w-5 h-5 text-violet-400" />
            Turnstile Challenge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TurnstileProtection 
            onVerify={handleVerify} 
            isDark={isDark}
          />

          {token && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Token (first 50 chars):
              </p>
              <code className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {token.substring(0, 50)}...
              </code>
            </div>
          )}

          <Button
            onClick={testVerification}
            disabled={!token || verifying}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500"
          >
            {verifying ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Test Backend Verification
          </Button>
        </CardContent>
      </Card>

      {/* Configuration Instructions */}
      <Card className={isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}>
        <CardHeader>
          <CardTitle className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ol className={`text-sm space-y-2 list-decimal list-inside ${isDark ? 'text-blue-400/70' : 'text-blue-600'}`}>
            <li>Get your Site Key from Cloudflare Turnstile dashboard</li>
            <li>Update TurnstileProtection component with your Site Key</li>
            <li>Ensure CLOUDFLARE_TURNSTILE_SECRET_KEY is set in Settings → Environment Variables</li>
            <li>Complete the challenge and click "Test Backend Verification"</li>
          </ol>
        </CardContent>
      </Card>

      {/* Results */}
      {verified !== null && (
        <Card className={verified 
          ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200')
          : (isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200')
        }>
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              {verified ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${verified ? (isDark ? 'text-emerald-300' : 'text-emerald-700') : (isDark ? 'text-red-300' : 'text-red-700')}`}>
                  {verified ? 'Turnstile is working correctly!' : 'Verification failed'}
                </p>
                <p className={`text-sm ${verified ? (isDark ? 'text-emerald-400/70' : 'text-emerald-600') : (isDark ? 'text-red-400/70' : 'text-red-600')}`}>
                  {verified 
                    ? 'Backend successfully verified the token with Cloudflare'
                    : 'Check console for errors or verify secret key is correct'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}