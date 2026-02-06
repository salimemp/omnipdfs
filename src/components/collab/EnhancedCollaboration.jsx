import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Video, Share2, UserPlus, Bell, Activity, CheckCircle2, Eye, Edit3, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '../shared/LanguageContext';
import { toast } from 'sonner';

export default function EnhancedCollaboration({ document, isDark }) {
  const { t } = useLanguage();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [cursorPositions, setCursorPositions] = useState([]);
  const [liveEdits, setLiveEdits] = useState([]);
  const [collaborators] = useState([
    { name: 'John Doe', email: 'john@example.com', role: 'Editor', online: true, cursor: { line: 5, col: 12 } },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Viewer', online: false },
  ]);

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error('Please enter email');
      return;
    }
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
        <Users className="w-6 h-6 text-blue-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Real-Time {t('collaboration')}
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Work together on documents in real-time
          </p>
        </div>
      </div>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Invite Collaborators</CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            Add team members to work on this document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@example.com"
              className={`flex-1 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className={`w-32 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInvite} className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>

          <div className="space-y-2">
            {collaborators.map((collab, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-semibold">
                        {collab.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {collab.online && (
                      <>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
                        {collab.cursor && (
                          <div className="absolute -top-1 -right-1">
                            <Edit3 className="w-3 h-3 text-cyan-400 animate-pulse" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{collab.name}</p>
                      {collab.online && collab.cursor && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                          Editing
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{collab.email}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}>
                  {collab.role}
                </Badge>
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Presence Detection</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              See real-time cursor positions and editing activity from team members
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className={`h-auto py-4 ${isDark ? 'border-slate-700 hover:bg-violet-500/10 hover:border-violet-500/30' : 'border-slate-200 hover:bg-violet-50'}`}
          onClick={() => toast.success('Live chat opened')}
        >
          <div className="flex flex-col items-center gap-2">
            <MessageSquare className="w-6 h-6 text-violet-400" />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Chat</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Discuss in real-time</span>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className={`h-auto py-4 ${isDark ? 'border-slate-700 hover:bg-cyan-500/10 hover:border-cyan-500/30' : 'border-slate-200 hover:bg-cyan-50'}`}
          onClick={() => toast.success('Video call starting...')}
        >
          <div className="flex flex-col items-center gap-2">
            <Video className="w-6 h-6 text-cyan-400" />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Video Call</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Start meeting</span>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className={`h-auto py-4 ${isDark ? 'border-slate-700 hover:bg-emerald-500/10 hover:border-emerald-500/30' : 'border-slate-200 hover:bg-emerald-50'}`}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Share link copied!');
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Share2 className="w-6 h-6 text-emerald-400" />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Share Link</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Generate link</span>
          </div>
        </Button>

        <Button 
          variant="outline" 
          className={`h-auto py-4 ${isDark ? 'border-slate-700 hover:bg-amber-500/10 hover:border-amber-500/30' : 'border-slate-200 hover:bg-amber-50'}`}
          onClick={() => toast.info('Activity log opened')}
        >
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-6 h-6 text-amber-400" />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity Log</span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>View changes</span>
          </div>
        </Button>
      </div>

      <Card className={isDark ? 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-cyan-50 border-violet-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Advanced Collaboration</CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Premium features for enterprise teams
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Screen sharing & presentations</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Threaded discussions & mentions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Workflow approvals & e-signatures</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Unlimited version history</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}