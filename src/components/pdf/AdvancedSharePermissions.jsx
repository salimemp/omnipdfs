import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, Users, Clock, Eye, Edit, Download, Link2, Mail, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const accessRoles = [
  { id: 'viewer', name: 'Viewer', icon: Eye, permissions: ['view'], color: 'text-blue-400' },
  { id: 'commenter', name: 'Commenter', icon: Edit, permissions: ['view', 'comment'], color: 'text-cyan-400' },
  { id: 'editor', name: 'Editor', icon: Edit, permissions: ['view', 'comment', 'edit'], color: 'text-violet-400' },
  { id: 'admin', name: 'Admin', icon: Shield, permissions: ['view', 'comment', 'edit', 'share', 'delete'], color: 'text-emerald-400' }
];

export default function AdvancedSharePermissions({ document, isDark }) {
  const [shareUsers, setShareUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');
  const [linkSettings, setLinkSettings] = useState({
    enabled: false,
    role: 'viewer',
    expiresAt: '',
    maxViews: '',
    password: '',
    watermark: false,
    preventDownload: false,
    trackViews: true
  });
  const [shareLink, setShareLink] = useState('');
  const [auditLog, setAuditLog] = useState([]);

  React.useEffect(() => {
    loadSharedUsers();
    loadAuditLog();
  }, [document?.id]);

  const loadSharedUsers = async () => {
    if (!document?.shared_with) return;
    
    const users = document.shared_with.map(email => ({
      email,
      role: 'viewer',
      addedAt: new Date().toISOString()
    }));
    setShareUsers(users);
  };

  const loadAuditLog = async () => {
    try {
      const logs = await base44.entities.ActivityLog.filter({
        document_id: document.id,
        action: 'share'
      });
      setAuditLog(logs.slice(0, 10));
    } catch (error) {
      console.error('Failed to load audit log:', error);
    }
  };

  const addUser = async () => {
    if (!newUserEmail || !newUserEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (shareUsers.some(u => u.email === newUserEmail)) {
      toast.error('User already has access');
      return;
    }

    try {
      const response = await base44.functions.invoke('shareDocument', {
        documentId: document.id,
        action: 'add_user',
        data: {
          email: newUserEmail,
          role: newUserRole,
          shareLink: `${window.location.origin}/share/${document.id}`
        }
      });

      if (response.data.success) {
        const newUser = {
          email: newUserEmail,
          role: newUserRole,
          addedAt: new Date().toISOString()
        };
        
        setShareUsers([...shareUsers, newUser]);
        setNewUserEmail('');
        toast.success('User added successfully');
        loadAuditLog();
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const removeUser = async (email) => {
    try {
      await base44.entities.Document.update(document.id, {
        shared_with: (document.shared_with || []).filter(e => e !== email)
      });

      await base44.entities.ActivityLog.create({
        action: 'share',
        document_id: document.id,
        document_name: document.name,
        details: {
          type: 'user_removed',
          user_email: email
        }
      });

      setShareUsers(shareUsers.filter(u => u.email !== email));
      toast.success('User removed');
      loadAuditLog();
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  const updateUserRole = async (email, newRole) => {
    const updated = shareUsers.map(u => 
      u.email === email ? { ...u, role: newRole } : u
    );
    setShareUsers(updated);

    await base44.entities.ActivityLog.create({
      action: 'share',
      document_id: document.id,
      document_name: document.name,
      details: {
        type: 'role_changed',
        user_email: email,
        new_role: newRole
      }
    });

    toast.success('Role updated');
    loadAuditLog();
  };

  const generateShareLink = async () => {
    const link = `${window.location.origin}/share/${document.id}?access=${linkSettings.role}`;
    setShareLink(link);

    await base44.entities.ActivityLog.create({
      action: 'share',
      document_id: document.id,
      document_name: document.name,
      details: {
        type: 'link_generated',
        settings: linkSettings
      }
    });

    setLinkSettings({ ...linkSettings, enabled: true });
    toast.success('Share link generated');
    loadAuditLog();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success('Link copied to clipboard');
  };

  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList className={`grid grid-cols-3 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="link">Link Sharing</TabsTrigger>
        <TabsTrigger value="audit">Audit Log</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-5 h-5 text-violet-400" />
              Share with People
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="email@example.com"
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger className={`w-32 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessRoles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addUser} className="bg-violet-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {shareUsers.map((user) => {
                  const role = accessRoles.find(r => r.id === user.role);
                  const Icon = role?.icon;
                  
                  return (
                    <motion.div
                      key={user.email}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {Icon && <Icon className={`w-4 h-4 ${role.color}`} />}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {user.email}
                          </p>
                          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Added {new Date(user.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={user.role} onValueChange={(v) => updateUserRole(user.email, v)}>
                          <SelectTrigger className={`w-28 h-8 ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {accessRoles.map(role => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeUser(user.email)}
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Permission Levels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessRoles.map(role => {
              const Icon = role.icon;
              return (
                <div key={role.id} className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${role.color} mt-0.5`} />
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {role.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Can {role.permissions.join(', ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="link" className="space-y-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Link2 className="w-5 h-5 text-cyan-400" />
              Public Link Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Access Level</Label>
              <Select value={linkSettings.role} onValueChange={(v) => setLinkSettings({ ...linkSettings, role: v })}>
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accessRoles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Expires At</Label>
                <Input
                  type="datetime-local"
                  value={linkSettings.expiresAt}
                  onChange={(e) => setLinkSettings({ ...linkSettings, expiresAt: e.target.value })}
                  className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                />
              </div>
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Max Views</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={linkSettings.maxViews}
                  onChange={(e) => setLinkSettings({ ...linkSettings, maxViews: e.target.value })}
                  className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                />
              </div>
            </div>

            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Password (Optional)</Label>
              <Input
                type="password"
                placeholder="Leave blank for no password"
                value={linkSettings.password}
                onChange={(e) => setLinkSettings({ ...linkSettings, password: e.target.value })}
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Add Watermark</Label>
                <Switch
                  checked={linkSettings.watermark}
                  onCheckedChange={(v) => setLinkSettings({ ...linkSettings, watermark: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Prevent Download</Label>
                <Switch
                  checked={linkSettings.preventDownload}
                  onCheckedChange={(v) => setLinkSettings({ ...linkSettings, preventDownload: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Track Views</Label>
                <Switch
                  checked={linkSettings.trackViews}
                  onCheckedChange={(v) => setLinkSettings({ ...linkSettings, trackViews: v })}
                />
              </div>
            </div>

            <Button onClick={generateShareLink} className="w-full bg-violet-500">
              <Link2 className="w-4 h-4 mr-2" />
              Generate Share Link
            </Button>

            {shareLink && (
              <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className={isDark ? 'bg-slate-900 border-slate-700' : ''}
                  />
                  <Button size="icon" onClick={copyLink} className="bg-violet-500">
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {linkSettings.expiresAt && (
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Expires {new Date(linkSettings.expiresAt).toLocaleDateString()}
                    </Badge>
                  )}
                  {linkSettings.maxViews && (
                    <Badge variant="outline">Max {linkSettings.maxViews} views</Badge>
                  )}
                  {linkSettings.password && (
                    <Badge variant="outline">Password protected</Badge>
                  )}
                  {linkSettings.watermark && (
                    <Badge variant="outline">Watermarked</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audit">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Shield className="w-5 h-5 text-emerald-400" />
              Sharing Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLog.length > 0 ? (
                auditLog.map((log, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      isDark ? 'bg-slate-800/50' : 'bg-slate-50'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 text-cyan-400 mt-1" />
                    <div className="flex-1">
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {log.details?.type === 'user_added' && `Added ${log.details.user_email} as ${log.details.role}`}
                        {log.details?.type === 'user_removed' && `Removed ${log.details.user_email}`}
                        {log.details?.type === 'role_changed' && `Changed ${log.details.user_email} to ${log.details.new_role}`}
                        {log.details?.type === 'link_generated' && 'Generated share link'}
                        {log.details?.type === 'email_share' && `Shared via email with ${log.details.recipients?.length} users`}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(log.created_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No sharing activity yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}