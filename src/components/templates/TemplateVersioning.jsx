import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, GitBranch, User, Eye, RotateCcw, Download } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function TemplateVersioning({ templateId, onRestoreVersion, isDark }) {
  const [previewVersion, setPreviewVersion] = useState(null);

  const { data: versions = [], refetch } = useQuery({
    queryKey: ['template-versions', templateId],
    queryFn: async () => {
      const logs = await base44.entities.ActivityLog.filter({
        action: 'convert',
        document_id: templateId
      }, '-created_date', 50);
      
      return logs.filter(log => log.details?.version_data);
    },
    enabled: !!templateId
  });

  const restoreVersion = async (version) => {
    try {
      await onRestoreVersion(version.details.version_data);
      toast.success('Version restored successfully');
    } catch (e) {
      toast.error('Failed to restore version');
    }
  };

  const downloadVersion = (version) => {
    const data = JSON.stringify(version.details.version_data, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template-v${version.details.version_number}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!templateId) {
    return (
      <div className={`text-center py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No template selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <GitBranch className="w-4 h-4 text-violet-400" />
          Version History
        </h3>
        <Badge variant="outline">{versions.length} versions</Badge>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {versions.map((version, idx) => (
          <Card key={version.id} className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={idx === 0 ? "default" : "outline"} className="text-xs">
                      v{version.details.version_number || (versions.length - idx)}
                    </Badge>
                    {idx === 0 && <Badge className="text-xs bg-emerald-500">Current</Badge>}
                  </div>
                  
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {version.details.change_description || 'Template modified'}
                  </p>

                  <div className="flex items-center gap-4 text-xs">
                    <div className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <User className="w-3 h-3" />
                      {version.created_by || 'Unknown'}
                    </div>
                    <div className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <Clock className="w-3 h-3" />
                      {moment(version.created_date).fromNow()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setPreviewVersion(version)}
                    className={`h-8 w-8 ${isDark ? 'text-slate-400 hover:text-white' : ''}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {idx !== 0 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => restoreVersion(version)}
                      className={`h-8 w-8 ${isDark ? 'text-slate-400 hover:text-white' : ''}`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => downloadVersion(version)}
                    className={`h-8 w-8 ${isDark ? 'text-slate-400 hover:text-white' : ''}`}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {versions.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No version history yet</p>
          </div>
        )}
      </div>

      {/* Preview Version Dialog */}
      <Dialog open={!!previewVersion} onOpenChange={() => setPreviewVersion(null)}>
        <DialogContent className={`max-w-3xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Version {previewVersion?.details?.version_number} Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <pre className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} overflow-x-auto`}>
                {JSON.stringify(previewVersion?.details?.version_data, null, 2)}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => {
                restoreVersion(previewVersion);
                setPreviewVersion(null);
              }} className="flex-1 bg-violet-500">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore This Version
              </Button>
              <Button variant="outline" onClick={() => setPreviewVersion(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}