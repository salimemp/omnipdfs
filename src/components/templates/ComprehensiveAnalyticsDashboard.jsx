import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, Download, Eye, Users, Calendar, Clock,
  BarChart3, Activity, Target, Award
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function ComprehensiveAnalyticsDashboard({ isDark = true }) {
  const { data: templates = [] } = useQuery({
    queryKey: ['analytics-templates'],
    queryFn: () => base44.entities.Template.list()
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['analytics-activities'],
    queryFn: () => base44.entities.ActivityLog.list()
  });

  // Calculate metrics
  const totalDownloads = templates.reduce((sum, t) => sum + (t.usage_count || 0), 0);
  const totalViews = templates.length * 123; // Mock
  const uniqueUsers = new Set(activities.map(a => a.created_by)).size;
  const avgRating = 4.7; // Mock

  // Time-based data
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = moment().subtract(29 - i, 'days');
    const dayActivities = activities.filter(a => moment(a.created_date).isSame(date, 'day'));
    return {
      date: date.format('MMM D'),
      downloads: dayActivities.length,
      views: Math.floor(Math.random() * 50) + 20
    };
  });

  // Category performance
  const categoryStats = templates.reduce((acc, t) => {
    const cat = t.category || 'other';
    if (!acc[cat]) acc[cat] = { templates: 0, downloads: 0, avgQuality: 0 };
    acc[cat].templates++;
    acc[cat].downloads += t.usage_count || 0;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryStats).map(([name, data]) => ({
    category: name.charAt(0).toUpperCase() + name.slice(1),
    templates: data.templates,
    downloads: data.downloads,
    avgPerTemplate: Math.round(data.downloads / data.templates)
  }));

  // Top creators
  const creatorStats = templates.reduce((acc, t) => {
    const creator = t.created_by?.split('@')[0] || 'Unknown';
    if (!acc[creator]) acc[creator] = { count: 0, downloads: 0 };
    acc[creator].count++;
    acc[creator].downloads += t.usage_count || 0;
    return acc;
  }, {});

  const topCreators = Object.entries(creatorStats)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

  // Growth rate
  const thisMonth = activities.filter(a => moment(a.created_date).isSame(moment(), 'month')).length;
  const lastMonth = activities.filter(a => moment(a.created_date).isSame(moment().subtract(1, 'month'), 'month')).length;
  const growthRate = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Download className="w-10 h-10 text-violet-400" />
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
              <Eye className="w-10 h-10 text-cyan-400" />
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {totalViews.toLocaleString()}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Views
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 text-emerald-400" />
              <Badge variant="outline">{templates.length}</Badge>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {uniqueUsers}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Unique Users
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-10 h-10 text-amber-400" />
              <span className="text-amber-400">★★★★☆</span>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {avgRating}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Avg Rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <TrendingUp className="w-5 h-5 text-violet-400" />
                30-Day Activity Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={last30Days}>
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
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
                  <Legend />
                  <Area type="monotone" dataKey="downloads" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorDownloads)" />
                  <Area type="monotone" dataKey="views" stroke="#06b6d4" fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
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
                  <Legend />
                  <Bar dataKey="templates" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="downloads" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Award className="w-5 h-5 text-amber-400" />
                Top Template Creators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCreators.map((creator, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-lg ${
                  isDark ? 'bg-slate-800' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      #{i + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {creator.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {creator.count} templates
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{creator.downloads} downloads</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}