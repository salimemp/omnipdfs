import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, Users, Clock, CheckCircle2, MessageSquare,
  Target, Award, Zap, BarChart3, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

export default function InsightsDashboard({ collaborations = [], isDark = true }) {
  // Calculate insights
  const totalProjects = collaborations.length;
  const activeProjects = collaborations.filter(c => c.status === 'in_review' || c.status === 'draft').length;
  const completedProjects = collaborations.filter(c => c.status === 'approved' || c.status === 'published').length;
  const completionRate = totalProjects > 0 ? (completedProjects / totalProjects * 100).toFixed(0) : 0;
  
  const totalComments = collaborations.reduce((sum, c) => sum + (c.comments?.length || 0), 0);
  const avgCommentsPerDoc = totalProjects > 0 ? (totalComments / totalProjects).toFixed(1) : 0;
  
  const totalCollaborators = new Set(
    collaborations.flatMap(c => c.collaborators?.map(col => col.email) || [])
  ).size;

  const recentActivity = collaborations
    .flatMap(c => c.version_history?.map(v => ({ ...v, docId: c.document_id })) || [])
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  const insights = [
    {
      title: 'High Engagement',
      description: `${avgCommentsPerDoc} comments per document on average`,
      icon: MessageSquare,
      color: 'text-cyan-400',
      score: avgCommentsPerDoc > 3 ? 'positive' : 'neutral'
    },
    {
      title: 'Team Productivity',
      description: `${completionRate}% completion rate`,
      icon: Target,
      color: 'text-emerald-400',
      score: completionRate > 70 ? 'positive' : 'needs-attention'
    },
    {
      title: 'Collaboration Health',
      description: `${totalCollaborators} active team members`,
      icon: Users,
      color: 'text-violet-400',
      score: totalCollaborators > 5 ? 'positive' : 'neutral'
    },
    {
      title: 'Response Time',
      description: 'Average 2.3 hours',
      icon: Clock,
      color: 'text-amber-400',
      score: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: totalProjects, icon: BarChart3, color: 'violet' },
          { label: 'Active Now', value: activeProjects, icon: Activity, color: 'cyan' },
          { label: 'Completed', value: completedProjects, icon: CheckCircle2, color: 'emerald' },
          { label: 'Team Size', value: totalCollaborators, icon: Users, color: 'amber' }
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
            >
              <div className={`w-10 h-10 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${metric.color}-400`} />
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {metric.value}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {metric.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Sparkles className="w-4 h-4 text-violet-400" />
          AI-Powered Insights
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <div 
                key={i}
                className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${insight.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {insight.title}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Progress */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Overall Progress
          </h4>
          <Badge className="bg-emerald-500/20 text-emerald-400">
            {completionRate}% Complete
          </Badge>
        </div>
        <Progress value={completionRate} className="h-3 mb-2" />
        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {completedProjects} of {totalProjects} projects completed
        </p>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Zap className="w-4 h-4 text-amber-400" />
          Recent Activity
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full mt-2 ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'}`} />
              <div>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {activity.changes}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {activity.author} • {moment(activity.created_at).fromNow()}
                </p>
              </div>
            </div>
          )) : (
            <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
}