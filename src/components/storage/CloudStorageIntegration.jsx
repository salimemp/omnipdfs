import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Cloud, Upload, Download, CheckCircle2, Loader2,
  FolderOpen, FileText, Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';

export default function CloudStorageIntegration({ isDark = true }) {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState({
    googledrive: true,
    dropbox: false,
    onedrive: false,
    box: false
  });

  const cloudProviders = [
    { 
      id: 'googledrive', 
      name: 'Google Drive', 
      color: 'from-blue-500 to-cyan-500',
      icon: '📁'
    },
    { 
      id: 'dropbox', 
      name: 'Dropbox', 
      color: 'from-blue-600 to-indigo-600',
      icon: '📦'
    },
    { 
      id: 'onedrive', 
      name: 'OneDrive', 
      color: 'from-blue-400 to-cyan-400',
      icon: '☁️'
    },
    { 
      id: 'box', 
      name: 'Box', 
      color: 'from-blue-700 to-purple-700',
      icon: '📮'
    }
  ];

  const importFromCloud = async (provider) => {
    setLoading(true);
    try {
      const result = await base44.functions.invoke(`${provider}Integration`, {
        action: 'list'
      });

      if (result.success) {
        toast.success(`Connected to ${provider}`);
      }
    } catch (e) {
      toast.error(`Failed to connect to ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const syncToCloud = async (provider, documentId) => {
    setLoading(true);
    try {
      await base44.functions.invoke(`${provider}Integration`, {
        action: 'upload',
        documentId
      });

      toast.success(`Synced to ${provider}`);
    } catch (e) {
      toast.error('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Cloud className="w-5 h-5 text-cyan-400" />
          Cloud Storage Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cloudProviders.map((provider) => {
            const isConnected = connections[provider.id];
            
            return (
              <motion.div
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {provider.name}
                      </h4>
                      {isConnected && (
                        <Badge className="mt-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => importFromCloud(provider.id)}
                    disabled={loading || !isConnected}
                    className={`flex-1 ${isDark ? 'border-slate-600' : ''}`}
                  >
                    {loading ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3 mr-1" />
                    )}
                    Import
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => syncToCloud(provider.id)}
                    disabled={loading || !isConnected}
                    className={`flex-1 ${isDark ? 'border-slate-600' : ''}`}
                  >
                    <Upload className="w-3 h-3 mr-1" />
                    Sync
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
          <div className="flex items-start gap-2">
            <LinkIcon className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                Auto-Sync Enabled
              </p>
              <p className={`text-xs ${isDark ? 'text-blue-400/70' : 'text-blue-600'}`}>
                Documents automatically sync across all connected storage providers
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}