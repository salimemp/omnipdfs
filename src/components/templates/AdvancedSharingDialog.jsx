import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Copy, Mail, Link, Clock, Lock, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdvancedSharingDialog({ template, open, onOpenChange, isDark }) {
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');
  const [expiryDays, setExpiryDays] = useState('');
  const [requirePassword, setRequirePassword] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [sharedWith, setSharedWith] = useState(template?.shared_with || []);

  const generateShareLink = () => {
    const link = `${window.location.origin}/templates/${template.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard');
  };

  const shareViaEmail = async () => {
    if (!shareEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await base44.integrations.Core.SendEmail({
        to: shareEmail,
        subject: `Template Shared: ${template.name}`,
        body: `
          You've been given ${sharePermission} access to the template "${template.name}".
          
          View template: ${window.location.origin}/templates/${template.id}
          ${requirePassword ? `\nPassword: ${sharePassword}` : ''}
          ${expiryDays ? `\nAccess expires in ${expiryDays} days` : ''}
        `
      });

      const updatedShared = [...sharedWith, {
        email: shareEmail,
        permission: sharePermission,
        shared_date: new Date().toISOString(),
        expiry_date: expiryDays ? new Date(Date.now() + expiryDays * 86400000).toISOString() : null
      }];

      await base44.entities.Template.update(template.id, {
        shared_with: updatedShared,
        is_shared: true
      });

      setSharedWith(updatedShared);
      setShareEmail('');
      toast.success('Template shared successfully');
    } catch (e) {
      toast.error('Failed to share template');
    }
  };

  const removeAccess = async (email) => {
    const updatedShared = sharedWith.filter(s => s.email !== email);
    
    try {
      await base44.entities.Template.update(template.id, {
        shared_with: updatedShared,
        is_shared: updatedShared.length > 0
      });

      setSharedWith(updatedShared);
      toast.success('Access removed');
    } catch (e) {
      toast.error('Failed to remove access');
    }
  };

  const permissionIcons = {
    view: <Eye className="w-3 h-3" />,
    edit: <Edit className="w-3 h-3" />,
    admin: <Lock className="w-3 h-3" />
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Share2 className="w-5 h-5 text-violet-400" />
            Share Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Share Link */}
          <div className="space-y-2">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Quick Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/templates/${template?.id}`}
                readOnly
                className={isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : ''}
              />
              <Button onClick={generateShareLink} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share via Email */}
          <div className="space-y-3">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Share via Email</Label>
            
            <Input
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Permission Level
                </Label>
                <Select value={sharePermission} onValueChange={setSharePermission}>
                  <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="edit">Can Edit</SelectItem>
                    <SelectItem value="admin">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Expires In (days)
                </Label>
                <Input
                  type="number"
                  placeholder="Never"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Require Password
              </Label>
              <Switch
                checked={requirePassword}
                onCheckedChange={setRequirePassword}
              />
            </div>

            {requirePassword && (
              <Input
                type="text"
                placeholder="Enter password"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            )}

            <Button onClick={shareViaEmail} className="w-full bg-gradient-to-r from-violet-500 to-cyan-500">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </div>

          {/* Shared With List */}
          {sharedWith.length > 0 && (
            <div className="space-y-2">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Shared With ({sharedWith.length})
              </Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {sharedWith.map((share, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? 'bg-slate-800' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-violet-500/20' : 'bg-violet-100'
                      }`}>
                        {share.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {share.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            {permissionIcons[share.permission]}
                            {share.permission}
                          </Badge>
                          {share.expiry_date && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Expires {new Date(share.expiry_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeAccess(share.email)}
                      className="h-8 w-8 text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}