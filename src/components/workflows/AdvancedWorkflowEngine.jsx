import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Zap, Plus, Settings, Play, Save, Clock, Brain, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedWorkflowEngine({ document, isDark = true }) {
  const [workflowName, setWorkflowName] = useState('');
  const [steps, setSteps] = useState([]);
  const [executing, setExecuting] = useState(false);

  const stepTypes = [
    { id: 'ai_analysis', name: 'AI Analysis', icon: Brain, color: 'violet' },
    { id: 'conversion', name: 'Convert Format', icon: Zap, color: 'cyan' },
    { id: 'ocr', name: 'OCR Extract', icon: Zap, color: 'emerald' },
    { id: 'collaboration', name: 'Collaborate', icon: Zap, color: 'blue' },
    { id: 'notification', name: 'Send Notification', icon: Zap, color: 'amber' },
    { id: 'cloud_sync', name: 'Cloud Sync', icon: Cloud, color: 'indigo' },
    { id: 'conditional', name: 'Conditional', icon: Settings, color: 'rose' }
  ];

  const addStep = (typeId) => {
    const stepType = stepTypes.find(t => t.id === typeId);
    if (stepType) {
      setSteps([...steps, {
        id: Date.now(),
        type: typeId,
        name: stepType.name,
        icon: stepType.icon,
        color: stepType.color,
        params: {}
      }]);
    }
  };

  const executeWorkflow = async () => {
    if (!document || steps.length === 0) {
      toast.error('Document and steps required');
      return;
    }

    setExecuting(true);
    try {
      const response = await base44.functions.invoke('enhancedWorkflow', {
        action: 'execute_advanced',
        data: {
          documentId: document.id,
          workflow: { name: workflowName, steps }
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

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          Advanced Workflow Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Workflow Name"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
        />

        <Select onValueChange={addStep}>
          <SelectTrigger>
            <SelectValue placeholder="Add Step..." />
          </SelectTrigger>
          <SelectContent>
            {stepTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {steps.length > 0 && (
          <div className="space-y-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    isDark ? 'bg-slate-800' : 'bg-slate-50'
                  }`}
                >
                  <Badge className={`bg-${step.color}-500/20 text-${step.color}-400`}>
                    {idx + 1}
                  </Badge>
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{step.name}</span>
                </div>
              );
            })}
          </div>
        )}

        <Button
          onClick={executeWorkflow}
          disabled={executing || !document || steps.length === 0}
          className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
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
      </CardContent>
    </Card>
  );
}