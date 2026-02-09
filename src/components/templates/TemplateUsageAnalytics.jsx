import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, Download, Eye, Clock, Calendar, Activity,
  Users, Target, Zap, Award
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export default function TemplateUsageAnalytics({ isDark = true }) {
  const { data: templates = [] } = useQuery({
    queryKey: ['templates-usage'],
    queryFn: () => base44.entities.Template.list()
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['template-activity-logs'],
    queryFn: () => base44.entities.ActivityLog.filter({ action: 'download' })
  });

  // Calculate daily usage for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = moment().subtract(6 - i, 'days');
    const dayActivities = activities.filter(a => 
      moment(a.created_date).isSame(date, 'day')
    );
    return {
      date: date.format('MMM D'),
      downloads: dayActivities.length,
      uniqueUsers: new Set(dayActivities.map(a => a.created_by)).size
    };
  });

  // Top performers
  const topTemplates = [...templates]
    .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
    .slice(0, 5);

  // Category performance
  const categoryPerformance = templates.reduce((acc, t) => {
    const cat = t.category || 'other';
    if (!acc[cat]) acc[cat] = { count: 0, downloads: 0 };
    acc[cat].count++;
    acc[cat].downloads += t.usage_count || 0;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryPerformance).map(([name, data]) => ({
    category: name.charAt(0).toUpperCase() + name.slice(1),
    templates: data.count,
    downloads: data.downloads,
    avgDownloads: Math.round(data.downloads / data.count)
  }));

  // Overall metrics
  const totalDownloads = templates.reduce((sum, t) => sum + (t.usage_count || 0), 0);
  const avgDownloads = templates.length > 0 ? Math.round(totalDownloads / templates.length) : 0;
  const activeTemplates = templates.filter(t => (t.usage_count || 0) > 0).length;
  const growthRate = 12.5; // Mock growth rate

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-violet-400" />
              </div>
              <Badge className="bg-emerald-500">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{growthRate}%
              </Badge>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalDownloads.toLocaleString()}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Downloads
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <Badge variant="outline">
                {((activeTemplates / templates.length) * 100).toFixed(0)}%
              </Badge>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeTemplates}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Active Templates
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {avgDownloads}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Avg Downloads/Template
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <Calendar className="w-5 h-5 text-violet-400" />
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activities.length}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Actions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trend */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <TrendingUp className="w-5 h-5 text-violet-400" />
            7-Day Usage Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="downloads" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorDownloads)" />
              <Line type="monotone" dataKey="uniqueUsers" stroke="#06b6d4" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-5 h-5 text-amber-400" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topTemplates.map((template, index) => (
              <div key={template.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {template.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {template.category}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {template.usage_count || 0}
                  </Badge>
                </div>
                <Progress 
                  value={(template.usage_count / topTemplates[0].usage_count) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Activity className="w-5 h-5 text-cyan-400" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="category" stroke={isDark ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="downloads" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}