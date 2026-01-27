import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  GitBranch, Clock, User, CheckCircle2, RotateCcw,
  GitCommit, GitMerge, Download, Eye, Plus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import moment from 'moment';

export default function VersionControl({ template, onRestore, isDark = true }) {
  const [versions, setVersions] = useState([
    {
      id: 1,
      version: '3.0',
      author: 'admin@company.com',
      date: '2026-01-27T10:30:00',
      message: 'Added new field validations and improved layout',
      changes: ['Added email validation', 'Updated color scheme', 'Fixed spacing issues']
    },
    {
      id: 2,
      version: '2.1',
      author: 'editor@company.com',
      date: '2026-01-20T14:22:00',
      message: 'Minor field adjustments',
      changes: ['Renamed company field', 'Added optional phone number']
    },
    {
      id: 3,
      version: '2.0',
      author: 'admin@company.com',
      date: '2026-01-15T09:15:00',
      message: 'Major restructure of template sections',
      changes: ['Reorganized sections', 'Added new fields', 'Improved styling']
    }
  ]);
  const [showCommitDialog, setShowCommitDialog] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [showCompare, setShowCompare] = useState(null);

  const createVersion = () => {
    if (!commitMessage.trim()) {
      toast.error('Please enter a commit message');
      return;
    }

    const newVersion = {
      id: versions.length + 1,
      version: `${versions.length + 1}.0`,
      author: 'current@user.com',
      date: new Date().toISOString(),
      message: commitMessage,
      changes: ['Current changes']
    };

    setVersions([newVersion, ...versions]);
    setCommitMessage('');
    setShowCommitDialog(false);
    toast.success('Version created');
  };

  const restoreVersion = (version) => {
    onRestore?.(version);
    toast.success(`Restored to version ${version.version}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-violet-400" />
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Version History
          </h4>
          <Badge variant="outline" className={isDark ? 'border-slate-700' : ''}>
            {versions.length} versions
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCommitDialog(true)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          Save Version
        </Button>
      </div>

      {/* Version Timeline */}
      <div className="space-y-3">
        {versions.map((version, i) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl p-4 border ${
              i === 0
                ? isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-200'
                : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  i === 0 ? 'bg-violet-500/20' : isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  <GitCommit className={`w-5 h-5 ${i === 0 ? 'text-violet-400' : isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Version {version.version}
                    </p>
                    {i === 0 && (
                      <Badge className="bg-violet-500/20 text-violet-400">Current</Badge>
                    )}
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {version.message}
                  </p>
                </div>
              </div>
              {i > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => restoreVersion(version)}
                  className={isDark ? 'border-slate-700 text-slate-300' : ''}
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restore
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs mt-3">
              <span className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <User className="w-3 h-3" />
                {version.author}
              </span>
              <span className={`flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock className="w-3 h-3" />
                {moment(version.date).fromNow()}
              </span>
            </div>

            {version.changes?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Changes:</p>
                <ul className="space-y-1">
                  {version.changes.map((change, j) => (
                    <li key={j} className={`text-xs flex gap-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create Version Dialog */}
      <Dialog open={showCommitDialog} onOpenChange={setShowCommitDialog}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Save New Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Version Message
              </label>
              <Textarea
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Describe the changes in this version..."
                className={`h-24 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommitDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button onClick={createVersion} className="bg-gradient-to-r from-violet-500 to-cyan-500">
              Save Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}