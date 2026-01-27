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
  const [versions, setVersions] = useState([
    { id: 1, version: 'v1.0', author: 'John Doe', date: new Date(), notes: 'Initial version', isCurrent: false },
    { id: 2, version: 'v1.1', author: 'Jane Smith', date: new Date(), notes: 'Added new section', isCurrent: false },
    { id: 3, version: 'v2.0', author: 'You', date: new Date(), notes: 'Major revision', isCurrent: true },
  ]);
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [creating, setCreating] = useState(false);

  const createVersion = async () => {
    if (!newVersionNotes) {
      toast.error('Please add version notes');
      return;
    }

    const latestVersion = versions[versions.length - 1];
    const versionNumber = parseFloat(latestVersion.version.replace('v', '')) + 0.1;
    
    const newVersion = {
      id: Date.now(),
      version: `v${versionNumber.toFixed(1)}`,
      author: 'You',
      date: new Date(),
      notes: newVersionNotes,
      isCurrent: true
    };

    setVersions(versions.map(v => ({ ...v, isCurrent: false })).concat(newVersion));
    setNewVersionNotes('');
    setCreating(false);
    toast.success('New version created');

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: document?.id,
      details: { type: 'version_created', version: newVersion.version }
    });
  };

  const restoreVersion = async (version) => {
    setVersions(versions.map(v => ({ ...v, isCurrent: v.id === version.id })));
    toast.success(`Restored to ${version.version}`);
  };

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
                    {version.notes}
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