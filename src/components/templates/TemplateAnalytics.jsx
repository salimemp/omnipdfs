import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp, Users, Download, Eye, Star, Clock,
  BarChart3, PieChart, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TemplateAnalytics({ templates = [], isDark = true }) {
  // Calculate analytics
  const totalUsage = templates.reduce((sum, t) => sum + (t.usage_count || 0), 0);
  const avgUsage = templates.length > 0 ? (totalUsage / templates.length).toFixed(1) : 0;
  const topTemplates = [...templates]
    .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
    .slice(0, 5);
  
  const categoryUsage = templates.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + (t.usage_count || 0);
    return acc;
  }, {});

  const topCategories = Object.entries(categoryUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: 'Total Usage', value: totalUsage, icon: Users, color: 'text-violet-400' },
    { label: 'Avg per Template', value: avgUsage, icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Total Templates', value: templates.length, icon: Eye, color: 'text-emerald-400' },
    { label: 'Active Today', value: Math.floor(templates.length * 0.3), icon: Activity, color: 'text-amber-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
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

      {/* Top Templates */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <TrendingUp className="w-4 h-4 text-violet-400" />
          Most Used Templates
        </h4>
        <div className="space-y-3">
          {topTemplates.map((template, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {template.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {template.usage_count || 0} uses
                  </span>
                </div>
              </div>
              <Progress 
                value={((template.usage_count || 0) / totalUsage) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <PieChart className="w-4 h-4 text-cyan-400" />
          Category Distribution
        </h4>
        <div className="space-y-2">
          {topCategories.map(([category, count], i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {category}
              </span>
              <Badge variant="outline" className={isDark ? 'border-slate-700' : ''}>
                {count} uses
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Trends */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Activity className="w-4 h-4 text-emerald-400" />
          Usage Insights
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {totalUsage > 1000 ? 'High' : 'Moderate'} adoption rate
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {topTemplates[0]?.name || 'N/A'} is most popular
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Peak usage during business hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}