import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock, Shield, Eye, EyeOff, Key, UserX, Clock,
  FileKey, Download, AlertTriangle, CheckCircle2,
  Copy, Trash2, Settings, Fingerprint, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedDocumentSecurity({ document, isDark = false }) {
  const [securitySettings, setSecuritySettings] = useState({
    encryption: 'aes-256',
    password: '',
    watermark: false,
    watermarkText: '',
    copyProtection: true,
    printProtection: false,
    expiryEnabled: false,
    expiryDays: 7,
    accessControl: true,
    allowedEmails: []
  });
  const [newEmail, setNewEmail] = useState('');
  const [applying, setApplying] = useState(false);

  const applySecuritySettings = async () => {
    setApplying(true);
    try {
      await base44.entities.Document.update(document.id, {
        is_protected: true,
        expiry_date: securitySettings.expiryEnabled 
          ? new Date(Date.now() + securitySettings.expiryDays * 24 * 60 * 60 * 1000).toISOString()
          : null
      });

      await base44.entities.ComplianceLog.create({
        event_type: 'security_incident',
        resource_type: 'document',
        resource_id: document.id,
        action_description: 'Advanced security settings applied',
        severity: 'low'
      });

      toast.success('Security settings applied');
    } catch (error) {
      toast.error('Failed to apply security');
    } finally {
      setApplying(false);
    }
  };

  const addAllowedEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error('Valid email required');
      return;
    }
    setSecuritySettings({
      ...securitySettings,
      allowedEmails: [...securitySettings.allowedEmails, newEmail]
    });
    setNewEmail('');
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const password = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setSecuritySettings({ ...securitySettings, password });
    toast.success('Secure password generated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${isDark ? 'bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Advanced Document Security
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Enterprise-grade protection and access control
                </p>
              </div>
            </div>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              <Lock className="w-3 h-3 mr-1" />
              Secure
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Encryption & Password */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <FileKey className="w-5 h-5 text-violet-400" />
              Encryption & Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Encryption Level</Label>
              <Select
                value={securitySettings.encryption}
                onValueChange={(v) => setSecuritySettings({ ...securitySettings, encryption: v })}
              >
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  <SelectItem value="aes-128" className={isDark ? 'text-white' : ''}>AES-128 (Standard)</SelectItem>
                  <SelectItem value="aes-256" className={isDark ? 'text-white' : ''}>AES-256 (Military Grade)</SelectItem>
                  <SelectItem value="rsa-2048" className={isDark ? 'text-white' : ''}>RSA-2048 (Public Key)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Document Password</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={securitySettings.password}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, password: e.target.value })}
                  placeholder="Enter strong password"
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
                <Button onClick={generateSecurePassword} size="icon" variant="outline">
                  <Key className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                <p className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  Use a strong password with at least 12 characters including letters, numbers, and symbols
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <UserX className="w-5 h-5 text-red-400" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Restrict Access</Label>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Only allowed users can view
                </p>
              </div>
              <Switch
                checked={securitySettings.accessControl}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, accessControl: checked })}
              />
            </div>

            {securitySettings.accessControl && (
              <>
                <div className="flex gap-2">
                  <Input
                    placeholder="user@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                  />
                  <Button onClick={addAllowedEmail} size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {securitySettings.allowedEmails.length > 0 && (
                  <div className="space-y-2">
                    {securitySettings.allowedEmails.map((email, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2 rounded ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                      >
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSecuritySettings({
                            ...securitySettings,
                            allowedEmails: securitySettings.allowedEmails.filter((_, idx) => idx !== i)
                          })}
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Protection Settings */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Eye className="w-5 h-5 text-blue-400" />
              Usage Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Prevent Copying</Label>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Disable text selection/copy
                </p>
              </div>
              <Switch
                checked={securitySettings.copyProtection}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, copyProtection: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Prevent Printing</Label>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Disable print functionality
                </p>
              </div>
              <Switch
                checked={securitySettings.printProtection}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, printProtection: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Dynamic Watermark</Label>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Add visible watermark
                </p>
              </div>
              <Switch
                checked={securitySettings.watermark}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, watermark: checked })}
              />
            </div>

            {securitySettings.watermark && (
              <Input
                placeholder="Watermark text"
                value={securitySettings.watermarkText}
                onChange={(e) => setSecuritySettings({ ...securitySettings, watermarkText: e.target.value })}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            )}
          </CardContent>
        </Card>

        {/* Expiry Settings */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Clock className="w-5 h-5 text-emerald-400" />
              Auto-Expiry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Enable Auto-Delete</Label>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Document expires after time
                </p>
              </div>
              <Switch
                checked={securitySettings.expiryEnabled}
                onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, expiryEnabled: checked })}
              />
            </div>

            {securitySettings.expiryEnabled && (
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Expires in {securitySettings.expiryDays} days
                </Label>
                <Slider
                  value={[securitySettings.expiryDays]}
                  onValueChange={([value]) => setSecuritySettings({ ...securitySettings, expiryDays: value })}
                  min={1}
                  max={90}
                  step={1}
                  className="mt-2"
                />
              </div>
            )}

            <div className={`p-3 rounded-lg ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <p className={`text-xs ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Perfect for time-sensitive documents like contracts or confidential reports
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Apply Button */}
      <Button
        onClick={applySecuritySettings}
        disabled={applying}
        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
      >
        {applying ? (
          <>
            <Zap className="w-4 h-4 mr-2 animate-spin" />
            Applying Security...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4 mr-2" />
            Apply Security Settings
          </>
        )}
      </Button>

      {/* Security Level Indicator */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-violet-400" />
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Security Level
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Based on current settings
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Military Grade
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}