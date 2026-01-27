import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Workflow, Play, Pause, CheckCircle2, Loader2, Sparkles,
  FileText, ArrowRight, Zap, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const workflowTemplates = [
  {
    id: 'review_approve',
    name: 'Review & Approve',
    description: 'AI reviews document quality, assigns reviewers, sends for approval',
    steps: ['AI Quality Check', 'Auto-assign Reviewer', 'Send Notification', 'Track Approval']
  },
  {
    id: 'extract_process',
    name: 'Extract & Process',
    description: 'Extract data from documents, validate, and store in database',
    steps: ['OCR/Extract', 'AI Validation', 'Data Mapping', 'Store Data']
  },
  {
    id: 'translate_publish',
    name: 'Translate & Publish',
    description: 'Translate document to multiple languages and publish',
    steps: ['AI Translation', 'Quality Check', 'Format Conversion', 'Publish']
  },
  {
    id: 'summarize_share',
    name: 'Summarize & Share',
    description: 'Generate summary and share with stakeholders',
    steps: ['AI Summarization', 'Create Highlights', 'Share via Email', 'Track Views']
  }
];

export default function AIWorkflowEngine({ document, isDark = true }) {
  const [running, setRunning] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const runWorkflow = async (workflow) => {
    setActiveWorkflow(workflow);
    setRunning(true);
    setProgress(0);
    setCurrentStep(0);

    try {
      for (let i = 0; i < workflow.steps.length; i++) {
        setCurrentStep(i);
        setProgress(((i + 1) / workflow.steps.length) * 100);
        
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast.success(`${workflow.steps[i]} completed`);
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        document_name: document?.name,
        details: { workflow: workflow.name, steps_completed: workflow.steps.length }
      });

      toast.success('Workflow completed successfully!');
    } catch (e) {
      toast.error('Workflow failed');
    }

    setRunning(false);
    setActiveWorkflow(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Workflow className="w-5 h-5 text-violet-400" />
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          AI Workflow Automation
        </h3>
      </div>

      {/* Workflow Templates */}
      <div className="grid md:grid-cols-2 gap-3">
        {workflowTemplates.map((workflow, i) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl p-4 border ${
              activeWorkflow?.id === workflow.id
                ? isDark ? 'bg-violet-500/10 border-violet-500/50' : 'bg-violet-50 border-violet-300'
                : isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-slate-700' : 'bg-white'
              }`}>
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {workflow.name}
                </h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {workflow.description}
                </p>
              </div>
            </div>

            {/* Steps Preview */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto">
              {workflow.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <Badge 
                    variant="outline" 
                    className={`text-xs whitespace-nowrap ${
                      activeWorkflow?.id === workflow.id && i <= currentStep
                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/50'
                        : isDark ? 'border-slate-600 text-slate-500' : 'text-slate-600'
                    }`}
                  >
                    {step}
                  </Badge>
                  {i < workflow.steps.length - 1 && (
                    <ArrowRight className={`w-3 h-3 shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button
              size="sm"
              onClick={() => runWorkflow(workflow)}
              disabled={running || !document}
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
            >
              {running && activeWorkflow?.id === workflow.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Run Workflow
                </>
              )}
            </Button>

            {/* Progress */}
            {running && activeWorkflow?.id === workflow.id && (
              <div className="mt-3">
                <Progress value={progress} className="h-1" />
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {workflow.steps[currentStep]}...
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}