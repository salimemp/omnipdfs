import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, UserPlus, Crown, Edit3, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function RealTimeCollaboration({ documentId, isDark }) {
  const [collaboration, setCollaboration] = useState(null);
  const [user, setUser] = useState(null);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [newComment, setNewComment] = useState('');
  const [adding, setAdding] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchCollaboration();
    
    // Subscribe to real-time updates
    const unsubscribe = base44.entities.Collaboration.subscribe((event) => {
      if (event.type === 'update' && event.data.document_id === documentId) {
        setCollaboration(event.data);
      }
    });
    
    return unsubscribe;
  }, [documentId]);

  const fetchUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (e) {}
  };

  const fetchCollaboration = async () => {
    try {
      const collabs = await base44.entities.Collaboration.filter({ document_id: documentId });
      if (collabs.length > 0) {
        setCollaboration(collabs[0]);
      } else {
        const newCollab = await base44.entities.Collaboration.create({
          document_id: documentId,
          collaborators: [{ email: user?.email, role: 'admin', joined_at: new Date().toISOString() }],
          comments: [],
          version_history: [],
          status: 'draft'
        });
        setCollaboration(newCollab);
      }
    } catch (error) {
      console.error('Failed to fetch collaboration:', error);
    }
  };

  const addCollaborator = async () => {
    if (!newCollaborator || !collaboration) return;
    
    setAdding(true);
    try {
      const updatedCollaborators = [
        ...collaboration.collaborators,
        { email: newCollaborator, role: 'editor', joined_at: new Date().toISOString() }
      ];
      
      await base44.entities.Collaboration.update(collaboration.id, {
        collaborators: updatedCollaborators
      });
      
      setCollaboration({ ...collaboration, collaborators: updatedCollaborators });
      setNewCollaborator('');
      toast.success('Collaborator added');
    } catch (error) {
      toast.error('Failed to add collaborator');
    } finally {
      setAdding(false);
    }
  };

  const addComment = async () => {
    if (!newComment || !collaboration) return;
    
    try {
      const comment = {
        id: Date.now().toString(),
        author: user?.email,
        content: newComment,
        created_at: new Date().toISOString(),
        resolved: false
      };
      
      const updatedComments = [...(collaboration.comments || []), comment];
      
      await base44.entities.Collaboration.update(collaboration.id, {
        comments: updatedComments
      });
      
      setCollaboration({ ...collaboration, comments: updatedComments });
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const removeCollaborator = async (email) => {
    if (!collaboration) return;
    
    try {
      const updatedCollaborators = collaboration.collaborators.filter(c => c.email !== email);
      
      await base44.entities.Collaboration.update(collaboration.id, {
        collaborators: updatedCollaborators
      });
      
      setCollaboration({ ...collaboration, collaborators: updatedCollaborators });
      toast.success('Collaborator removed');
    } catch (error) {
      toast.error('Failed to remove collaborator');
    }
  };

  const roleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-3 h-3" />;
      case 'editor': return <Edit3 className="w-3 h-3" />;
      case 'viewer': return <Eye className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-5 h-5 text-violet-400" />
              Collaborators ({collaboration?.collaborators?.length || 0})
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaboration?.collaborators?.slice(0, 3).map((collab, i) => (
                  <Avatar key={i} className="w-6 h-6 border-2 border-slate-900">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                      {collab.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address..."
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}
            />
            <Button
              onClick={addCollaborator}
              disabled={adding || !newCollaborator}
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {collaboration?.collaborators?.map((collab, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                      {collab.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {collab.email}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {roleIcon(collab.role)}
                      <span className="ml-1">{collab.role}</span>
                    </Badge>
                  </div>
                </div>
                {collab.role !== 'admin' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeCollaborator(collab.email)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Comments ({collaboration?.comments?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`min-h-[80px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
            />
            <Button
              onClick={addComment}
              disabled={!newComment}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Add Comment
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {collaboration?.comments?.map((comment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-xs">
                        {comment.author?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {comment.author}
                    </span>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {comment.content}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}