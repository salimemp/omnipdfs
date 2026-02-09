import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, UserPlus, MessageSquare, GitBranch, Clock, Eye,
  CheckCircle2, XCircle, Send, Search
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function TemplateCollaborationHub({ templateId, isDark = true }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: template } = useQuery({
    queryKey: ['template', templateId],
    queryFn: () => base44.entities.Template.filter({ id: templateId }),
    enabled: !!templateId,
    select: (data) => data[0]
  });

  const { data: collaborations = [] } = useQuery({
    queryKey: ['collaborations', templateId],
    queryFn: () => base44.entities.Collaboration.filter({ document_id: templateId }),
    enabled: !!templateId
  });

  const inviteMutation = useMutation({
    mutationFn: async (email) => {
      const existing = collaborations[0];
      const collaborators = existing?.collaborators || [];
      
      if (collaborators.some(c => c.email === email)) {
        throw new Error('User already invited');
      }

      collaborators.push({
        email,
        role: 'editor',
        joined_at: new Date().toISOString()
      });

      if (existing) {
        await base44.entities.Collaboration.update(existing.id, { collaborators });
      } else {
        await base44.entities.Collaboration.create({
          document_id: templateId,
          collaborators,
          comments: [],
          version_history: [],
          status: 'draft'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['collaborations']);
      toast.success('Invitation sent');
      setInviteEmail('');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content) => {
      const existing = collaborations[0];
      const comments = existing?.comments || [];
      
      comments.push({
        id: Date.now().toString(),
        author: user.email,
        content,
        created_at: new Date().toISOString(),
        resolved: false
      });

      if (existing) {
        await base44.entities.Collaboration.update(existing.id, { comments });
      } else {
        await base44.entities.Collaboration.create({
          document_id: templateId,
          collaborators: [{ email: user.email, role: 'admin', joined_at: new Date().toISOString() }],
          comments,
          version_history: [],
          status: 'draft'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['collaborations']);
      setNewComment('');
    }
  });

  const toggleCommentResolved = async (commentId) => {
    const existing = collaborations[0];
    if (!existing) return;

    const comments = existing.comments.map(c =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );

    await base44.entities.Collaboration.update(existing.id, { comments });
    queryClient.invalidateQueries(['collaborations']);
  };

  const updateStatus = async (newStatus) => {
    const existing = collaborations[0];
    if (!existing) return;

    await base44.entities.Collaboration.update(existing.id, { status: newStatus });
    queryClient.invalidateQueries(['collaborations']);
    toast.success(`Status updated to ${newStatus}`);
  };

  const collaboration = collaborations[0];
  const collaborators = collaboration?.collaborators || [];
  const comments = collaboration?.comments || [];
  const filteredComments = comments.filter(c => 
    !searchQuery || c.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!templateId) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to start collaborating
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-5 h-5 text-violet-400" />
              Collaboration Hub
            </CardTitle>
            <Badge className={
              collaboration?.status === 'published' ? 'bg-emerald-500' :
              collaboration?.status === 'in_review' ? 'bg-amber-500' :
              collaboration?.status === 'approved' ? 'bg-cyan-500' :
              'bg-slate-500'
            }>
              {collaboration?.status || 'draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {template?.name}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          {/* Invite */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
                <Button
                  onClick={() => inviteMutation.mutate(inviteEmail)}
                  disabled={!inviteEmail || inviteMutation.isPending}
                  className="bg-violet-500"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Team Members ({collaborators.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {collaborators.map((collab, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? 'bg-slate-800' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
                        {collab.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {collab.email.split('@')[0]}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {collab.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{collab.role}</Badge>
                </div>
              ))}
              {collaborators.length === 0 && (
                <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No team members yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <Input
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
            />
          </div>

          {/* Add Comment */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                  onKeyPress={(e) => e.key === 'Enter' && newComment && addCommentMutation.mutate(newComment)}
                />
                <Button
                  onClick={() => addCommentMutation.mutate(newComment)}
                  disabled={!newComment || addCommentMutation.isPending}
                  className="bg-cyan-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-3">
            {filteredComments.map((comment) => (
              <Card key={comment.id} className={`${
                isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              } ${comment.resolved ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                          {comment.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {comment.author.split('@')[0]}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {moment(comment.created_at).fromNow()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleCommentResolved(comment.id)}
                    >
                      {comment.resolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {comment.content}
                  </p>
                  {comment.resolved && (
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-400">Resolved</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
            {filteredComments.length === 0 && (
              <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                <CardContent className="p-8 text-center">
                  <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    No comments yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => updateStatus('draft')}
                className={collaboration?.status === 'draft' ? 'border-violet-500' : ''}
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Draft
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus('in_review')}
                className={collaboration?.status === 'in_review' ? 'border-amber-500' : ''}
              >
                <Eye className="w-4 h-4 mr-2" />
                In Review
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus('approved')}
                className={collaboration?.status === 'approved' ? 'border-cyan-500' : ''}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approved
              </Button>
              <Button
                variant="outline"
                onClick={() => updateStatus('published')}
                className={collaboration?.status === 'published' ? 'border-emerald-500' : ''}
              >
                <Clock className="w-4 h-4 mr-2" />
                Published
              </Button>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Version History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {collaboration?.version_history && collaboration.version_history.length > 0 ? (
                <div className="space-y-2">
                  {collaboration.version_history.map((version, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline">v{version.version}</Badge>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {moment(version.created_at).format('MMM D, h:mm A')}
                        </p>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {version.changes}
                      </p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        by {version.author}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No version history
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}