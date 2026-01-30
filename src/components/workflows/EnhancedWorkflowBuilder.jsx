import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Zap, Plus, Trash2, Play, Save, Clock, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EnhancedWorkflowBuilder({ document, isDark = true }) {
  const [workflowName, setWorkflowName] = useState('');
  const [trigger, setTrigger] = useState('manual');
  const [steps, setSteps] = useState([]);
  const [executing, setExecuting] = useState(false);

  const availableSteps = [
    { id: 'extract_text', name: 'Extract Text (OCR)', icon: FileText },
    { id: 'summarize', name: 'Summarize Document', icon: FileText },
    { id: 'translate', name: 'Translate', icon: FileText },
    { id: 'tag', name: 'Auto-Tag', icon: FileText },
    { id: 'convert', name: 'Convert Format', icon: FileText },
    { id: 'compress', name: 'Compress File', icon: FileText },
    { id: 'watermark', name: 'Add Watermark', icon: FileText },
    { id: 'email', name: 'Send Email', icon: Mail }
  ];

  const addStep = (stepId) => {
    const step = availableSteps.find(s => s.id === stepId);
    if (step) {
      setSteps([...steps, { ...step, params: {} }]);
    }
  };

  const removeStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const executeWorkflow = async () => {
    if (steps.length === 0) {
      toast.error('Add at least one step to the workflow');
      return;
    }

    setExecuting(true);
    try {
      const response = await base44.functions.invoke('workflowAutomation', {
        action: 'execute_workflow',
        data: {
          documentId: document.id,
          steps: steps
        }
      });

      if (response.data.success) {
        toast.success('Workflow completed successfully');
      }
    } catch (error) {
      toast.error('Workflow execution failed');
      console.error(error);
    } finally {
      setExecuting(false);
    }
  };

  const saveWorkflow = async () => {
    if (!workflowName) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      await base44.functions.invoke('workflowAutomation', {
        action: 'save_workflow',
        data: {
          name: workflowName,
          trigger,
          actions: steps
        }
      });

      toast.success('Workflow saved');
    } catch (error) {
      toast.error('Failed to save workflow');
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-400" />
            Workflow Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Workflow Name
            </label>
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="My Automated Workflow"
            />
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Trigger
            </label>
            <Select value={trigger} onValueChange={setTrigger}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="upload">On Upload</SelectItem>
                <SelectItem value="schedule">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={`text-sm mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Add Step
            </label>
            <Select onValueChange={addStep}>
              <SelectTrigger>
                <SelectValue placeholder="Choose action..." />
              </SelectTrigger>
              <SelectContent>
                {availableSteps.map(step => (
                  <SelectItem key={step.id} value={step.id}>
                    {step.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {steps.length > 0 && (
            <div className="space-y-2">
              <label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Workflow Steps ({steps.length})
              </label>
              <Reorder.Group values={steps} onReorder={setSteps} className="space-y-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Reorder.Item key={`${step.id}-${index}`} value={step}>
                      <motion.div
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-500/20">
                          <span className="text-xs font-bold text-violet-400">{index + 1}</span>
                        </div>
                        <Icon className="w-4 h-4 text-violet-400" />
                        <span className="flex-1 text-sm font-medium">{step.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeStep(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={executeWorkflow}
              disabled={executing || steps.length === 0}
              className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              {executing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute Workflow
                </>
              )}
            </Button>
            <Button
              onClick={saveWorkflow}
              variant="outline"
              disabled={!workflowName || steps.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}