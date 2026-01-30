import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AutoCloudSync({ document, isDark = true }) {
  const [syncing, setSyncing] = useState(false);
  const [providers, setProviders] = useState({
    googledrive: true,
    dropbox: false,
    onedrive: false,
    box: false
  });

  const syncToCloud = async () => {
    const selectedProviders = Object.keys(providers).filter(p => providers[p]);
    
    if (selectedProviders.length === 0) {
      toast.error('Select at least one provider');
      return;
    }

    setSyncing(true);
    try {
      const response = await base44.functions.invoke('cloudStorageSync', {
        provider: 'auto_sync',
        action: 'sync',
        data: {
          documentId: document.id,
          providers: selectedProviders
        }
      });

      if (response.data.success) {
        toast.success('Document synced to cloud');
      }
    } catch (error) {
      toast.error('Sync failed');
      console.error(error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-violet-400" />
          Auto Cloud Sync
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {Object.keys(providers).map(provider => (
            <div key={provider} className="flex items-center gap-2">
              <Checkbox
                checked={providers[provider]}
                onCheckedChange={(checked) => 
                  setProviders({ ...providers, [provider]: checked })
                }
              />
              <label className="capitalize">{provider.replace('drive', ' Drive')}</label>
            </div>
          ))}
        </div>

        <Button
          onClick={syncToCloud}
          disabled={syncing}
          className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          {syncing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Sync to Cloud
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}