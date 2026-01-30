import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Users, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function RealtimeEditor({ documentId, isDark }) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
    loadDocument();

    // Subscribe to real-time updates
    const unsubscribe = base44.entities.Document.subscribe((event) => {
      if (event.type === 'update' && event.id === documentId) {
        setContent(event.data.content || '');
        setLastSaved(new Date().toISOString());
      }
    });

    return unsubscribe;
  }, [documentId]);

  const fetchUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setActiveUsers([userData]);
    } catch (e) {}
  };

  const loadDocument = async () => {
    try {
      const docs = await base44.entities.Document.filter({ id: documentId });
      if (docs.length > 0) {
        setContent(docs[0].content || '');
      }
    } catch (error) {
      console.error('Failed to load document');
    }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      await base44.entities.Document.update(documentId, { content });
      setLastSaved(new Date().toISOString());
      toast.success('Saved successfully');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (content) saveContent();
    }, 30000);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {activeUsers.map((u, i) => (
              <Avatar key={i} className="w-6 h-6 border-2 border-slate-900">
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                  {u.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {activeUsers.length} {activeUsers.length === 1 ? 'editor' : 'editors'} active
          </span>
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
            Live
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          <Button size="sm" onClick={saveContent} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start editing..."
        className={`min-h-[500px] font-mono ${isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
      />
    </div>
  );
}