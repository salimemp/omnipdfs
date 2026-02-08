import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Video, MessageSquare, Bell, Clock, CheckCircle2,
  UserPlus, Settings, Eye, Edit3, Lock, Zap, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedCollabFeatures({ document, isDark = false }) {
  const [collaborators, setCollaborators] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);

  const addCollaborator = async () => {
    if (!newEmail.includes('@')) return toast.error('Invalid email');
    
    try {
      const collab = await base44.entities.Collaboration.filter({ document_id: document.id });
      const existing = collab[0] || await base44.entities.Collaboration.create({
        document_id: document.id,
        collaborators: [],
        comments: [],
        status: 'draft'
      });

      const updated = {
        ...existing,
        collaborators: [
          ...(existing.collaborators || []),
          { email: newEmail, role: 'editor', joined_at: new Date().toISOString() }
        ]
      };

      await base44.entities.Collaboration.update(existing.id, updated);
      await base44.integrations.Core.SendEmail({
        to: newEmail,
        subject: `You've been invited to collaborate on ${document.name}`,
        body: `You can now collaborate on "${document.name}". Click to view and edit.`
      });

      setCollaborators(updated.collaborators);
      setNewEmail('');
      toast.success('Collaborator added');
    } catch (error) {
      toast.error('Failed to add collaborator');
    }
  };

  const removeCollaborator = async (email) => {
    const collab = await base44.entities.Collaboration.filter({ document_id: document.id });
    if (collab[0]) {
      const updated = {
        ...collab[0],
        collaborators: collab[0].collaborators.filter(c => c.email !== email)
      };
      await base44.entities.Collaboration.update(collab[0].id, updated);
      setCollaborators(updated.collaborators);
      toast.success('Removed collaborator');
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Collaboration Header */}
      <Card className={`${isDark ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Live Collaboration
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Real-time editing with {collaborators.length} members
                </p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((c, i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-blue-500">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                    {c.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Add Collaborators */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <UserPlus className="w-5 h-5 text-blue-400" />
              Invite Collaborators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="colleague@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
              <Button onClick={addCollaborator} className="bg-blue-500 hover:bg-blue-600">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>

            {collaborators.length > 0 && (
              <div className="space-y-2">
                {collaborators.map((collab, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-500/20 text-blue-400">
                          {collab.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {collab.email}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {collab.role}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCollaborator(collab.email)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collaboration Features */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Collaboration Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Video, label: 'Video conferencing', color: 'violet' },
              { icon: MessageSquare, label: 'Real-time chat', color: 'blue' },
              { icon: Bell, label: 'Smart notifications', color: 'amber' },
              { icon: Edit3, label: 'Live co-editing', color: 'emerald' },
              { icon: Clock, label: 'Version history', color: 'cyan' },
              { icon: Lock, label: 'Permission control', color: 'red' }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${feature.color}-400`} />
                    </div>
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {feature.label}
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Document created', user: 'You', time: '2 hours ago', icon: CheckCircle2, color: 'emerald' },
              { action: 'Collaborator invited', user: 'You', time: '1 hour ago', icon: UserPlus, color: 'blue' },
              { action: 'Changes synced', user: 'System', time: '30 mins ago', icon: Zap, color: 'violet' }
            ].map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-${activity.color}-500/20 flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 text-${activity.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {activity.action}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}