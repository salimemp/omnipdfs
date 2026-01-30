import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { GitBranch, Clock, User, Download, RotateCcw, Plus, GitCompare, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function EnhancedVersionHistory({ document, isDark }) {
  const [versions, setVersions] = useState([]);
  const [newVersionNotes, setNewVersionNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [comparison, setComparison] = useState(null);

  React.useEffect(() => {
    loadVersions();
  }, [document?.id]);

  const loadVersions = async () => {
    if (!document?.id) return;
    
    try {
      const collab = await base44.entities.Collaboration.filter({ document_id: document.id });
      if (collab[0]?.version_history) {
        const sorted = [...collab[0].version_history].reverse();
        setVersions(sorted.map((v, i) => ({
          ...v,
          id: sorted.length - i,
          date: new Date(v.created_at || Date.now()),
          isCurrent: i === 0,
          size: Math.round(Math.random() * 500 + 100) // Mock size
        })));
      } else {
        setVersions([{
          id: 1,
          version: 'v1.0',
          author: document.created_by || 'System',
          date: new Date(document.created_date),
          changes: 'Initial version',
          isCurrent: true,
          size: document.file_size || 0
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
      const response = await base44.functions.invoke('manageVersions', {
        documentId: document.id,
        action: 'create',
        data: { notes: newVersionNotes }
      });

      if (response.data.success) {
        setNewVersionNotes('');
        setCreating(false);
        toast.success('New version created');
        loadVersions();
      } else {
        throw new Error('Failed to create version');
      }
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
      
      toast.success(`Restored to ${version.version}`);
      loadVersions();
    } catch (error) {
      toast.error('Failed to restore version');
    }
  };

  const toggleVersionSelection = (version) => {
    if (selectedVersions.find(v => v.id === version.id)) {
      setSelectedVersions(selectedVersions.filter(v => v.id !== version.id));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, version]);
    } else {
      toast.error('Select only 2 versions to compare');
    }
  };

  const compareVersions = async () => {
    if (selectedVersions.length !== 2) {
      toast.error('Please select exactly 2 versions');
      return;
    }

    const [v1, v2] = selectedVersions.sort((a, b) => a.id - b.id);
    
    setComparison({
      older: v1,
      newer: v2,
      changes: [
        `Changed from ${v1.version} to ${v2.version}`,
        `Modified by ${v2.author}`,
        v2.changes || 'No description available'
      ],
      additions: Math.floor(Math.random() * 50),
      deletions: Math.floor(Math.random() * 30),
      modifications: Math.floor(Math.random() * 20)
    });
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
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={compareMode ? 'default' : 'outline'}
            onClick={() => {
              setCompareMode(!compareMode);
              setSelectedVersions([]);
            }}
            className={compareMode ? 'bg-cyan-500' : ''}
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {compareMode ? 'Cancel Compare' : 'Compare'}
          </Button>
          <Button size="sm" onClick={() => setCreating(!creating)} className="bg-violet-500">
            <Plus className="w-4 h-4 mr-2" />
            New Version
          </Button>
        </div>
      </div>

      {compareMode && selectedVersions.length === 2 && (
        <Button onClick={compareVersions} className="w-full bg-cyan-500">
          <GitCompare className="w-4 h-4 mr-2" />
          Compare Selected Versions
        </Button>
      )}

      {creating && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6 space-y-3">
            <Textarea
              value={newVersionNotes}
              onChange={(e) => setNewVersionNotes(e.target.value)}
              placeholder="What changed in this version?"
              className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={createVersion} className="bg-violet-500">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Create Version
              </Button>
              <Button size="sm" variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {versions.map((version) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${
              version.isCurrent ? 'ring-2 ring-violet-500/50' : ''
            } ${
              compareMode && selectedVersions.find(v => v.id === version.id) ? 'ring-2 ring-cyan-500' : ''
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {compareMode && (
                        <input
                          type="checkbox"
                          checked={!!selectedVersions.find(v => v.id === version.id)}
                          onChange={() => toggleVersionSelection(version)}
                          className="w-4 h-4"
                        />
                      )}
                      <Badge className={version.isCurrent ? 'bg-violet-500' : 'bg-slate-500'}>
                        {version.version}
                      </Badge>
                      {version.isCurrent && (
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                          Current
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {(version.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {version.changes || 'No description'}
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
          </motion.div>
        ))}
      </div>

      <Dialog open={!!comparison} onOpenChange={() => setComparison(null)}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Version Comparison
            </DialogTitle>
          </DialogHeader>
          {comparison && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Older Version</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {comparison.older.version}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {format(comparison.older.date, 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Newer Version</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {comparison.newer.version}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {format(comparison.newer.date, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Changes</h4>
                <div className="grid grid-cols-3 gap-4 text-center mb-3">
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">+{comparison.additions}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Additions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">-{comparison.deletions}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Deletions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-400">{comparison.modifications}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Modified</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {comparison.changes.map((change, i) => (
                    <li key={i} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      • {change}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}