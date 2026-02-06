import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function AIWorkflowOptimizer({ workflow, isDark = true }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [optimizations, setOptimizations] = useState([
    {
      type: 'performance',
      title: 'Parallel Execution Opportunity',
      description: 'Steps "Compress" and "Quality Check" can run in parallel',
      impact: 'high',
      timeSaved: '2.3s',
      confidence: 94
    },
    {
      type: 'efficiency',
      title: 'Redundant Step Detected',
      description: 'OCR step unnecessary for text-based PDFs',
      impact: 'medium',
      timeSaved: '1.8s',
      confidence: 87
    },
    {
      type: 'reliability',
      title: 'Add Error Recovery',
      description: 'Implement retry logic for translation failures',
      impact: 'high',
      timeSaved: '0s',
      confidence: 92
    },
    {
      type: 'cost',
      title: 'Optimize AI Usage',
      description: 'Cache frequently requested translations',
      impact: 'medium',
      timeSaved: '0s',
      confidence: 89
    }
  ]);

  const impactColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-blue-500/20 text-blue-400'
  };

  const typeIcons = {
    performance: Zap,
    efficiency: TrendingUp,
    reliability: CheckCircle2,
    cost: Clock
  };

  const handleOptimize = (optimization) => {
    console.log('Applying optimization:', optimization);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                  AI Workflow Optimizer
                </CardTitle>
                <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Get intelligent suggestions to improve performance
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setAnalyzing(true)}
              className="bg-gradient-to-r from-violet-500 to-purple-600"
              disabled={analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Analyze Workflow'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Optimization Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Potential Time Saved', value: '4.1s', icon: Clock, color: 'emerald' },
          { label: 'Optimizations Found', value: optimizations.length, icon: Lightbulb, color: 'violet' },
          { label: 'Avg Confidence', value: '91%', icon: TrendingUp, color: 'blue' },
          { label: 'Critical Issues', value: '0', icon: AlertCircle, color: 'amber' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Optimization Recommendations */}
      <div className="space-y-3">
        {optimizations.map((opt, index) => {
          const Icon = typeIcons[opt.type];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/30' : 'bg-white border-slate-200 hover:border-violet-300'}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${opt.type === 'performance' ? 'violet' : opt.type === 'efficiency' ? 'blue' : opt.type === 'reliability' ? 'emerald' : 'amber'}-500/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${opt.type === 'performance' ? 'violet' : opt.type === 'efficiency' ? 'blue' : opt.type === 'reliability' ? 'emerald' : 'amber'}-400`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {opt.title}
                            </h3>
                            <Badge className={impactColors[opt.impact]} variant="outline">
                              {opt.impact} impact
                            </Badge>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        {opt.timeSaved !== '0s' && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              {opt.timeSaved} faster
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-1">
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Confidence:
                          </span>
                          <Progress value={opt.confidence} className="h-1.5 flex-1 max-w-32" />
                          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {opt.confidence}%
                          </span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleOptimize(opt)}
                          className="bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                        >
                          Apply
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* AI Insights */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Lightbulb className="w-5 h-5 text-amber-400" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Your workflow executes 23% faster than similar workflows in the platform
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Peak usage detected at 2-4 PM - consider scheduling heavy tasks outside this window
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                94.2% success rate - above platform average of 89%
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}