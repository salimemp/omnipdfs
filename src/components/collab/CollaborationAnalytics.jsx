import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, TrendingUp, Users, MessageSquare, Clock,
  CheckCircle2, AlertCircle, Activity, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

export default function CollaborationAnalytics({ collaborations = [], isDark = true }) {
  // Calculate analytics
  const totalCollabs = collaborations.length;
  const activeCollabs = collaborations.filter(c => c.status === 'in_review' || c.status === 'draft').length;
  const completedCollabs = collaborations.filter(c => c.status === 'approved' || c.status === 'published').length;
  const totalComments = collaborations.reduce((sum, c) => sum + (c.comments?.length || 0), 0);
  const totalCollaborators = new Set(collaborations.flatMap(c => c.collaborators?.map(col => col.email) || [])).size;
  const avgResponseTime = '2.3 hours'; // Mock data
  
  const recentActivity = collaborations
    .flatMap(c => c.version_history || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 10);

  const topCollaborators = Object.entries(
    collaborations
      .flatMap(c => c.collaborators || [])
      .reduce((acc, col) => {
        acc[col.email] = (acc[col.email] || 0) + 1;
        return acc;
      }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Collaborations',
      value: totalCollabs,
      icon: Users,
      color: 'text-violet-400',
      bg: 'bg-violet-500/20'
    },
    {
      label: 'Active',
      value: activeCollabs,
      icon: Activity,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20'
    },
    {
      label: 'Completed',
      value: completedCollabs,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20'
    },
    {
      label: 'Total Comments',
      value: totalComments,
      icon: MessageSquare,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20'
    },
    {
      label: 'Team Members',
      value: totalCollaborators,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      label: 'Avg Response Time',
      value: avgResponseTime,
      icon: Clock,
      color: 'text-pink-400',
      bg: 'bg-pink-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {stat.label}
                </p>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Top Collaborators */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Top Collaborators
        </h4>
        <div className="space-y-2">
          {topCollaborators.map(([email, count], i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{email}</span>
              </div>
              <Badge variant="outline" className={isDark ? 'border-slate-700' : ''}>
                {count} collabs
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Activity className="w-4 h-4 text-cyan-400" />
          Recent Activity
        </h4>
        <div className="space-y-3">
          {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
            <div key={i} className="flex gap-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
              <div className="flex-1">
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {activity.changes}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {activity.author}
                  </span>
                  <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>•</span>
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {moment(activity.created_at).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No recent activity
            </p>
          )}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          Productivity Insights
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {completedCollabs > 0 ? `${((completedCollabs / totalCollabs) * 100).toFixed(0)}% completion rate` : 'No completions yet'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {totalComments > 0 ? `${(totalComments / totalCollabs).toFixed(1)} avg comments per doc` : 'No comments yet'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {activeCollabs} active collaboration{activeCollabs !== 1 ? 's' : ''} in progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}