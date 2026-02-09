import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity, Download, Eye, Edit, Share2, Clock, TrendingUp, Users
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export default function DetailedUsageTracking({ template, isDark = true }) {
  const { data: activities = [] } = useQuery({
    queryKey: ['template-usage', template?.id],
    queryFn: () => base44.entities.ActivityLog.filter({ 
      document_id: template?.id 
    }),
    enabled: !!template?.id
  });

  if (!template) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Activity className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to view usage tracking
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate metrics
  const downloads = activities.filter(a => a.action === 'download').length;
  const views = activities.filter(a => a.action === 'view').length || template.usage_count || 0;
  const edits = activities.filter(a => a.action === 'update').length;
  const shares = activities.filter(a => a.action === 'share').length;
  const uniqueUsers = new Set(activities.map(a => a.created_by)).size;

  // Timeline data (last 14 days)
  const timelineData = Array.from({ length: 14 }, (_, i) => {
    const date = moment().subtract(13 - i, 'days');
    const dayActivities = activities.filter(a => moment(a.created_date).isSame(date, 'day'));
    return {
      date: date.format('MMM D'),
      downloads: dayActivities.filter(a => a.action === 'download').length,
      views: dayActivities.filter(a => a.action === 'view').length,
      edits: dayActivities.filter(a => a.action === 'update').length
    };
  });

  // Action distribution
  const actionData = [
    { action: 'Downloads', count: downloads, color: '#8b5cf6' },
    { action: 'Views', count: views, color: '#06b6d4' },
    { action: 'Edits', count: edits, color: '#10b981' },
    { action: 'Shares', count: shares, color: '#f59e0b' }
  ];

  // Recent activity
  const recentActivity = activities.slice(0, 10).map(a => ({
    ...a,
    timeAgo: moment(a.created_date).fromNow()
  }));

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Activity className="w-5 h-5 text-violet-400" />
            Usage Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </p>
            <Badge variant="outline" className="mt-2">{template.category}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <Download className="w-10 h-10 text-violet-400 mb-3" />
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {downloads}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Downloads</p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <Eye className="w-10 h-10 text-cyan-400 mb-3" />
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {views}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Views</p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <Edit className="w-10 h-10 text-emerald-400 mb-3" />
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {edits}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Edits</p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <Users className="w-10 h-10 text-amber-400 mb-3" />
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {uniqueUsers}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Unique Users</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="activity">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                14-Day Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="date" stroke={isDark ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="downloads" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="edits" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Action Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="action" stroke={isDark ? '#94a3b8' : '#64748b'} />
                  <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className={`text-center py-8 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  No activity yet
                </p>
              ) : (
                recentActivity.map((activity, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDark ? 'bg-slate-800' : 'bg-slate-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.action === 'download' ? 'bg-violet-500/20' :
                      activity.action === 'view' ? 'bg-cyan-500/20' :
                      activity.action === 'update' ? 'bg-emerald-500/20' :
                      'bg-amber-500/20'
                    }`}>
                      {activity.action === 'download' && <Download className="w-5 h-5 text-violet-400" />}
                      {activity.action === 'view' && <Eye className="w-5 h-5 text-cyan-400" />}
                      {activity.action === 'update' && <Edit className="w-5 h-5 text-emerald-400" />}
                      {activity.action === 'share' && <Share2 className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activity.created_by?.split('@')[0]} {activity.action}ed the template
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {activity.timeAgo}
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