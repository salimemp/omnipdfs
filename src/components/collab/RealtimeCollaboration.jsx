import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { base44 } from '@/api/base44Client';

export default function RealtimeCollaboration({ documentId, isDark = true }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    initializeCollaboration();
    const interval = setInterval(updatePresence, 5000);
    
    // Track mouse movements for live cursors
    const handleMouseMove = (e) => {
      if (user && documentId) {
        const cursorData = {
          x: e.clientX,
          y: e.clientY,
          user: user.email
        };
        // Could broadcast cursor position via WebSocket here
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [documentId, user]);

  const initializeCollaboration = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const collaboration = await base44.entities.Collaboration.filter({ 
        document_id: documentId 
      });

      if (collaboration.length > 0) {
        setActiveUsers(collaboration[0].collaborators || []);
      }

      await updatePresence();
    } catch (error) {
      console.error('Failed to initialize collaboration:', error);
    }
  };

  const updatePresence = async () => {
    if (!user || !documentId) return;

    try {
      const collaboration = await base44.entities.Collaboration.filter({ 
        document_id: documentId 
      });

      const now = new Date().toISOString();
      let collaborators = [];

      if (collaboration.length > 0) {
        collaborators = collaboration[0].collaborators || [];
        
        const existingIndex = collaborators.findIndex(c => c.email === user.email);
        if (existingIndex >= 0) {
          collaborators[existingIndex].last_active = now;
        } else {
          collaborators.push({
            email: user.email,
            role: 'editor',
            last_active: now,
            joined_at: now
          });
        }

        collaborators = collaborators.filter(c => {
          const lastActive = new Date(c.last_active);
          const diff = (new Date() - lastActive) / 1000;
          return diff < 30;
        });

        await base44.entities.Collaboration.update(collaboration[0].id, {
          collaborators
        });

        setActiveUsers(collaborators);
      } else {
        const newCollaborators = [{
          email: user.email,
          role: 'editor',
          last_active: now,
          joined_at: now
        }];

        await base44.entities.Collaboration.create({
          document_id: documentId,
          collaborators: newCollaborators
        });

        setActiveUsers(newCollaborators);
      }
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          Active Now ({activeUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {activeUsers.map((collab, idx) => (
              <motion.div
                key={collab.email}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-semibold">
                      {collab.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-emerald-400 text-emerald-400" />
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {collab.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-slate-400">{collab.role}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {activeUsers.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No active collaborators
          </div>
        )}
      </CardContent>
    </Card>
  );
}