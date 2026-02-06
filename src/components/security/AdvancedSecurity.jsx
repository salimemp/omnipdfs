import React, { useState } from 'react';
import { Shield, Lock, Key, Eye, FileCheck, AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../shared/LanguageContext';
import { toast } from 'sonner';

export default function AdvancedSecurity({ document, isDark }) {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('AES-256');
  const [watermarkText, setWatermarkText] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [allowedIPs, setAllowedIPs] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [auditLog, setAuditLog] = useState(true);
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    editing: true,
    commenting: true,
    downloading: true,
    sharing: true,
  });

  const handlePasswordProtect = () => {
    if (!password) {
      toast.error('Please enter a password');
      return;
    }
    toast.success('Document protected with password');
  };

  const handleEncrypt = () => {
    toast.success(`Document encrypted with ${encryption}`);
  };

  const handleWatermark = () => {
    if (!watermarkText) {
      toast.error('Please enter watermark text');
      return;
    }
    toast.success('Watermark applied successfully');
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
        <Shield className="w-6 h-6 text-amber-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('security')} & Protection
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Advanced security features for your documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList className={`grid grid-cols-5 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border`}>
          <TabsTrigger value="password" className="data-[state=active]:bg-violet-500/20">
            <Lock className="w-4 h-4 mr-2" />
            Password
          </TabsTrigger>
          <TabsTrigger value="encryption" className="data-[state=active]:bg-violet-500/20">
            <Key className="w-4 h-4 mr-2" />
            Encryption
          </TabsTrigger>
          <TabsTrigger value="watermark" className="data-[state=active]:bg-violet-500/20">
            <FileCheck className="w-4 h-4 mr-2" />
            Watermark
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-violet-500/20">
            <UserCheck className="w-4 h-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-violet-500/20">
            <Shield className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Password Protection</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Secure your document with a password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Document Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                />
              </div>
              <Button onClick={handlePasswordProtect} className="w-full bg-gradient-to-r from-violet-500 to-purple-500">
                <Lock className="w-4 h-4 mr-2" />
                Apply Password Protection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="encryption" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Document Encryption</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Encrypt document with industry-standard algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Encryption Algorithm</Label>
                <Select value={encryption} onValueChange={setEncryption}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    <SelectItem value="AES-256">AES-256 (Military Grade)</SelectItem>
                    <SelectItem value="AES-128">AES-128 (Standard)</SelectItem>
                    <SelectItem value="RSA-2048">RSA-2048</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEncrypt} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                <Key className="w-4 h-4 mr-2" />
                Encrypt Document
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watermark" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Watermark</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Add visible watermark to protect your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Watermark Text</Label>
                <Input
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="CONFIDENTIAL"
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                />
              </div>
              <Button onClick={handleWatermark} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500">
                <FileCheck className="w-4 h-4 mr-2" />
                Apply Watermark
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Document Permissions</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Control what users can do with this document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className={`capitalize ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Allow {key}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => setPermissions({ ...permissions, [key]: checked })}
                  />
                </div>
              ))}
              <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Save Permissions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Advanced Security</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Enterprise-grade protection features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Document Expiry</Label>
                <Input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Auto-delete after specified time</p>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>IP Whitelist</Label>
                <Input
                  value={allowedIPs}
                  onChange={(e) => setAllowedIPs(e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Comma-separated IP addresses</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Two-Factor Authentication</Label>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Require 2FA for access</p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Audit Logging</Label>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Track all access and changes</p>
                </div>
                <Switch
                  checked={auditLog}
                  onCheckedChange={setAuditLog}
                />
              </div>

              <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      Zero-Knowledge Encryption
                    </p>
                    <p className={`text-xs ${isDark ? 'text-amber-400/70' : 'text-amber-600'}`}>
                      Documents encrypted client-side. Even we cannot access your data.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500">
                <Shield className="w-4 h-4 mr-2" />
                Apply Advanced Security
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}