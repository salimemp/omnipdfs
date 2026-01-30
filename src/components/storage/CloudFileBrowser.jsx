import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Folder, File, Download, Upload, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function CloudFileBrowser({ service, isDark }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState({});
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    if (autoSync) {
      const interval = setInterval(() => {
        fetchFiles(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoSync]);

  const fetchFiles = async (silent = false) => {
    if (!silent) setLoading(true);
    
    try {
      const functionMap = {
        'google-drive': 'googleDriveImport',
        'onedrive': 'oneDriveIntegration',
        'dropbox': 'dropboxIntegration',
        'box': 'boxIntegration'
      };

      const result = await base44.functions.invoke(functionMap[service.id], { action: 'list' });
      
      if (result.data.success) {
        setFiles(result.data.files || []);
        if (!silent) toast.success('Files loaded');
      }
    } catch (error) {
      if (!silent) toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file) => {
    const fileKey = file.id || file.path_display;
    setSyncing(prev => ({ ...prev, [fileKey]: 'downloading' }));

    try {
      const functionMap = {
        'google-drive': 'googleDriveImport',
        'onedrive': 'oneDriveIntegration',
        'dropbox': 'dropboxIntegration',
        'box': 'boxIntegration'
      };

      const idKey = service.id === 'dropbox' ? 'path' : service.id === 'onedrive' ? 'itemId' : 'fileId';
      
      const result = await base44.functions.invoke(functionMap[service.id], {
        action: 'download',
        [idKey]: fileKey
      });

      if (result.data.success) {
        await base44.entities.Document.create({
          name: file.name,
          file_url: result.data.fileUrl,
          file_type: 'pdf',
          file_size: file.size || 0,
          tags: [service.id, 'synced']
        });

        setSyncing(prev => ({ ...prev, [fileKey]: 'completed' }));
        toast.success(`Downloaded ${file.name}`);
        
        setTimeout(() => {
          setSyncing(prev => ({ ...prev, [fileKey]: null }));
        }, 2000);
      }
    } catch (error) {
      setSyncing(prev => ({ ...prev, [fileKey]: 'error' }));
      toast.error('Download failed');
      
      setTimeout(() => {
        setSyncing(prev => ({ ...prev, [fileKey]: null }));
      }, 2000);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [service]);

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {service.icon}
            {service.name} Files
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoSync(!autoSync)}
              className={autoSync ? 'border-emerald-500 text-emerald-400' : ''}
            >
              {autoSync ? <CheckCircle2 className="w-4 h-4 mr-1" /> : null}
              Auto-Sync
            </Button>
            <Button size="sm" variant="outline" onClick={() => fetchFiles()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((file, index) => {
              const fileKey = file.id || file.path_display;
              const syncStatus = syncing[fileKey];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-100 hover:bg-slate-200'} transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-violet-500'} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {file.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => downloadFile(file)}
                    disabled={syncStatus === 'downloading'}
                    className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
                  >
                    {syncStatus === 'downloading' && <Loader2 className="w-4 h-4 animate-spin" />}
                    {syncStatus === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                    {!syncStatus && <Download className="w-4 h-4" />}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}