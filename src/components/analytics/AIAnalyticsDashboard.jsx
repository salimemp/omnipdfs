import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileText, Zap, Activity, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIAnalyticsDashboard({ isDark = true }) {
  const [metrics, setMetrics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await base44.functions.invoke('aiAnalytics', {
        action: 'get_insights',
        timeRange: '30d'
      });

      if (response.data.success) {
        setMetrics(response.data.metrics);
        setInsights(response.data.insights);
      }
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const impactColors = {
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    low: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-violet-400" />
              <Badge variant="secondary">30 days</Badge>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {metrics?.totalDocuments || 0}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Documents
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-cyan-400" />
              <Badge variant="secondary">30 days</Badge>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {metrics?.totalConversions || 0}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Conversions
            </p>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <Badge variant="secondary">30 days</Badge>
            </div>
            <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {metrics?.successRate || 0}%
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Success Rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {insight.title}
                </h4>
                <Badge className={impactColors[insight.impact] || impactColors.low}>
                  {insight.impact}
                </Badge>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {insight.description}
              </p>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>File Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics?.fileTypes && Object.entries(metrics.fileTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {type.toUpperCase()}
                  </span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Activity Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics?.activityTypes && Object.entries(metrics.activityTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <Badge>{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}