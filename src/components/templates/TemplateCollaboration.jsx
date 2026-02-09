import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Users, MessageSquare, Send, CheckCircle2, Clock, X } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function TemplateCollaboration({ templateId, isDark }) {
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    if (templateId) {
      loadCollaborationData();
      subscribeToUpdates();
    }
  }, [templateId]);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    } catch (e) {
      console.error('Failed to load user');
    }
  };

  const loadCollaborationData = async () => {
    try {
      const collab = await base44.entities.Collaboration.filter({
        document_id: templateId
      });

      if (collab.length > 0) {
        setCollaborators(collab[0].collaborators || []);
        setComments(collab[0].comments || []);
      }
    } catch (e) {
      console.error('Failed to load collaboration data');
    }
  };

  const subscribeToUpdates = () => {
    const unsubscribe = base44.entities.Collaboration.subscribe((event) => {
      if (event.data?.document_id === templateId) {
        loadCollaborationData();
      }
    });

    return () => unsubscribe();
  };

  const inviteCollaborator = async () => {
    if (!inviteEmail) {
      toast.error('Please enter an email');
      return;
    }

    try {
      const existing = await base44.entities.Collaboration.filter({
        document_id: templateId
      });

      const newCollaborator = {
        email: inviteEmail,
        role: 'editor',
        joined_at: new Date().toISOString()
      };

      if (existing.length > 0) {
        const updated = [...(existing[0].collaborators || []), newCollaborator];
        await base44.entities.Collaboration.update(existing[0].id, {
          collaborators: updated
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: templateId,
          collaborators: [newCollaborator],
          comments: []
        });
      }

      // Send invitation email
      await base44.integrations.Core.SendEmail({
        to: inviteEmail,
        subject: 'Template Collaboration Invitation',
        body: `You've been invited to collaborate on a template. Click here to view: ${window.location.origin}/templates/${templateId}`
      });

      toast.success('Collaborator invited');
      setInviteEmail('');
      loadCollaborationData();
    } catch (e) {
      toast.error('Failed to invite collaborator');
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const existing = await base44.entities.Collaboration.filter({
        document_id: templateId
      });

      const comment = {
        id: Date.now().toString(),
        author: user?.email || 'Anonymous',
        content: newComment,
        created_at: new Date().toISOString(),
        resolved: false
      };

      if (existing.length > 0) {
        const updated = [...(existing[0].comments || []), comment];
        await base44.entities.Collaboration.update(existing[0].id, {
          comments: updated
        });
      } else {
        await base44.entities.Collaboration.create({
          document_id: templateId,
          collaborators: [],
          comments: [comment]
        });
      }

      toast.success('Comment added');
      setNewComment('');
      loadCollaborationData();
    } catch (e) {
      toast.error('Failed to add comment');
    }
  };

  const toggleCommentResolved = async (commentId) => {
    try {
      const existing = await base44.entities.Collaboration.filter({
        document_id: templateId
      });

      if (existing.length > 0) {
        const updated = existing[0].comments.map(c =>
          c.id === commentId ? { ...c, resolved: !c.resolved } : c
        );
        await base44.entities.Collaboration.update(existing[0].id, {
          comments: updated
        });
        loadCollaborationData();
      }
    } catch (e) {
      toast.error('Failed to update comment');
    }
  };

  const removeCollaborator = async (email) => {
    try {
      const existing = await base44.entities.Collaboration.filter({
        document_id: templateId
      });

      if (existing.length > 0) {
        const updated = existing[0].collaborators.filter(c => c.email !== email);
        await base44.entities.Collaboration.update(existing[0].id, {
          collaborators: updated
        });
        toast.success('Collaborator removed');
        loadCollaborationData();
      }
    } catch (e) {
      toast.error('Failed to remove collaborator');
    }
  };

  return (
    <div className="space-y-6">
      {/* Collaborators Section */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Users className="w-4 h-4 text-violet-400" />
            Collaborators ({collaborators.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Invite Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter email to invite"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />
            <Button onClick={inviteCollaborator} size="sm" className="bg-violet-500">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Collaborator List */}
          <div className="space-y-2">
            {collaborators.map((collab, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? 'bg-slate-800' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-violet-500 text-white text-xs">
                      {collab.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {collab.email}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Joined {moment(collab.joined_at).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{collab.role}</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCollaborator(collab.email)}
                    className="h-7 w-7 text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            {collaborators.length === 0 && (
              <p className={`text-center text-sm py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No collaborators yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <MessageSquare className="w-4 h-4 text-violet-400" />
            Comments ({comments.filter(c => !c.resolved).length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={`min-h-[80px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />
            <Button onClick={addComment} size="sm" className="bg-violet-500">
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-lg border ${
                    comment.resolved
                      ? isDark ? 'bg-slate-800/50 border-slate-700/50 opacity-60' : 'bg-slate-50/50 border-slate-200/50 opacity-60'
                      : isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-cyan-500 text-white text-xs">
                          {comment.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {comment.author}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {moment(comment.created_at).fromNow()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleCommentResolved(comment.id)}
                      className={`h-7 w-7 ${comment.resolved ? 'text-green-500' : 'text-slate-400'}`}
                    >
                      {comment.resolved ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {comment.content}
                  </p>
                  {comment.resolved && (
                    <Badge variant="outline" className="text-xs mt-2">
                      Resolved
                    </Badge>
                  )}
                </div>
              ))}
            {comments.length === 0 && (
              <p className={`text-center text-sm py-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                No comments yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}