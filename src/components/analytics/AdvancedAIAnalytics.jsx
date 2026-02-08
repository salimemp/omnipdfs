import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Brain, Target, Zap, BarChart3, PieChart,
  Activity, ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedAIAnalytics({ isDark = false }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);

  const generateInsights = async () => {
    setAnalyzing(true);
    try {
      const docs = await base44.entities.Document.list();
      const jobs = await base44.entities.ConversionJob.list();
      const logs = await base44.entities.ActivityLog.list();

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze document management data and provide actionable insights:
        
        Documents: ${docs.length} files
        Conversions: ${jobs.length} jobs
        Activities: ${logs.length} actions
        
        Provide:
        1. Usage trends and patterns
        2. Performance metrics
        3. Cost optimization recommendations
        4. Security insights
        5. Productivity suggestions
        6. Predicted future needs
        
        Format as actionable business intelligence.`,
        response_json_schema: {
          type: "object",
          properties: {
            trends: { type: "array", items: { type: "object" } },
            metrics: { type: "object" },
            recommendations: { type: "array", items: { type: "string" } },
            predictions: { type: "array", items: { type: "string" } }
          }
        }
      });

      setInsights(result);
      toast.success('AI analysis complete');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const metrics = [
    { label: 'Usage Efficiency', value: '94%', change: '+12%', trend: 'up', icon: Target, color: 'emerald' },
    { label: 'Processing Speed', value: '2.3s', change: '-0.5s', trend: 'up', icon: Zap, color: 'violet' },
    { label: 'Storage Optimization', value: '87%', change: '+5%', trend: 'up', icon: BarChart3, color: 'blue' },
    { label: 'User Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up', icon: Activity, color: 'amber' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${isDark ? 'bg-gradient-to-br from-violet-500/10 to-blue-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AI-Powered Analytics
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Intelligent insights and predictions
                </p>
              </div>
            </div>
            <Button
              onClick={generateInsights}
              disabled={analyzing}
              className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-${metric.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${metric.color}-400`} />
                    </div>
                    <Badge className={`${metric.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                      <TrendIcon className="w-3 h-3 mr-1" />
                      {metric.change}
                    </Badge>
                  </div>
                  <p className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {metric.value}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights */}
      {insights && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Key Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.recommendations?.slice(0, 5).map((rec, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}
                  >
                    <p className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                      • {rec}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Sparkles className="w-5 h-5 text-blue-400" />
                Future Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.predictions?.slice(0, 5).map((pred, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}
                  >
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                      • {pred}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}