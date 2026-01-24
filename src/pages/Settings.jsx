import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Key,
  Trash2,
  Download,
  Clock,
  HardDrive,
  CheckCircle2,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    auto_delete_hours: 24,
    default_quality: 'high',
    ocr_default: false,
    compress_default: false,
    email_notifications: true,
    security_alerts: true,
    conversion_complete: true,
    language: 'en',
    timezone: 'UTC',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        if (userData.settings) {
          setSettings(prev => ({ ...prev, ...userData.settings }));
        }
      } catch (e) {}
    };
    fetchUser();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ settings });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </motion.div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
          <TabsTrigger value="account" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-slate-400">
            <User className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-slate-400">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-slate-400">
            <Palette className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-slate-400">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Update your account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Full Name</Label>
                    <Input
                      value={user?.full_name || ''}
                      readOnly
                      className="mt-2 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-400">Email</Label>
                    <Input
                      value={user?.email || ''}
                      readOnly
                      className="mt-2 bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-violet-400" />
                  Storage
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Your cloud storage usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Used Storage</span>
                      <span className="text-white">2.4 GB of 50 GB</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        style={{ width: '4.8%' }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">
                    Upgrade to Enterprise for 1TB storage
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Auto-Delete Files
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Automatically delete files after a set period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={String(settings.auto_delete_hours)}
                  onValueChange={(v) => setSettings({ ...settings, auto_delete_hours: parseInt(v) })}
                >
                  <SelectTrigger className="w-full md:w-64 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="1" className="text-white">1 hour</SelectItem>
                    <SelectItem value="24" className="text-white">24 hours</SelectItem>
                    <SelectItem value="168" className="text-white">7 days</SelectItem>
                    <SelectItem value="720" className="text-white">30 days</SelectItem>
                    <SelectItem value="0" className="text-white">Never</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Encryption Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">AES-256 Encryption Active</p>
                      <p className="text-sm text-slate-400">All files encrypted at rest and in transit</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-violet-400" />
                    <div>
                      <p className="text-white font-medium">Zero-Knowledge Architecture</p>
                      <p className="text-sm text-slate-400">We cannot access your files</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Irreversible actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. This will permanently delete all your files, folders, and conversion history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-slate-700 text-slate-300">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                        Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Conversion Defaults</CardTitle>
                <CardDescription className="text-slate-400">
                  Set your preferred conversion settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-slate-400">Default Quality</Label>
                  <Select
                    value={settings.default_quality}
                    onValueChange={(v) => setSettings({ ...settings, default_quality: v })}
                  >
                    <SelectTrigger className="mt-2 w-full md:w-64 bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="low" className="text-white">Low (faster)</SelectItem>
                      <SelectItem value="medium" className="text-white">Medium</SelectItem>
                      <SelectItem value="high" className="text-white">High</SelectItem>
                      <SelectItem value="maximum" className="text-white">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Enable OCR by default</Label>
                    <p className="text-sm text-slate-400">Extract text from scanned documents</p>
                  </div>
                  <Switch
                    checked={settings.ocr_default}
                    onCheckedChange={(v) => setSettings({ ...settings, ocr_default: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Compress by default</Label>
                    <p className="text-sm text-slate-400">Reduce file size automatically</p>
                  </div>
                  <Switch
                    checked={settings.compress_default}
                    onCheckedChange={(v) => setSettings({ ...settings, compress_default: v })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Localization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(v) => setSettings({ ...settings, language: v })}
                    >
                      <SelectTrigger className="mt-2 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="en" className="text-white">English</SelectItem>
                        <SelectItem value="es" className="text-white">Español</SelectItem>
                        <SelectItem value="fr" className="text-white">Français</SelectItem>
                        <SelectItem value="de" className="text-white">Deutsch</SelectItem>
                        <SelectItem value="ja" className="text-white">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-slate-400">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(v) => setSettings({ ...settings, timezone: v })}
                    >
                      <SelectTrigger className="mt-2 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="UTC" className="text-white">UTC</SelectItem>
                        <SelectItem value="EST" className="text-white">Eastern (EST)</SelectItem>
                        <SelectItem value="PST" className="text-white">Pacific (PST)</SelectItem>
                        <SelectItem value="CET" className="text-white">Central European (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Email Notifications</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-sm text-slate-400">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.email_notifications}
                    onCheckedChange={(v) => setSettings({ ...settings, email_notifications: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Security Alerts</Label>
                    <p className="text-sm text-slate-400">Get notified about security events</p>
                  </div>
                  <Switch
                    checked={settings.security_alerts}
                    onCheckedChange={(v) => setSettings({ ...settings, security_alerts: v })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Conversion Complete</Label>
                    <p className="text-sm text-slate-400">Notify when large conversions finish</p>
                  </div>
                  <Switch
                    checked={settings.conversion_complete}
                    onCheckedChange={(v) => setSettings({ ...settings, conversion_complete: v })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex justify-end"
      >
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}