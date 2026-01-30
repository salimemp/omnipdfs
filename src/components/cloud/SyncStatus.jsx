import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SyncStatus({ service, lastSync, syncing, onSync, isDark }) {
  const [status, setStatus] = useState('idle');
  
  useEffect(() => {
    if (syncing) {
      setStatus('syncing');
    } else if (lastSync) {
      const timeSince = Date.now() - new Date(lastSync).getTime();
      setStatus(timeSince < 60000 ? 'synced' : 'outdated');
    } else {
      setStatus('never');
    }
  }, [syncing, lastSync]);

  const statusConfig = {
    idle: { icon: Cloud, color: 'text-slate-400', text: 'Ready' },
    syncing: { icon: Loader2, color: 'text-blue-400', text: 'Syncing...', spin: true },
    synced: { icon: CheckCircle2, color: 'text-emerald-400', text: 'Synced' },
    outdated: { icon: RefreshCw, color: 'text-amber-400', text: 'Sync needed' },
    error: { icon: AlertCircle, color: 'text-red-400', text: 'Sync failed' },
    never: { icon: Cloud, color: 'text-slate-500', text: 'Not synced' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
      <Icon className={`w-5 h-5 ${config.color} ${config.spin ? 'animate-spin' : ''}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {service}
        </p>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {config.text}
          {lastSync && status === 'synced' && ` - ${new Date(lastSync).toLocaleTimeString()}`}
        </p>
      </div>
      {!syncing && status !== 'syncing' && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onSync}
          className={isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}