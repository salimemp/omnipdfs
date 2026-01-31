import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from './utils';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmailVerification() {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');
  const [verificationType, setVerificationType] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const type = params.get('type');

      if (!token || !type) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      setVerificationType(type);

      const response = await base44.functions.invoke('emailVerification', {
        action: 'verify_token',
        data: {
          token,
          verificationType: type
        }
      });

      if (response.data.success) {
        setStatus('success');
        if (type === 'registration') {
          setMessage('Email verified successfully! You can now sign in to your account.');
        } else {
          setMessage('Login verified successfully! You can now continue using your account.');
        }

        // Redirect after 3 seconds
        setTimeout(() => {
          if (type === 'registration') {
            base44.auth.redirectToLogin(createPageUrl('CustomDashboard'));
          } else {
            navigate(createPageUrl('CustomDashboard'));
          }
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.data.error || 'Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6">
              {status === 'verifying' && (
                <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
              )}
              {status === 'error' && (
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-400" />
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              {status === 'verifying' && 'Verifying...'}
              {status === 'success' && '✓ Verified!'}
              {status === 'error' && 'Verification Failed'}
            </h1>

            {/* Message */}
            <p className="text-slate-400 mb-6">{message}</p>

            {/* Actions */}
            {status === 'success' && (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting...</span>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="w-full space-y-3">
                <Button
                  onClick={() => navigate(createPageUrl('CustomDashboard'))}
                  className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Having trouble? Contact support at{' '}
              <a href="mailto:support@omnipdfs.com" className="text-violet-400 hover:text-violet-300">
                support@omnipdfs.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}