import React, { useState } from 'react';
import { Shield, Key, Fingerprint, Smartphone, Globe, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdvancedAuthOptions({ isDark = true }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [ssoEnabled, setSsoEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordlessEnabled, setPasswordlessEnabled] = useState(false);

  const authMethods = [
    {
      id: 'sso',
      icon: Globe,
      title: 'Single Sign-On (SSO)',
      description: 'Enable enterprise SSO with SAML 2.0 or OAuth',
      enabled: ssoEnabled,
      toggle: setSsoEnabled,
      color: 'violet'
    },
    {
      id: 'biometric',
      icon: Fingerprint,
      title: 'Biometric Authentication',
      description: 'Face ID, Touch ID, or fingerprint login',
      enabled: biometricEnabled,
      toggle: setBiometricEnabled,
      color: 'cyan'
    },
    {
      id: '2fa',
      icon: Smartphone,
      title: 'Two-Factor Authentication',
      description: 'Add extra security with OTP codes',
      enabled: twoFactorEnabled,
      toggle: setTwoFactorEnabled,
      color: 'emerald'
    },
    {
      id: 'passwordless',
      icon: Key,
      title: 'Passwordless Login',
      description: 'Magic links and WebAuthn support',
      enabled: passwordlessEnabled,
      toggle: setPasswordlessEnabled,
      color: 'amber'
    }
  ];

  const handleSaveSettings = () => {
    toast.success('Authentication settings saved');
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200'}`}>
        <Shield className="w-6 h-6 text-violet-400" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Advanced Authentication
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Enterprise-grade security and access control
          </p>
        </div>
      </div>

      {/* Authentication Methods */}
      <div className="grid md:grid-cols-2 gap-4">
        {authMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.id} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${method.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${method.color}-400`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {method.title}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={method.enabled}
                    onCheckedChange={method.toggle}
                  />
                </div>
                {method.enabled && (
                  <Badge className={`bg-${method.color}-500/20 text-${method.color}-400`}>
                    Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Advanced Configuration */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className={`grid grid-cols-3 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border`}>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="sso">SSO Config</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Session Management</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Configure session timeouts and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Session Timeout</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Remember Device</Label>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Skip 2FA on trusted devices</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Force Logout on Password Change</Label>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>End all sessions on password reset</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>SSO Configuration</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Configure SAML 2.0 or OAuth 2.0 settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Identity Provider</Label>
                <Select>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    <SelectItem value="okta">Okta</SelectItem>
                    <SelectItem value="azure">Azure AD</SelectItem>
                    <SelectItem value="google">Google Workspace</SelectItem>
                    <SelectItem value="auth0">Auth0</SelectItem>
                    <SelectItem value="onelogin">OneLogin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>SAML Metadata URL</Label>
                <Input
                  placeholder="https://idp.example.com/metadata"
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                />
              </div>

              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Entity ID</Label>
                <Input
                  placeholder="urn:example:sp"
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                />
              </div>

              <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      Automatic User Provisioning
                    </p>
                    <p className={`text-xs ${isDark ? 'text-blue-400/70' : 'text-blue-600'}`}>
                      Users are automatically created on first SSO login
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Security Policies</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Password and access policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Minimum Password Length</Label>
                <Select defaultValue="12">
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    <SelectItem value="8">8 characters</SelectItem>
                    <SelectItem value="12">12 characters</SelectItem>
                    <SelectItem value="16">16 characters</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Require Special Characters</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Require Numbers</Label>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Block Common Passwords</Label>
                <Switch defaultChecked />
              </div>

              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Max Failed Login Attempts</Label>
                <Select defaultValue="5">
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSaveSettings} className="w-full bg-gradient-to-r from-violet-500 to-purple-600">
        <Lock className="w-4 h-4 mr-2" />
        Save Authentication Settings
      </Button>
    </div>
  );
}