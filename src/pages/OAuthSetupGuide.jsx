import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, ExternalLink, Settings, Shield } from 'lucide-react';

export default function OAuthSetupGuide({ theme }) {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          OAuth Configuration Guide
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Update your Google OAuth settings to use omnipdfs.com
        </p>
      </div>

      {/* Important Alert */}
      <Alert className={isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}>
        <Shield className="w-4 h-4 text-amber-500" />
        <AlertDescription className={isDark ? 'text-amber-300' : 'text-amber-700'}>
          The OAuth consent screen showing "base44.com" must be updated in Google Cloud Console. This cannot be changed from within the application.
        </AlertDescription>
      </Alert>

      {/* Step-by-Step Guide */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Settings className="w-5 h-5 text-blue-400" />
            Google Cloud Console Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>1</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Access Google Cloud Console
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Navigate to Google Cloud Console and select your project
                </p>
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                >
                  Open Google Cloud Console
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>2</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  OAuth Consent Screen
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Go to: APIs & Services → OAuth consent screen
                </p>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <p className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Update "Application name" to: <strong>OmniPDFs</strong>
                  </p>
                  <p className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Update "Application home page" to: <strong>https://www.omnipdfs.com</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>3</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Update Authorized Domains
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Add the following authorized domains:
                </p>
                <div className={`p-3 rounded-lg space-y-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <p className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    • omnipdfs.com
                  </p>
                  <p className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    • www.omnipdfs.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>4</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Update Redirect URIs
                </h3>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Go to: APIs & Services → Credentials → Your OAuth 2.0 Client ID
                </p>
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Click "Edit settings" and update Authorized redirect URIs:
                </p>
                <div className={`p-3 rounded-lg space-y-1 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <p className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    • https://www.omnipdfs.com/auth/callback
                  </p>
                  <p className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    • https://omnipdfs.com/auth/callback
                  </p>
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
                  Save and Test
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Save all changes and test the OAuth flow. The consent screen should now show "omnipdfs.com" instead of "base44.com"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Other OAuth Providers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
              Dropbox
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Update App Console → Settings → Redirect URIs to https://www.omnipdfs.com
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Microsoft OneDrive
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Update Azure Portal → App registrations → Redirect URIs to https://www.omnipdfs.com
            </p>
          </div>

          <div>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              Box
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Update Box Developer Console → Configuration → Redirect URI to https://www.omnipdfs.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
        <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
          <strong>Note:</strong> Changes to OAuth settings may take up to 5 minutes to propagate. Clear your browser cache if you don't see changes immediately.
        </p>
      </div>
    </div>
  );
}