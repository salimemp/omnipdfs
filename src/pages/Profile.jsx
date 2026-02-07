import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthContext';
import { base44 } from '@/api/base44Client';
import {
  User, Mail, Shield, Bell, Palette, Globe,
  Save, Camera, Key, Trash2, Download, Lock,
  Moon, Sun, Clock, Sparkles, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ProfilePage({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const { user, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      desktop: true,
      uploads: true,
      conversions: true,
      shares: true,
      comments: true,
    },
    privacy: {
      showProfile: true,
      showActivity: false,
      allowAnalytics: true,
    },
    defaults: {
      convertQuality: 'high',
      autoSave: true,
      autoTag: true,
      compression: 'medium',
    }
  });

  const saveProfile = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: profile.full_name,
        preferences: preferences
      });
      await refresh();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Profile & Settings
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Manage your account and preferences
            </p>
          </div>
        </div>
        <Button onClick={saveProfile} disabled={saving} className="bg-violet-500 hover:bg-violet-600">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </motion.div>

      {/* Profile Card */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-violet-500/30">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-3xl font-bold">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center hover:bg-violet-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.full_name || 'User'}
              </h2>
              <p className={`mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {user?.email}
              </p>
              <div className="flex gap-2">
                <Badge className="bg-violet-500/20 text-violet-300 capitalize">
                  {user?.role || 'user'}
                </Badge>
                <Badge variant="outline">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className={`grid grid-cols-4 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name" className={isDark ? 'text-slate-300' : ''}>Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className={isDark ? 'text-slate-300' : ''}>Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className={isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : ''}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-violet-400" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-violet-400" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-300' : ''}>Theme</Label>
                <Select value={preferences.theme} onValueChange={(v) => updatePreference('theme', null, v)}>
                  <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : ''}>Language</Label>
                <Select value={preferences.language} onValueChange={(v) => setPreferences({...preferences, language: v})}>
                  <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : ''}>Timezone</Label>
                <Select value={preferences.timezone} onValueChange={(v) => setPreferences({...preferences, timezone: v})}>
                  <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Default Behaviors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Auto-Save</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Automatically save documents
                  </p>
                </div>
                <Switch
                  checked={preferences.defaults.autoSave}
                  onCheckedChange={(v) => updatePreference('defaults', 'autoSave', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Auto-Tag</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    AI tags documents automatically
                  </p>
                </div>
                <Switch
                  checked={preferences.defaults.autoTag}
                  onCheckedChange={(v) => updatePreference('defaults', 'autoTag', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-violet-400" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Email Notifications</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.email}
                  onCheckedChange={(v) => updatePreference('notifications', 'email', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Desktop Notifications</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Show browser notifications
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.desktop}
                  onCheckedChange={(v) => updatePreference('notifications', 'desktop', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Upload Notifications</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    When files finish uploading
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.uploads}
                  onCheckedChange={(v) => updatePreference('notifications', 'uploads', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Conversion Notifications</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    When conversions complete
                  </p>
                </div>
                <Switch
                  checked={preferences.notifications.conversions}
                  onCheckedChange={(v) => updatePreference('notifications', 'conversions', v)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-400" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Public Profile</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Allow others to see your profile
                  </p>
                </div>
                <Switch
                  checked={preferences.privacy.showProfile}
                  onCheckedChange={(v) => updatePreference('privacy', 'showProfile', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Activity Status</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Show when you're online
                  </p>
                </div>
                <Switch
                  checked={preferences.privacy.showActivity}
                  onCheckedChange={(v) => updatePreference('privacy', 'showActivity', v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDark ? 'text-slate-300' : ''}>Analytics</Label>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Help improve OmniPDFs
                  </p>
                </div>
                <Switch
                  checked={preferences.privacy.allowAnalytics}
                  onCheckedChange={(v) => updatePreference('privacy', 'allowAnalytics', v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800 border-rose-500/20' : 'bg-white border-rose-200'}>
            <CardHeader>
              <CardTitle className="text-rose-400">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-rose-400 border-rose-500/30 hover:bg-rose-500/10">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}