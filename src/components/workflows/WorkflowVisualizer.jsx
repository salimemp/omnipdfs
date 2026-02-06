import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Workflow, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Zap,
  FileText,
  Globe,
  Mail,
  Database,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const stepIcons = {
  OCR: FileText,
  Translate: Globe,
  Compress: Database,
  Summarize: Sparkles,
  'Extract Data': Database,
  'Auto-Tag': Zap,
  'Quality Check': CheckCircle2,
  'Email Notification': Mail
};

export default function WorkflowVisualizer({ workflow, execution, isDark = true }) {
  const [selectedStep, setSelectedStep] = useState(null);

  const getStepStatus = (stepName) => {
    if (!execution) return 'pending';
    const result = execution.results?.find(r => r.step === stepName);
    return result?.status || 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/20';
      case 'processing': return 'text-blue-400 bg-blue-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'processing': return Clock;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                  {workflow.name}
                </CardTitle>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Trigger: {workflow.trigger}
                </p>
              </div>
            </div>
            <Badge className={workflow.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}>
              {workflow.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Execution Progress */}
      {execution && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Execution Progress
              </span>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {execution.results?.filter(r => r.status === 'completed').length || 0} / {workflow.steps.length}
              </span>
            </div>
            <Progress 
              value={(execution.results?.filter(r => r.status === 'completed').length || 0) / workflow.steps.length * 100}
              className="h-2"
            />
          </CardContent>
        </Card>
      )}

      {/* Workflow Steps Visualization */}
      <div className="relative">
        <div className="space-y-4">
          {workflow.steps.map((step, index) => {
            const status = getStepStatus(step);
            const Icon = stepIcons[step] || FileText;
            const StatusIcon = getStatusIcon(status);
            const isLast = index === workflow.steps.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connection Line */}
                {!isLast && (
                  <div 
                    className={`absolute left-6 top-16 w-0.5 h-8 ${
                      status === 'completed' ? 'bg-emerald-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                    }`}
                  />
                )}

                <Card 
                  className={`cursor-pointer transition-all ${
                    selectedStep === index ? 'ring-2 ring-violet-500' : ''
                  } ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                  onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Step Number & Icon */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          status === 'completed' ? 'bg-emerald-500/20' :
                          status === 'processing' ? 'bg-blue-500/20' :
                          status === 'failed' ? 'bg-red-500/20' :
                          'bg-slate-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            status === 'completed' ? 'text-emerald-400' :
                            status === 'processing' ? 'text-blue-400' :
                            status === 'failed' ? 'text-red-400' :
                            'text-slate-400'
                          }`} />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${
                          getStatusColor(status)
                        }`}>
                          <StatusIcon className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {step}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            Step {index + 1}
                          </Badge>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {status === 'completed' && 'Completed successfully'}
                          {status === 'processing' && 'Currently processing...'}
                          {status === 'failed' && 'Failed to execute'}
                          {status === 'pending' && 'Waiting to execute'}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>

                    {/* Expanded Details */}
                    {selectedStep === index && execution && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                      >
                        {execution.results?.find(r => r.step === step)?.result && (
                          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              Result:
                            </p>
                            <pre className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} overflow-x-auto`}>
                              {JSON.stringify(execution.results.find(r => r.step === step)?.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      {!execution && (
        <div className="flex gap-3">
          <Button className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600">
            <Play className="w-4 h-4 mr-2" />
            Execute Workflow
          </Button>
          <Button variant="outline" className={isDark ? 'border-slate-700' : 'border-slate-200'}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}