import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  GitBranch, Clock, RotateCcw, Eye, Save, Plus, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function TemplateVersioning({ template, onRestore, isDark = true }) {
  const [changeNote, setChangeNote] = useState('');
  const [previewVersion, setPreviewVersion] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const versions = template?.template_data?.version_history || [];

  const saveVersionMutation = useMutation({
    mutationFn: async () => {
      const newVersion = {
        version: versions.length + 1,
        author: user.email,
        changes: changeNote || 'Updated template',
        created_at: new Date().toISOString(),
        content: template.template_data
      };

      const updatedHistory = [...versions, newVersion];

      await base44.entities.Template.update(template.id, {
        template_data: {
          ...template.template_data,
          version_history: updatedHistory
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      setChangeNote('');
      toast.success('Version saved');
    }
  });

  const restoreVersionMutation = useMutation({
    mutationFn: async (version) => {
      await base44.entities.Template.update(template.id, {
        template_data: version.content
      });

      const restorationNote = {
        version: versions.length + 1,
        author: user.email,
        changes: `Restored to version ${version.version}`,
        created_at: new Date().toISOString(),
        content: version.content
      };

      await base44.entities.Template.update(template.id, {
        template_data: {
          ...version.content,
          version_history: [...versions, restorationNote]
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Version restored');
      onRestore?.();
    }
  });

  if (!template) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <GitBranch className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to manage versions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <GitBranch className="w-5 h-5 text-violet-400" />
            Version Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {template.name}
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Current version: {versions.length || 1}
              </p>
            </div>
            <Badge className="bg-emerald-500">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="What changed?"
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />
            <Button
              onClick={() => saveVersionMutation.mutate()}
              disabled={saveVersionMutation.isPending}
              className="bg-violet-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Version History ({versions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No version history yet
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
                Save your first version to start tracking changes
              </p>
            </div>
          ) : (
            versions.slice().reverse().map((version, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">v{version.version}</Badge>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {version.changes}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        by {version.author?.split('@')[0]} • {moment(version.created_at).fromNow()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setPreviewVersion(version)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => restoreVersionMutation.mutate(version)}
                      disabled={restoreVersionMutation.isPending}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewVersion} onOpenChange={() => setPreviewVersion(null)}>
        <DialogContent className={`max-w-4xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Version {previewVersion?.version} Preview
            </DialogTitle>
          </DialogHeader>
          <div className={`p-6 rounded-lg max-h-96 overflow-y-auto ${isDark ? 'bg-white' : 'bg-white'}`}>
            {previewVersion?.content?.sections?.map((section, i) => (
              <div key={i} className="mb-6">
                <h3 className="text-lg font-bold text-violet-600 mb-2">
                  {section.title}
                </h3>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}