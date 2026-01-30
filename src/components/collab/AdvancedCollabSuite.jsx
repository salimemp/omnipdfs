import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Video, Share2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedCollabSuite({ document, isDark = true }) {
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [shareEmail, setShareEmail] = useState('');

  useEffect(() => {
    loadCollaboration();
  }, [document?.id]);

  const loadCollaboration = async () => {
    if (!document) return;
    
    try {
      const collabs = await base44.entities.Collaboration.filter({ 
        document_id: document.id 
      });
      
      if (collabs.length > 0) {
        setCollaborators(collabs[0].collaborators || []);
        setComments(collabs[0].comments || []);
      }
    } catch (error) {
      console.error('Failed to load collaboration:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const user = await base44.auth.me();
      const comment = {
        id: Date.now().toString(),
        author: user.email,
        content: newComment,
        created_at: new Date().toISOString()
      };

      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      setNewComment('');

      const collabs = await base44.entities.Collaboration.filter({ 
        document_id: document.id 
      });

      if (collabs.length > 0) {
        await base44.entities.Collaboration.update(collabs[0].id, {
          comments: updatedComments
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: document.id,
          comments: updatedComments
        });
      }

      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const shareDocument = async () => {
    if (!shareEmail.trim()) return;

    try {
      const newCollab = {
        email: shareEmail,
        role: 'editor',
        joined_at: new Date().toISOString()
      };

      const updatedCollabs = [...collaborators, newCollab];
      setCollaborators(updatedCollabs);
      setShareEmail('');

      const collabs = await base44.entities.Collaboration.filter({ 
        document_id: document.id 
      });

      if (collabs.length > 0) {
        await base44.entities.Collaboration.update(collabs[0].id, {
          collaborators: updatedCollabs
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: document.id,
          collaborators: updatedCollabs
        });
      }

      toast.success(`Shared with ${shareEmail}`);
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  if (!document) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardContent className="py-12 text-center text-slate-400">
          Select a document to collaborate
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" />
            Collaborators ({collaborators.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="Email address..."
            />
            <Button onClick={shareDocument}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="space-y-2">
            {collaborators.map((collab, idx) => (
              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div>
                  <p className="font-medium">{collab.email}</p>
                  <p className="text-sm text-slate-400">{collab.role}</p>
                </div>
                <Badge>{collab.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {comments.map((comment, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[80px]"
            />
            <Button onClick={addComment}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}