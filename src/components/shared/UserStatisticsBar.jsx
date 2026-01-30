import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, HardDrive, Crown, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function UserStatisticsBar({ isDark = true }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await base44.functions.invoke('userStatistics', {});
      if (response.data.success) {
        setStats(response.data.statistics);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2">
            <div className={`h-4 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <div className={`h-4 rounded w-5/6 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {stats.status === 'premium' ? (
              <Crown className="w-5 h-5 text-amber-400" />
            ) : (
              <User className="w-5 h-5 text-violet-400" />
            )}
            <Badge variant={stats.status === 'premium' ? 'default' : 'secondary'}>
              {stats.status === 'premium' ? 'Premium' : 'Free'} Account
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-violet-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Files</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {stats.total_files}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Conversions</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {stats.total_conversions}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Storage</span>
            </div>
            <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatBytes(stats.total_storage)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Storage Used
            </span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {formatBytes(stats.total_storage)} / {formatBytes(stats.storage_limit)}
            </span>
          </div>
          <Progress 
            value={Math.min(stats.storage_percentage, 100)} 
            className="h-2"
          />
        </div>
      </div>
    </motion.div>
  );
}