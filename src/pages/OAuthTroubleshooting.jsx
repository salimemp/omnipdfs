import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, ExternalLink, CheckCircle2, Copy, 
  Settings, Shield, Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function OAuthTroubleshooting({ theme }) {
  const isDark = theme === 'dark';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          OAuth Error 400: Redirect URI Mismatch
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Fix the Google OAuth configuration for your app
        </p>
      </div>

      {/* Error Explanation */}
      <Alert className={isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}>
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <AlertDescription className={isDark ? 'text-red-300' : 'text-red-700'}>
          The redirect URI in your Google Cloud Console doesn't match the platform's authentication endpoint.
          This must be configured in Google's settings.
        </AlertDescription>
      </Alert>

      {/* Platform Info */}
      <Card className={isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                Platform Authentication
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Your app uses the Base44 platform's authentication system. The redirect URI is managed by the platform infrastructure and cannot be changed from your application code.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solution Steps */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Settings className="w-5 h-5 text-emerald-400" />
            Fix: Update Google Cloud Console
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>1</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Access Google Cloud Console
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Open Google Cloud Console and navigate to your project with OAuth credentials
                </p>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Open Console
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>2</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Find Your OAuth 2.0 Client ID
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Go to: <strong>APIs & Services → Credentials</strong>
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Look for the Client ID that matches your GOOGLE_CLIENT_ID secret
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>3</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Add Authorized Redirect URI
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Click your Client ID name, then click "Edit settings"
                </p>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Scroll to <strong>"Authorized redirect URIs"</strong> section and add:
                </p>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <code className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      https://app.base44.com/api/apps/auth/callback
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard('https://app.base44.com/api/apps/auth/callback')}
                      className="h-7"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">
                    Required Platform URI
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>4</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Update OAuth Consent Screen (Optional)
                </h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  To show your app name instead of the platform:
                </p>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Go to: <strong>APIs & Services → OAuth consent screen</strong>
                </p>
                <div className={`p-3 rounded-lg space-y-2 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <div>
                    <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Application name:
                    </p>
                    <code className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      OmniPDFs
                    </code>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Application home page:
                    </p>
                    <code className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      https://www.omnipdfs.com
                    </code>
                  </div>
                  <div>
                    <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Authorized domains:
                    </p>
                    <code className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      omnipdfs.com
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Save & Test
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Click "Save" at the bottom of the page. Changes may take 5-10 minutes to propagate. Clear your browser cache and try signing in again.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Still Having Issues?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              Check Your Secrets
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Verify that your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correctly set in Settings → Environment Variables
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Wait for Propagation
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Google OAuth changes can take 5-10 minutes to become active. Be patient and try again after waiting.
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              Clear Browser Cache
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Old OAuth sessions may be cached. Clear your browser cache and cookies, then try signing in again.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Important Note */}
      <Alert className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}>
        <Shield className="w-4 h-4" />
        <AlertDescription className={isDark ? 'text-slate-300' : 'text-slate-700'}>
          <strong>Platform Security:</strong> The Base44 platform redirect URI (https://app.base44.com/api/apps/auth/callback) is required for authentication to work. This is a platform-level endpoint that securely handles OAuth callbacks for all apps.
        </AlertDescription>
      </Alert>
    </div>
  );
}