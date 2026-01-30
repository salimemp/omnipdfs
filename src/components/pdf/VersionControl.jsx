import React, { useState } from 'react';
import { GitBranch, Clock, User, Download, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function VersionControl({ document, isDark }) {
  const [versions, setVersions] = useState([]);
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadVersions();
  }, [document?.id]);

  const loadVersions = async () => {
    if (!document?.id) return;
    
    try {
      const collab = await base44.entities.Collaboration.filter({ document_id: document.id });
      if (collab[0]?.version_history) {
        setVersions(collab[0].version_history.map((v, i) => ({
          ...v,
          id: i + 1,
          date: new Date(v.created_at || Date.now()),
          isCurrent: i === collab[0].version_history.length - 1
        })));
      } else {
        setVersions([{
          id: 1,
          version: 'v1.0',
          author: document.created_by || 'System',
          date: new Date(document.created_date),
          notes: 'Initial version',
          isCurrent: true
        }]);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async () => {
    if (!newVersionNotes) {
      toast.error('Please add version notes');
      return;
    }

    try {
      const user = await base44.auth.me();
      const latestVersion = versions[versions.length - 1];
      const versionNumber = parseFloat(latestVersion.version.replace('v', '')) + 0.1;
      
      const newVersion = {
        version: `v${versionNumber.toFixed(1)}`,
        author: user.email,
        changes: newVersionNotes,
        created_at: new Date().toISOString()
      };

      const collab = await base44.entities.Collaboration.filter({ document_id: document.id });
      
      if (collab[0]) {
        await base44.entities.Collaboration.update(collab[0].id, {
          version_history: [...(collab[0].version_history || []), newVersion]
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: document.id,
          version_history: [newVersion]
        });
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        document_name: document?.name,
        details: { type: 'version_created', version: newVersion.version, notes: newVersionNotes }
      });

      setNewVersionNotes('');
      setCreating(false);
      toast.success('New version created');
      loadVersions();
    } catch (error) {
      toast.error('Failed to create version');
      console.error(error);
    }
  };

  const restoreVersion = async (version) => {
    try {
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        document_name: document?.name,
        details: { type: 'version_restored', version: version.version }
      });
      
      setVersions(versions.map(v => ({ ...v, isCurrent: v.version === version.version })));
      toast.success(`Restored to ${version.version}`);
    } catch (error) {
      toast.error('Failed to restore version');
    }
  };

  if (loading) {
    return <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading versions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <GitBranch className="w-5 h-5 text-violet-400" />
          Version History
        </h3>
        <Button size="sm" onClick={() => setCreating(!creating)} className="bg-violet-500">
          <Plus className="w-4 h-4 mr-2" />
          New Version
        </Button>
      </div>

      {creating && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6 space-y-3">
            <Input
              value={newVersionNotes}
              onChange={(e) => setNewVersionNotes(e.target.value)}
              placeholder="What changed in this version?"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={createVersion} className="bg-violet-500">Create</Button>
              <Button size="sm" variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {versions.slice().reverse().map((version, idx) => (
          <Card key={version.id} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${version.isCurrent ? 'ring-2 ring-violet-500/50' : ''}`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={version.isCurrent ? 'bg-violet-500' : 'bg-slate-500'}>
                      {version.version}
                    </Badge>
                    {version.isCurrent && (
                      <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {version.notes || version.changes || 'No description'}
                  </p>
                  <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {version.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(version.date, 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!version.isCurrent && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => restoreVersion(version)}
                      className={isDark ? 'text-slate-400' : 'text-slate-500'}
                      title="Restore this version"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className={isDark ? 'text-slate-400' : 'text-slate-500'}
                    title="Download this version"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}