import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AutomationInsights({ isDark = true }) {
  const insights = {
    totalAutomations: 24,
    activeWorkflows: 18,
    executionsToday: 156,
    successRate: 94.2,
    avgExecutionTime: '2.3s',
    timeSaved: '43.2h',
    topWorkflows: [
      { name: 'Auto OCR & Translate', executions: 45, success: 98, time: '3.2s' },
      { name: 'Compress & Archive', executions: 38, success: 100, time: '1.8s' },
      { name: 'AI Summarization', executions: 32, success: 91, time: '4.1s' },
      { name: 'Email Notifications', executions: 28, success: 96, time: '0.9s' }
    ],
    recentTrends: [
      { metric: 'Automation Usage', value: '+23%', trend: 'up' },
      { metric: 'Success Rate', value: '+5.2%', trend: 'up' },
      { metric: 'Avg Exec Time', value: '-12%', trend: 'down' },
      { metric: 'Error Rate', value: '-3.1%', trend: 'down' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-50 to-cyan-50 border border-violet-200'}`}>
        <BarChart3 className="w-6 h-6 text-violet-400" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Automation Insights
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            AI-powered analytics and performance metrics
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Automations', value: insights.totalAutomations, icon: Zap, color: 'violet' },
          { label: 'Active Today', value: insights.executionsToday, icon: Activity, color: 'cyan' },
          { label: 'Success Rate', value: `${insights.successRate}%`, icon: Target, color: 'emerald' },
          { label: 'Time Saved', value: insights.timeSaved, icon: Clock, color: 'amber' }
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${metric.color}-500/20 flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {metric.value}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {metric.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Performing Workflows */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Award className="w-5 h-5 text-amber-400" />
            Top Performing Workflows
          </CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Most executed workflows this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.topWorkflows.map((workflow, i) => (
              <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {workflow.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {workflow.executions} executions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {workflow.success}% success
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-slate-700' : 'border-slate-300'}>
                      {workflow.time}
                    </Badge>
                  </div>
                </div>
                <Progress value={workflow.success} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            Performance Trends
          </CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Week over week comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.recentTrends.map((trend, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  trend.trend === 'up' 
                    ? isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    : isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {trend.metric}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${
                      trend.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {trend.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    trend.trend === 'up' 
                      ? 'bg-emerald-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    <TrendingUp className={`w-5 h-5 ${
                      trend.trend === 'up' ? 'text-emerald-400' : 'text-red-400 rotate-180'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className={isDark ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <CheckCircle2 className="w-5 h-5 text-violet-400" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Consider adding error handling to "Auto OCR & Translate" workflow
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                "Email Notifications" workflow shows consistent performance - good candidate for scaling
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Peak usage detected between 2-4 PM - optimize resource allocation
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}