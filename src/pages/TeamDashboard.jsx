import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Users, TrendingUp, Clock, FileText, MessageSquare, 
  GitBranch, Award, Activity, BarChart3, Target,
  ArrowUpRight, ArrowDownRight, Sparkles, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function TeamDashboard({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState('7d');

  const { data: users = [] } = useQuery({
    queryKey: ['team-users'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['team-documents'],
    queryFn: () => base44.entities.Document.list('-created_date', 100),
  });

  const { data: activityLogs = [] } = useQuery({
    queryKey: ['team-activity', timeRange],
    queryFn: () => base44.entities.ActivityLog.list('-created_date', 100),
  });

  const { data: collaborations = [] } = useQuery({
    queryKey: ['team-collaborations'],
    queryFn: () => base44.entities.Collaboration.list('-updated_date', 50),
  });

  // Calculate team statistics
  const stats = {
    totalMembers: users.length,
    activeToday: users.filter(u => {
      const lastActive = activityLogs.find(log => log.created_by === u.email)?.created_date;
      return lastActive && new Date(lastActive).toDateString() === new Date().toDateString();
    }).length,
    totalDocuments: documents.length,
    totalCollaborations: collaborations.length,
    weeklyActivity: activityLogs.length,
    avgResponseTime: '2.3h',
  };

  // Top contributors
  const topContributors = users.map(user => {
    const userActivity = activityLogs.filter(log => log.created_by === user.email);
    const userDocs = documents.filter(doc => doc.created_by === user.email);
    return {
      ...user,
      activityCount: userActivity.length,
      documentCount: userDocs.length,
      score: userActivity.length * 2 + userDocs.length * 5,
    };
  }).sort((a, b) => b.score - a.score).slice(0, 10);

  // Activity trends
  const activityTrend = activityLogs.reduce((acc, log) => {
    const action = log.action;
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});

  // Recent team activity
  const recentActivity = activityLogs.slice(0, 15);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Team Dashboard
            </h1>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Monitor team activity, collaboration, and productivity
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-violet-500 text-white'
                  : isDark 
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          icon={Users}
          label="Team Members"
          value={stats.totalMembers}
          trend="+3"
          isDark={isDark}
          color="from-violet-500 to-purple-600"
        />
        <MetricCard
          icon={Activity}
          label="Active Today"
          value={stats.activeToday}
          trend={`${Math.round((stats.activeToday / stats.totalMembers) * 100)}%`}
          isDark={isDark}
          color="from-emerald-500 to-green-600"
        />
        <MetricCard
          icon={FileText}
          label="Total Documents"
          value={stats.totalDocuments}
          trend="+12"
          isDark={isDark}
          color="from-cyan-500 to-blue-600"
        />
        <MetricCard
          icon={GitBranch}
          label="Collaborations"
          value={stats.totalCollaborations}
          trend="+5"
          isDark={isDark}
          color="from-amber-500 to-orange-600"
        />
        <MetricCard
          icon={Zap}
          label="Weekly Activity"
          value={stats.weeklyActivity}
          trend="+23%"
          isDark={isDark}
          color="from-pink-500 to-rose-600"
        />
        <MetricCard
          icon={Clock}
          label="Avg Response"
          value={stats.avgResponseTime}
          trend="-15%"
          isDark={isDark}
          color="from-indigo-500 to-violet-600"
          trendUp={false}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-slate-100 border border-slate-200'}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Activity Breakdown */}
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Activity Breakdown</CardTitle>
                <CardDescription>Actions performed by team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(activityTrend).map(([action, count]) => (
                  <div key={action} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isDark ? 'text-slate-300 capitalize' : 'text-slate-700'}>{action}</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{count}</span>
                    </div>
                    <Progress value={(count / activityLogs.length) * 100} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Collaborations */}
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Active Collaborations</CardTitle>
                <CardDescription>Documents with active collaboration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collaborations.slice(0, 5).map((collab, i) => (
                    <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Document {collab.document_id?.slice(0, 8)}
                        </span>
                        <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : ''}>
                          {collab.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {collab.collaborators?.length || 0} collaborators
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contributors" className="space-y-6">
          <div className="grid gap-4">
            {topContributors.map((user, index) => (
              <Card key={user.id} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14 border-2 border-violet-500/30">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-bold text-lg">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-orange-600'
                        } text-white`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {user.full_name || 'User'}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {user.email}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                          {user.activityCount}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Actions</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          {user.documentCount}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Documents</div>
                      </div>
                      <div>
                        <div className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {user.score}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {recentActivity.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0`}>
                  <ActivityIcon action={log.action} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {log.created_by || 'User'}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(log.created_date).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className="capitalize">{log.action}</span> {log.document_name && `"${log.document_name}"`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InsightItem
                  isDark={isDark}
                  text="Team productivity increased by 23% this week"
                  type="positive"
                />
                <InsightItem
                  isDark={isDark}
                  text="Peak collaboration hours: 2-4 PM"
                  type="neutral"
                />
                <InsightItem
                  isDark={isDark}
                  text="3 documents awaiting review for over 48 hours"
                  type="warning"
                />
                <InsightItem
                  isDark={isDark}
                  text="Document conversion speed improved by 15%"
                  type="positive"
                />
              </CardContent>
            </Card>

            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <RecommendationItem
                  isDark={isDark}
                  text="Schedule team sync for Wednesday 3 PM (highest availability)"
                />
                <RecommendationItem
                  isDark={isDark}
                  text="Enable automation for invoice processing (saves 4 hours/week)"
                />
                <RecommendationItem
                  isDark={isDark}
                  text="Assign backup reviewers for critical documents"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, trend, isDark, color, trendUp = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-4 rounded-xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          trendUp ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </div>
      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        {label}
      </div>
    </motion.div>
  );
}

function ActivityIcon({ action }) {
  const icons = {
    upload: FileText,
    download: ArrowDownRight,
    convert: Zap,
    share: Users,
    delete: ArrowDownRight,
  };
  const Icon = icons[action] || Activity;
  return <Icon className="w-5 h-5 text-white" />;
}

function InsightItem({ text, type, isDark }) {
  const colors = {
    positive: 'text-emerald-400',
    warning: 'text-amber-400',
    neutral: 'text-cyan-400',
  };
  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full ${colors[type]} mt-1.5`} />
      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{text}</p>
    </div>
  );
}

function RecommendationItem({ text, isDark }) {
  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{text}</p>
    </div>
  );
}