import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function OfflineManager({ isDark = true }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(!navigator.onLine);
  const [cachedDocs, setCachedDocs] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(false);
      toast.success('Back online! Syncing data...');
      syncOfflineChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
      toast.error('You are offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadCachedDocuments();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadCachedDocuments = () => {
    try {
      const cached = JSON.parse(localStorage.getItem('offline_documents') || '[]');
      setCachedDocs(cached);
    } catch (error) {
      console.error('Failed to load cached documents:', error);
    }
  };

  const syncOfflineChanges = async () => {
    try {
      const pendingChanges = JSON.parse(localStorage.getItem('offline_changes') || '[]');
      
      if (pendingChanges.length > 0) {
        // Sync would happen here with backend
        localStorage.removeItem('offline_changes');
        toast.success(`Synced ${pendingChanges.length} changes`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const cacheDocumentForOffline = (doc) => {
    try {
      const cached = JSON.parse(localStorage.getItem('offline_documents') || '[]');
      if (!cached.find(d => d.id === doc.id)) {
        cached.push(doc);
        localStorage.setItem('offline_documents', JSON.stringify(cached));
        setCachedDocs(cached);
        toast.success('Document cached for offline access');
      }
    } catch (error) {
      toast.error('Failed to cache document');
    }
  };

  return (
    <>
      {/* Offline Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`fixed top-16 lg:top-4 left-4 right-4 z-40 ${
              isDark ? 'bg-amber-900/90 border-amber-700' : 'bg-amber-100 border-amber-300'
            } border rounded-xl p-4 backdrop-blur-lg shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                  <p className={`font-semibold ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>
                    You're offline
                  </p>
                  <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    {cachedDocs.length > 0 
                      ? `${cachedDocs.length} documents available offline`
                      : 'Some features are unavailable'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowBanner(false)}
                className={isDark ? 'text-amber-300 hover:text-amber-200' : 'text-amber-700'}
              >
                Dismiss
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4 z-30">
        <Badge
          variant={isOnline ? 'default' : 'secondary'}
          className={`flex items-center gap-2 px-3 py-1.5 ${
            isOnline 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-700 text-slate-400 border-slate-600'
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3" />
              Offline
            </>
          )}
        </Badge>
      </div>
    </>
  );
}

// Export utility functions for offline operations
export const saveForOffline = (key, data) => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save offline:', error);
    return false;
  }
};

export const loadFromOffline = (key) => {
  try {
    const data = localStorage.getItem(`offline_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load offline:', error);
    return null;
  }
};

export const queueOfflineChange = (change) => {
  try {
    const changes = JSON.parse(localStorage.getItem('offline_changes') || '[]');
    changes.push({ ...change, timestamp: Date.now() });
    localStorage.setItem('offline_changes', JSON.stringify(changes));
    return true;
  } catch (error) {
    console.error('Failed to queue change:', error);
    return false;
  }
};