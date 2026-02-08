import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Clock,
  User,
  GitBranch,
  Download,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function VersionHistory({ 
  versions = [], 
  onRestoreVersion,
  isDark = true 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <GitBranch className="w-4 h-4 text-violet-400" />
          Version History
        </h3>
        <Badge variant="secondary" className="text-xs">
          {versions.length} versions
        </Badge>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {versions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No version history yet
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
              Versions are created automatically when you save
            </p>
          </div>
        ) : (
          versions.slice().reverse().map((version, index) => {
            const isLatest = index === 0;
            
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  isLatest
                    ? isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-200'
                    : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isLatest
                        ? 'bg-violet-500 text-white'
                        : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <span className="text-xs font-bold">v{version.version}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Version {version.version}
                        </span>
                        {isLatest && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {version.changes}
                      </p>
                    </div>
                  </div>
                  {!isLatest && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRestoreVersion?.(version)}
                      className="w-7 h-7"
                      title="Restore this version"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <User className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                      {version.author}
                    </span>
                  </div>
                  <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                      {new Date(version.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className={`p-3 rounded-lg ${isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
        <p className={`text-xs ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
          💡 <strong>Tip:</strong> Versions are created when you click "Save" or "Version". You can restore any previous version.
        </p>
      </div>
    </div>
  );
}