import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, RotateCcw, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function VersionControl({ documentId, isDark = true }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documentId) {
      loadVersions();
    }
  }, [documentId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const response = await base44.functions.invoke('documentVersioning', {
        action: 'list_versions',
        documentId
      });

      if (response.data.success) {
        setVersions(response.data.versions.reverse());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const restoreVersion = async (version) => {
    try {
      const response = await base44.functions.invoke('documentVersioning', {
        action: 'restore_version',
        documentId,
        versionData: { version: version.version }
      });

      if (response.data.success) {
        toast.success('Version restored successfully');
        loadVersions();
      }
    } catch (error) {
      toast.error('Failed to restore version');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-400" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-6 h-6 border-4 border-violet-500 border-t-transparent rounded-full" />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No version history available
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version, idx) => (
              <motion.div
                key={version.version}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border ${
                  idx === 0 
                    ? isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-200'
                    : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={idx === 0 ? 'bg-violet-500' : ''}>
                      v{version.version}
                    </Badge>
                    {idx === 0 && <Badge variant="secondary">Current</Badge>}
                  </div>
                  <div className="flex gap-2">
                    {idx !== 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restoreVersion(version)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(version.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {version.changes}
                </p>

                <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {version.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(version.created_at)}
                  </div>
                  {version.file_size && (
                    <span>{formatSize(version.file_size)}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}