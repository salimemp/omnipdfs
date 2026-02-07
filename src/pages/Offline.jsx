import React from 'react';
import { motion } from 'framer-motion';
import { WifiOff, Download, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import OfflineDocumentViewer from '@/components/shared/OfflineDocumentViewer';

export default function OfflinePage({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [autoCache, setAutoCache] = React.useState(
    localStorage.getItem('offline_auto_cache') === 'true'
  );

  const toggleAutoCache = (enabled) => {
    setAutoCache(enabled);
    localStorage.setItem('offline_auto_cache', enabled.toString());
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <WifiOff className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Offline Access
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage documents for offline viewing
          </p>
        </div>
      </motion.div>

      {/* Settings Card */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Auto-cache recent documents
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Automatically save recently viewed documents for offline access
                </p>
              </div>
            </div>
            <Switch checked={autoCache} onCheckedChange={toggleAutoCache} />
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className={isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Download className={`w-5 h-5 mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <div>
              <p className={`font-medium mb-2 ${isDark ? 'text-cyan-300' : 'text-cyan-900'}`}>
                How offline access works
              </p>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                <li>• Documents are cached locally on your device</li>
                <li>• Access your files even without internet connection</li>
                <li>• Changes sync automatically when you're back online</li>
                <li>• Cached data is stored securely in your browser</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Documents */}
      <OfflineDocumentViewer isDark={isDark} />
    </div>
  );
}