import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  GitBranch, 
  Clock,
  TrendingUp,
  Eye,
  Edit3,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import moment from 'moment';

export default function CollaborationDeepDive({ collaboration, isDark = true }) {
  const [activeTab, setActiveTab] = useState('activity');

  // Mock data
  const activityFeed = [
    { id: 1, user: 'john@example.com', action: 'edited', target: 'Section 2', timestamp: '2026-02-06T14:30:00', details: 'Updated pricing table' },
    { id: 2, user: 'jane@example.com', action: 'commented', target: 'Page 5', timestamp: '2026-02-06T14:25:00', details: 'Added feedback on design' },
    { id: 3, user: 'admin@example.com', action: 'approved', target: 'Document', timestamp: '2026-02-06T14:00:00', details: 'Approved final version' },
    { id: 4, user: 'john@example.com', action: 'viewed', target: 'Document', timestamp: '2026-02-06T13:45:00', details: 'Opened for review' }
  ];

  const versions = [
    { version: 5, author: 'john@example.com', changes: 'Updated conclusion and references', timestamp: '2026-02-06T14:30:00', size: '2.4 MB' },
    { version: 4, author: 'jane@example.com', changes: 'Added charts and graphs', timestamp: '2026-02-06T12:00:00', size: '2.2 MB' },
    { version: 3, author: 'admin@example.com', changes: 'Restructured sections', timestamp: '2026-02-05T16:30:00', size: '2.0 MB' },
    { version: 2, author: 'john@example.com', changes: 'Initial content draft', timestamp: '2026-02-05T10:00:00', size: '1.8 MB' }
  ];

  const collaboratorStats = [
    { user: 'john@example.com', edits: 23, comments: 12, views: 45, activeTime: '3.2h' },
    { user: 'jane@example.com', edits: 18, comments: 8, views: 32, activeTime: '2.8h' },
    { user: 'admin@example.com', edits: 7, comments: 15, views: 28, activeTime: '1.5h' }
  ];

  const actionIcons = {
    edited: Edit3,
    commented: MessageSquare,
    approved: CheckCircle2,
    viewed: Eye
  };

  const actionColors = {
    edited: 'text-blue-400 bg-blue-500/20',
    commented: 'text-violet-400 bg-violet-500/20',
    approved: 'text-emerald-400 bg-emerald-500/20',
    viewed: 'text-amber-400 bg-amber-500/20'
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Total Edits', value: '48', icon: Edit3, color: 'blue' },
          { label: 'Comments', value: '35', icon: MessageSquare, color: 'violet' },
          { label: 'Versions', value: versions.length, icon: GitBranch, color: 'emerald' },
          { label: 'Active Time', value: '7.5h', icon: Clock, color: 'amber' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid grid-cols-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <TabsTrigger value="activity">Activity Feed</TabsTrigger>
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="stats">Collaborator Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-4 space-y-3">
              {activityFeed.map((item, i) => {
                const Icon = actionIcons[item.action];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-start gap-3 p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${actionColors[item.action]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {item.user}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {item.action} <span className="font-medium">{item.target}</span>
                          </p>
                        </div>
                        <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {moment(item.timestamp).fromNow()}
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {item.details}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </TabsContent>

            <TabsContent value="versions" className="mt-4 space-y-3">
              {versions.map((version, i) => (
                <motion.div
                  key={version.version}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Version {version.version}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {version.size}
                          </Badge>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          by {version.author}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {moment(version.timestamp).format('MMM D, YYYY h:mm A')}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'} ml-13`}>
                    {version.changes}
                  </p>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="stats" className="mt-4 space-y-4">
              {collaboratorStats.map((stat, i) => (
                <motion.div
                  key={stat.user}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10 border-2 border-violet-500/30">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
                        {stat.user.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {stat.user}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Active time: {stat.activeTime}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className={`text-xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {stat.edits}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Edits
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                        {stat.comments}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Comments
                      </p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                        {stat.views}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        Views
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}