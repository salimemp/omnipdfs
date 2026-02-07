import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, RefreshCw, FileText, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { loadFromOffline, saveForOffline } from './OfflineManager';

export default function OfflineDocumentViewer({ isDark = true }) {
  const [offlineDocs, setOfflineDocs] = useState([]);

  useEffect(() => {
    loadOfflineDocuments();
  }, []);

  const loadOfflineDocuments = () => {
    const docs = loadFromOffline('documents') || [];
    setOfflineDocs(docs);
  };

  const removeFromOffline = (docId) => {
    const updated = offlineDocs.filter(d => d.id !== docId);
    setOfflineDocs(updated);
    saveForOffline('documents', updated);
    toast.success('Removed from offline storage');
  };

  const clearAllOffline = () => {
    setOfflineDocs([]);
    saveForOffline('documents', []);
    toast.success('All offline documents cleared');
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const totalSize = offlineDocs.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-violet-400" />
            Offline Documents
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={isDark ? 'text-slate-400' : ''}>
              {offlineDocs.length} docs • {formatBytes(totalSize)}
            </Badge>
            {offlineDocs.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearAllOffline}
                className="text-rose-400 hover:text-rose-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {offlineDocs.length > 0 ? (
          <div className="space-y-2">
            {offlineDocs.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                } hover:border-violet-500/50 transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg ${
                      isDark ? 'bg-slate-700' : 'bg-slate-200'
                    } flex items-center justify-center`}>
                      <FileText className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {doc.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {formatBytes(doc.file_size || 0)} • Cached offline
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromOffline(doc.id)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <WifiOff className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No documents cached for offline access
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Download documents to access them offline
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}