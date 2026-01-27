import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BatchConversionProgress({ files, isDark }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [avgTimePerFile, setAvgTimePerFile] = useState(5); // seconds

  const completedCount = files.filter(f => f.status === 'completed').length;
  const failedCount = files.filter(f => f.status === 'failed').length;
  const processingCount = files.filter(f => f.status === 'processing').length;
  const percentage = Math.round((completedCount / files.length) * 100);

  useEffect(() => {
    const remaining = files.length - completedCount - failedCount;
    const estimatedSeconds = remaining * avgTimePerFile;
    setTimeRemaining(estimatedSeconds);

    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [completedCount, failedCount, files.length, avgTimePerFile]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <CardTitle className={`flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <span>Batch Conversion Progress</span>
          <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}>
            {completedCount} / {files.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Overall Progress
            </span>
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {percentage}%
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Time Remaining</span>
            </div>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {timeRemaining !== null ? formatTime(timeRemaining) : '--'}
            </p>
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Processing</span>
            </div>
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {processingCount}
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {files.map((file, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className={`text-sm truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {file.name}
                </span>
              </div>
              {file.status === 'completed' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              {file.status === 'processing' && (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              )}
              {file.status === 'failed' && (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}