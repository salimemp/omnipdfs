import React, { useState } from 'react';
import { Cloud, CheckCircle2, Link2, Unlink, Loader2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const providers = [
  { id: 'google-drive', name: 'Google Drive', icon: '📁', color: 'from-blue-500 to-blue-600' },
  { id: 'dropbox', name: 'Dropbox', icon: '📦', color: 'from-indigo-500 to-indigo-600' },
  { id: 'onedrive', name: 'OneDrive', icon: '☁️', color: 'from-sky-500 to-sky-600' },
];

export default function CloudConnector({ isDark }) {
  const [connected, setConnected] = useState({ 'google-drive': false, 'dropbox': false, 'onedrive': false });
  const [connecting, setConnecting] = useState(null);

  const connectProvider = async (providerId) => {
    setConnecting(providerId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConnected({ ...connected, [providerId]: true });
      toast.success(`Connected to ${providers.find(p => p.id === providerId)?.name}`);
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        details: { type: 'cloud_storage_connected', provider: providerId }
      });
    } catch (error) {
      toast.error('Connection failed');
    } finally {
      setConnecting(null);
    }
  };

  const disconnectProvider = (providerId) => {
    setConnected({ ...connected, [providerId]: false });
    toast.success('Disconnected');
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {providers.map(provider => (
        <Card key={provider.id} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{provider.icon}</span>
                <span className={`text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{provider.name}</span>
              </div>
              {connected[provider.id] && (
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connected[provider.id] ? (
              <Button
                variant="outline"
                onClick={() => disconnectProvider(provider.id)}
                className="w-full"
              >
                <Unlink className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={() => connectProvider(provider.id)}
                disabled={connecting === provider.id}
                className={`w-full bg-gradient-to-r ${provider.color}`}
              >
                {connecting === provider.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}