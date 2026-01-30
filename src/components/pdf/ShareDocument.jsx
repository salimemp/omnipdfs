import React, { useState } from 'react';
import { Share2, Link2, Mail, Users, Lock, Unlock, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ShareDocument({ document, isDark }) {
  const [shareLink, setShareLink] = useState('');
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [settings, setSettings] = useState({
    access: 'view',
    password: '',
    expiry: '',
    allowDownload: true,
    requireAuth: false,
  });
  const [emailRecipients, setEmailRecipients] = useState('');

  const generateShareLink = async () => {
    const link = `${window.location.origin}/share/${document?.id || 'abc123'}`;
    setShareLink(link);
    setLinkGenerated(true);

    await base44.entities.Document.update(document.id, {
      is_shared: true,
      shared_with: [...(document.shared_with || []), ...emailRecipients.split(',').map(e => e.trim()).filter(Boolean)]
    });

    await base44.entities.ActivityLog.create({
      action: 'share',
      document_id: document?.id,
      document_name: document?.name,
      details: { type: 'link_generated', access: settings.access, settings }
    });

    toast.success('Share link generated');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  const shareViaEmail = async () => {
    if (!emailRecipients) {
      toast.error('Please add recipients');
      return;
    }

    const emails = emailRecipients.split(',').map(e => e.trim());
    
    toast.promise(
      async () => {
        await base44.entities.Document.update(document.id, {
          is_shared: true,
          shared_with: [...new Set([...(document.shared_with || []), ...emails])]
        });

        for (const email of emails) {
          await base44.integrations.Core.SendEmail({
            to: email,
            subject: `Document shared: ${document.name}`,
            body: `You have been granted ${settings.access} access to: ${document.name}\n\nAccess link: ${shareLink || window.location.origin + '/share/' + document.id}\n\n${settings.password ? 'Password protection enabled.' : ''}\n${settings.expiry ? `Link expires: ${new Date(settings.expiry).toLocaleDateString()}` : ''}`
          });
        }

        await base44.entities.ActivityLog.create({
          action: 'share',
          document_id: document?.id,
          document_name: document?.name,
          details: { type: 'email_share', recipients: emails, access: settings.access }
        });
        
        setEmailRecipients('');
      },
      {
        loading: 'Sending emails...',
        success: 'Document shared via email!',
        error: 'Failed to send emails'
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Share2 className="w-5 h-5 text-violet-400" />
            Share Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Access Level</Label>
            <Select value={settings.access} onValueChange={(v) => setSettings({ ...settings, access: v })}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="comment">Can Comment</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Password Protection</Label>
              <Switch
                checked={!!settings.password}
                onCheckedChange={(checked) => setSettings({ ...settings, password: checked ? 'temp' : '' })}
              />
            </div>
            {settings.password && (
              <Input
                type="password"
                placeholder="Enter password"
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Allow Download</Label>
            <Switch
              checked={settings.allowDownload}
              onCheckedChange={(v) => setSettings({ ...settings, allowDownload: v })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Require Authentication</Label>
            <Switch
              checked={settings.requireAuth}
              onCheckedChange={(v) => setSettings({ ...settings, requireAuth: v })}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Link Expiry (optional)</Label>
            <Input
              type="date"
              value={settings.expiry}
              onChange={(e) => setSettings({ ...settings, expiry: e.target.value })}
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <Button onClick={generateShareLink} className="w-full bg-violet-500">
            <Link2 className="w-4 h-4 mr-2" />
            Generate Share Link
          </Button>

          {linkGenerated && (
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className={`flex-1 ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}
                />
                <Button size="icon" onClick={copyLink} className="bg-violet-500">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {settings.password ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                  {settings.access}
                </Badge>
                {settings.expiry && (
                  <Badge variant="outline" className="text-xs">
                    Expires: {new Date(settings.expiry).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Mail className="w-5 h-5 text-violet-400" />
            Share via Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Email Recipients</Label>
            <Input
              value={emailRecipients}
              onChange={(e) => setEmailRecipients(e.target.value)}
              placeholder="email1@example.com, email2@example.com"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
          </div>

          <Button onClick={shareViaEmail} className="w-full bg-violet-500">
            <Mail className="w-4 h-4 mr-2" />
            Share via Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}