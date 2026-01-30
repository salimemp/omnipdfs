import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function CloudSyncConflictResolver({ conflicts = [], onResolve, isDark }) {
  const [resolving, setResolving] = useState({});

  const mockConflicts = conflicts.length === 0 ? [
    {
      id: '1',
      fileName: 'Q4_Report.pdf',
      cloudVersion: { modified: '2026-01-30T10:30:00', size: 2400000, source: 'Google Drive' },
      localVersion: { modified: '2026-01-30T11:00:00', size: 2450000, source: 'Local' },
      type: 'modified'
    }
  ] : conflicts;

  const resolveConflict = async (conflictId, resolution) => {
    setResolving(prev => ({ ...prev, [conflictId]: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onResolve) {
        onResolve(conflictId, resolution);
      }
      
      toast.success(`Conflict resolved: ${resolution === 'cloud' ? 'Using cloud version' : 'Using local version'}`);
    } catch (error) {
      toast.error('Failed to resolve conflict');
    } finally {
      setResolving(prev => ({ ...prev, [conflictId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Sync Conflicts ({mockConflicts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockConflicts.map((conflict) => (
            <motion.div
              key={conflict.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${isDark ? 'bg-slate-800/50 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <FileText className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'} shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {conflict.fileName}
                  </h4>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                    {conflict.type === 'modified' ? 'Modified in both locations' : 'Conflict detected'}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className={`text-xs font-medium mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    {conflict.cloudVersion.source}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3" />
                      {new Date(conflict.cloudVersion.modified).toLocaleString()}
                    </div>
                    <div>Size: {(conflict.cloudVersion.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                  <div className={`text-xs font-medium mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {conflict.localVersion.source}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3" />
                      {new Date(conflict.localVersion.modified).toLocaleString()}
                    </div>
                    <div>Size: {(conflict.localVersion.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => resolveConflict(conflict.id, 'cloud')}
                  disabled={resolving[conflict.id]}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Use Cloud Version
                </Button>
                <Button
                  onClick={() => resolveConflict(conflict.id, 'local')}
                  disabled={resolving[conflict.id]}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Use Local Version
                </Button>
              </div>
            </motion.div>
          ))}

          {mockConflicts.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No Conflicts
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                All files are in sync
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}