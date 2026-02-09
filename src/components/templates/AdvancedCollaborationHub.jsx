import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, MessageSquare, Activity, Send, UserPlus, Video, 
  FileText, Clock, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function AdvancedCollaborationHub({ templateId, isDark = true }) {
  const [message, setMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: template } = useQuery({
    queryKey: ['template-collab', templateId],
    queryFn: () => base44.entities.Template.filter({ id: templateId }),
    enabled: !!templateId,
    select: (data) => data[0]
  });

  const { data: collaboration } = useQuery({
    queryKey: ['collaboration-data', templateId],
    queryFn: async () => {
      const collabs = await base44.entities.Collaboration.filter({ document_id: templateId });
      return collabs[0];
    },
    enabled: !!templateId
  });

  // Simulate real-time presence
  useEffect(() => {
    if (!templateId || !collaboration) return;

    const updatePresence = () => {
      const collaborators = collaboration.collaborators || [];
      const online = collaborators.slice(0, Math.ceil(Math.random() * collaborators.length));
      setOnlineUsers(online.map(c => c.email));
    };

    updatePresence();
    const interval = setInterval(updatePresence, 10000);
    return () => clearInterval(interval);
  }, [templateId, collaboration]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      const comments = collaboration?.comments || [];
      comments.push({
        id: Date.now().toString(),
        author: user.email,
        content,
        created_at: new Date().toISOString(),
        resolved: false,
        type: 'message'
      });

      await base44.entities.Collaboration.update(collaboration.id, { comments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-data']);
      setMessage('');
    }
  });

  const inviteCollaboratorMutation = useMutation({
    mutationFn: async (email) => {
      const collaborators = collaboration?.collaborators || [];
      if (collaborators.some(c => c.email === email)) {
        throw new Error('Already a member');
      }

      collaborators.push({
        email,
        role: 'editor',
        joined_at: new Date().toISOString()
      });

      await base44.entities.Collaboration.update(collaboration.id, { collaborators });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['collaboration-data']);
      setInviteEmail('');
      toast.success('Invitation sent');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const messages = collaboration?.comments?.filter(c => c.type === 'message') || [];
  const collaborators = collaboration?.collaborators || [];
  const recentActivity = collaboration?.version_history?.slice(-5).reverse() || [];

  if (!templateId) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Users className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to collaborate
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Users className="w-5 h-5 text-violet-400" />
            Advanced Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {template?.name}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Messages */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No messages yet
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${
                    msg.author === user?.email ? 'flex-row-reverse' : ''
                  }`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white text-xs">
                        {msg.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${msg.author === user?.email ? 'text-right' : ''}`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        msg.author === user?.email
                          ? 'bg-violet-500 text-white'
                          : isDark ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {moment(msg.created_at).format('h:mm A')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Send Message */}
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && message && sendMessageMutation.mutate(message)}
              className={isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}
            />
            <Button
              onClick={() => sendMessageMutation.mutate(message)}
              disabled={!message || sendMessageMutation.isPending}
              className="bg-violet-500"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          {/* Invite */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-4 flex gap-2">
              <Input
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
              <Button
                onClick={() => inviteCollaboratorMutation.mutate(inviteEmail)}
                disabled={!inviteEmail || inviteCollaboratorMutation.isPending}
                className="bg-cyan-500"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
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
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
                          {collab.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers.includes(collab.email) && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {collab.email.split('@')[0]}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {onlineUsers.includes(collab.email) ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{collab.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Activity className="w-4 h-4 text-cyan-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                    isDark ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div className="flex-1">
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activity.changes}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        by {activity.author?.split('@')[0]} • {moment(activity.created_at).fromNow()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}