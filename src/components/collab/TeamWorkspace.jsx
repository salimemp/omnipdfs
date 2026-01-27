import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users, Video, MessageSquare, Calendar, FileText, Clock,
  CheckCircle2, AlertCircle, TrendingUp, Activity, Plus,
  Send, Paperclip, Smile, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import moment from 'moment';

export default function TeamWorkspace({ collaboration, onUpdate, isDark = true }) {
  const [newMessage, setNewMessage] = useState('');
  const [activeView, setActiveView] = useState('chat');

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newMessage,
      created_at: new Date().toISOString(),
      resolved: false
    };

    await onUpdate?.({
      comments: [...(collaboration?.comments || []), message]
    });

    setNewMessage('');
    toast.success('Message sent');
  };

  const teamMembers = collaboration?.collaborators || [];
  const messages = collaboration?.comments || [];
  const activity = collaboration?.version_history || [];

  const stats = {
    totalMessages: messages.length,
    activeMembers: teamMembers.filter(m => m.role !== 'viewer').length,
    completionRate: Math.min(100, (messages.length / 10) * 100),
    lastActivity: messages[messages.length - 1]?.created_at
  };

  return (
    <div className={`grid lg:grid-cols-4 gap-4 h-[600px]`}>
      {/* Sidebar - Team & Stats */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="space-y-4">
          {/* Team Members */}
          <div>
            <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Users className="w-4 h-4 text-violet-400" />
              Team ({teamMembers.length})
            </h4>
            <div className="space-y-2">
              {teamMembers.map((member, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-violet-500/20 text-violet-400 text-xs">
                      {member.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {member.email}
                    </p>
                    <Badge variant="outline" className="text-xs mt-0.5">{member.role}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Messages</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.activeMembers}</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Progress</span>
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.completionRate.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.completionRate}%` }}
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className={isDark ? 'border-slate-700' : ''}>
                <Video className="w-4 h-4 mr-1" />
                Meet
              </Button>
              <Button size="sm" variant="outline" className={isDark ? 'border-slate-700' : ''}>
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area - Chat/Activity */}
      <div className={`lg:col-span-3 rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'} flex flex-col`}>
        {/* Tabs */}
        <div className={`flex gap-2 p-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          {['chat', 'activity', 'files'].map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeView === view
                  ? 'bg-violet-500/20 text-violet-400'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {view === 'chat' && <MessageSquare className="w-4 h-4 inline mr-1" />}
              {view === 'activity' && <Activity className="w-4 h-4 inline mr-1" />}
              {view === 'files' && <FileText className="w-4 h-4 inline mr-1" />}
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {activeView === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.author === 'AI Assistant' ? 'bg-violet-500/5 p-3 rounded-xl' : ''}`}
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-xs">
                        {msg.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{msg.author}</span>
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {moment(msg.created_at).fromNow()}
                        </span>
                      </div>
                      <p className={`text-sm whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeView === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {activity.length > 0 ? activity.map((item, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.changes}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        by {item.author} • {moment(item.created_at).fromNow()}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className={`text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No activity yet</p>
                )}
              </motion.div>
            )}

            {activeView === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-slate-500"
              >
                No files attached yet
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Message Input */}
        {activeView === 'chat' && (
          <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
              <Button onClick={sendMessage} className="bg-violet-500 hover:bg-violet-600">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}