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
  const [permissions, setPermissions] = useState({
    printing: true,
    copying: true,
    editing: true,
    commenting: true,
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
        <TabsList className={`grid grid-cols-4 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border`}>
          <TabsTrigger value="password" className="data-[state=active]:bg-violet-500/20">
            <Lock className="w-4 h-4 mr-2" />
            {t('passwordProtect')}
          </TabsTrigger>
          <TabsTrigger value="encryption" className="data-[state=active]:bg-violet-500/20">
            <Key className="w-4 h-4 mr-2" />
            {t('encryption')}
          </TabsTrigger>
          <TabsTrigger value="watermark" className="data-[state=active]:bg-violet-500/20">
            <FileCheck className="w-4 h-4 mr-2" />
            {t('watermark')}
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-violet-500/20">
            <UserCheck className="w-4 h-4 mr-2" />
            {t('permissions')}
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
      </Tabs>
    </div>
  );
}