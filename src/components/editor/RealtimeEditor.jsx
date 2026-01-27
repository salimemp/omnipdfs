import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Users, Wifi, WifiOff, Eye, Edit, Save, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import moment from 'moment';

const userColors = [
  'bg-violet-500', 'bg-cyan-500', 'bg-emerald-500', 
  'bg-amber-500', 'bg-pink-500', 'bg-blue-500'
];

export default function RealtimeEditor({ documentId, isDark = true }) {
  const [content, setContent] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      
      // Simulate joining session
      setActiveUsers([{
        email: user.email,
        color: userColors[0],
        cursor: null,
        typing: false
      }]);
      setIsConnected(true);
    };
    initUser();
  }, []);

  useEffect(() => {
    if (!documentId) return;

    // Subscribe to real-time document changes
    const unsubscribe = base44.entities.Document.subscribe((event) => {
      if (event.id === documentId && event.type === 'update') {
        setContent(event.data.content || '');
        setLastSaved(new Date());
        toast.success('Document updated', { duration: 1000 });
      }
    });

    return unsubscribe;
  }, [documentId]);

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Mark user as typing
    setActiveUsers(prev => 
      prev.map(u => u.email === currentUser?.email ? { ...u, typing: true } : u)
    );

    // Auto-save after 2 seconds of no typing
    clearTimeout(window.editorSaveTimeout);
    window.editorSaveTimeout = setTimeout(() => {
      saveContent(newContent);
    }, 2000);
  };

  const saveContent = async (contentToSave = content) => {
    try {
      await base44.entities.Document.update(documentId, {
        content: contentToSave
      });
      setLastSaved(new Date());
      setActiveUsers(prev => 
        prev.map(u => u.email === currentUser?.email ? { ...u, typing: false } : u)
      );
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isConnected ? 'Connected' : 'Offline'}
            </span>
          </div>
          {lastSaved && (
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Last saved {moment(lastSaved).fromNow()}
            </span>
          )}
        </div>

        {/* Active Users */}
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Users className="w-4 h-4 inline mr-1" />
            {activeUsers.length}
          </span>
          <div className="flex -space-x-2">
            <AnimatePresence>
              {activeUsers.map((user, i) => (
                <motion.div
                  key={user.email}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative"
                >
                  <Avatar className={`w-8 h-8 border-2 ${isDark ? 'border-slate-900' : 'border-white'}`}>
                    <AvatarFallback className={`${user.color} text-white text-xs`}>
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.typing && (
                    <Circle className="absolute -bottom-1 -right-1 w-3 h-3 text-emerald-400 fill-current animate-pulse" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing... Changes save automatically"
          className={`min-h-[400px] border-0 focus:ring-0 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => saveContent()}
          className={isDark ? 'border-slate-700' : ''}
        >
          <Save className="w-4 h-4 mr-1" />
          Save Now
        </Button>
      </div>
    </div>
  );
}