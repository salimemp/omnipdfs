import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Workflow, Play, Plus, Trash2, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const workflowSteps = [
  { id: 'summarize', name: 'Summarize', icon: '📝', description: 'Generate summary' },
  { id: 'extract_data', name: 'Extract Data', icon: '🔍', description: 'Extract structured data' },
  { id: 'translate', name: 'Translate', icon: '🌐', description: 'Translate document' },
  { id: 'generate_questions', name: 'Generate Q&A', icon: '❓', description: 'Create questions' },
  { id: 'create_outline', name: 'Create Outline', icon: '📋', description: 'Generate outline' },
  { id: 'sentiment_analysis', name: 'Sentiment', icon: '😊', description: 'Analyze sentiment' },
  { id: 'auto-tag', name: 'Auto-Tag', icon: '🏷️', description: 'Generate tags' }
];

const workflowTemplates = [
  {
    id: 'research',
    name: 'Research Analysis',
    icon: '🔬',
    description: 'Complete research document analysis',
    steps: ['summarize', 'extract_data', 'create_outline', 'generate_questions']
  },
  {
    id: 'legal',
    name: 'Legal Review',
    icon: '⚖️',
    description: 'Legal document processing',
    steps: ['extract_data', 'sentiment_analysis', 'auto-tag']
  },
  {
    id: 'content',
    name: 'Content Analysis',
    icon: '📄',
    description: 'Full content analysis',
    steps: ['summarize', 'sentiment_analysis', 'generate_questions', 'auto-tag']
  },
  {
    id: 'translation',
    name: 'Translation Bundle',
    icon: '🌐',
    description: 'Translate and summarize',
    steps: ['translate', 'summarize', 'auto-tag']
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Review',
    icon: '📊',
    description: 'Full document analysis package',
    steps: ['summarize', 'extract_data', 'create_outline', 'sentiment_analysis', 'generate_questions', 'auto-tag']
  }
];

export default function PDFWorkflowBuilder({ document, isDark }) {
  const [workflow, setWorkflow] = useState([]);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedWorkflows, setSavedWorkflows] = useState([]);
  const [workflowName, setWorkflowName] = useState('');

  const addStep = (stepId) => {
    const step = workflowSteps.find(s => s.id === stepId);
    if (step) {
      setWorkflow([...workflow, { ...step, status: 'pending' }]);
    }
  };

  const removeStep = (index) => {
    setWorkflow(workflow.filter((_, i) => i !== index));
  };

  const applyTemplate = (templateId) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (template) {
      const steps = template.steps.map(stepId => ({
        ...workflowSteps.find(s => s.id === stepId),
        status: 'pending'
      }));
      setWorkflow(steps);
      toast.success(`Applied ${template.name} template`);
    }
  };

  const saveWorkflow = () => {
    if (!workflowName || workflow.length === 0) {
      toast.error('Enter a name and add steps');
      return;
    }
    setSavedWorkflows([...savedWorkflows, { name: workflowName, steps: workflow }]);
    toast.success('Workflow saved');
    setWorkflowName('');
  };

  const loadWorkflow = (saved) => {
    setWorkflow(saved.steps.map(s => ({ ...s, status: 'pending' })));
    toast.success(`Loaded ${saved.name}`);
  };

  const runWorkflow = async () => {
    if (!document || workflow.length === 0) return;
    
    setRunning(true);
    setResults([]);
    setCurrentStep(0);

    try {
      for (let i = 0; i < workflow.length; i++) {
        setCurrentStep(i);
        const step = workflow[i];
        
        // Update step status to running
        setWorkflow(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: 'running' } : s
        ));

        try {
          let result;
          
          if (step.id === 'summarize' || step.id === 'auto-tag') {
            result = await base44.functions.invoke('processWithGemini', {
              fileUrl: document.file_url,
              action: step.id
            });
          } else {
            result = await base44.functions.invoke('enhancedAIProcessing', {
              fileUrl: document.file_url,
              action: step.id
            });
          }

          if (result.data.success) {
            setResults(prev => [...prev, { step: step.name, result: result.data.result }]);
            setWorkflow(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: 'completed' } : s
            ));
          } else {
            throw new Error('Processing failed');
          }
        } catch (error) {
          setWorkflow(prev => prev.map((s, idx) => 
            idx === i ? { ...s, status: 'error' } : s
          ));
          toast.error(`Step ${i + 1} failed: ${step.name}`);
        }

        // Small delay between steps
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast.success('Workflow completed!');
    } catch (error) {
      toast.error('Workflow execution failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Workflow className="w-5 h-5 text-violet-400" />
            Build AI Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 mb-4">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Quick Start Templates</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {workflowTemplates.map(template => (
                <Button
                  key={template.id}
                  variant="outline"
                  onClick={() => applyTemplate(template.id)}
                  className={`h-auto py-3 flex flex-col items-start ${isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <div className="text-2xl mb-1">{template.icon}</div>
                  <div className="text-xs font-medium text-left">{template.name}</div>
                  <div className={`text-xs text-left ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {template.steps.length} steps
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Select onValueChange={addStep}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                <SelectValue placeholder="Add workflow step..." />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                {workflowSteps.map(step => (
                  <SelectItem key={step.id} value={step.id} className={isDark ? 'text-white' : 'text-slate-900'}>
                    <div className="flex items-center gap-2">
                      <span>{step.icon}</span>
                      <div>
                        <p className="font-medium">{step.name}</p>
                        <p className="text-xs opacity-60">{step.description}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {workflow.length > 0 && (
            <div className="flex gap-2">
              <Input
                placeholder="Workflow name (optional)"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}
              />
              <Button onClick={saveWorkflow} variant="outline" disabled={!workflowName}>
                Save
              </Button>
            </div>
          )}

          {savedWorkflows.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {savedWorkflows.map((saved, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer hover:bg-violet-500/20"
                  onClick={() => loadWorkflow(saved)}
                >
                  {saved.name}
                </Badge>
              ))}
            </div>
          )}

          {workflow.length > 0 && (
            <div className="space-y-2">
              {workflow.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDark ? 'bg-slate-800/50' : 'bg-slate-100'
                  }`}
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step.status === 'completed' ? 'bg-emerald-500/20' :
                    step.status === 'running' ? 'bg-blue-500/20' :
                    step.status === 'error' ? 'bg-red-500/20' :
                    'bg-slate-700'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : step.status === 'running' ? (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{step.icon}</span>
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {step.name}
                      </span>
                      <Badge variant="secondary" className="ml-auto">
                        {step.status}
                      </Badge>
                    </div>
                  </div>

                  {!running && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStep(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {index < workflow.length - 1 && (
                    <ArrowRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {workflow.length > 0 && (
            <Button
              onClick={runWorkflow}
              disabled={running || !document}
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Step {currentStep + 1}/{workflow.length}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Workflow
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Workflow Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}
              >
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {result.step}
                </h4>
                <pre className={`text-sm whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {result.result}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}