import React, { useState } from 'react';
import { Zap, Play, Plus, Trash2, Edit, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../shared/LanguageContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIWorkflowEngine({ isDark }) {
  const { t } = useLanguage();
  const [workflows, setWorkflows] = useState([
    { id: 1, name: 'Auto-OCR & Translate', trigger: 'upload', steps: ['OCR', 'Translate'], status: 'active' },
    { id: 2, name: 'Compress & Archive', trigger: 'daily', steps: ['Compress', 'Archive'], status: 'active' },
  ]);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', trigger: 'upload', steps: [], conditions: [] });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  const availableActions = [
    'OCR', 'Translate', 'Compress', 'Watermark', 'Encrypt', 'Convert', 'Split', 'Merge', 'Archive', 
    'Summarize', 'Extract Data', 'Auto-Tag', 'Quality Check', 'Email Notification'
  ];

  const handleCreateWorkflow = async () => {
    if (!newWorkflow.name || newWorkflow.steps.length === 0) {
      toast.error('Please complete all fields');
      return;
    }

    const workflow = { id: Date.now(), ...newWorkflow, status: 'active', executions: 0, lastRun: null };
    setWorkflows([...workflows, workflow]);
    setNewWorkflow({ name: '', trigger: 'upload', steps: [] });
    
    try {
      await base44.functions.invoke('workflowAutomation', {
        action: 'create',
        workflow: workflow
      });
      toast.success('Workflow created and activated');
    } catch (error) {
      toast.error('Workflow created but activation failed');
    }

    await base44.entities.ActivityLog.create({
      action: 'workflow_created',
      details: { workflow_name: workflow.name, steps: workflow.steps }
    });
  };

  const handleDeleteWorkflow = (id) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    toast.success('Workflow deleted');
  };

  const handleToggleWorkflow = (id) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
    ));
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
        <Zap className="w-6 h-6 text-purple-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI-Powered {t('workflows')}
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Automate document processing with intelligent workflows
          </p>
        </div>
      </div>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Create New Workflow</CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            Set up automated document processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Workflow Name</Label>
            <Input
              value={newWorkflow.name}
              onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              placeholder="My Automation"
              className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Trigger</Label>
            <Select value={newWorkflow.trigger} onValueChange={(v) => setNewWorkflow({ ...newWorkflow, trigger: v })}>
              <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                <SelectItem value="upload">On Document Upload</SelectItem>
                <SelectItem value="daily">Daily Schedule</SelectItem>
                <SelectItem value="weekly">Weekly Schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Actions</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableActions.map(action => (
                <Button
                  key={action}
                  size="sm"
                  variant={newWorkflow.steps.includes(action) ? 'default' : 'outline'}
                  onClick={() => {
                    if (newWorkflow.steps.includes(action)) {
                      setNewWorkflow({ ...newWorkflow, steps: newWorkflow.steps.filter(s => s !== action) });
                    } else {
                      setNewWorkflow({ ...newWorkflow, steps: [...newWorkflow.steps, action] });
                    }
                  }}
                  className={newWorkflow.steps.includes(action) ? 'bg-violet-500' : ''}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline" className="flex-1">
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
            <Button 
              onClick={async () => {
                setAiGenerating(true);
                try {
                  const response = await base44.integrations.Core.InvokeLLM({
                    prompt: `Suggest an intelligent document workflow based on: "${newWorkflow.name || 'document processing'}". Include 3-5 relevant automation steps.`,
                    response_json_schema: {
                      type: "object",
                      properties: {
                        steps: { type: "array", items: { type: "string" } },
                        description: { type: "string" }
                      }
                    }
                  });
                  setNewWorkflow({ ...newWorkflow, steps: response.steps });
                  toast.success('AI suggested workflow steps');
                } catch (e) {
                  toast.error('AI suggestion failed');
                }
                setAiGenerating(false);
              }}
              disabled={aiGenerating}
              className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {aiGenerating ? 'Generating...' : 'AI Suggest'}
            </Button>
          </div>

          {showAdvanced && (
            <div className="space-y-3 p-3 rounded-lg bg-slate-800/30">
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Conditions (Optional)</Label>
              <Input
                placeholder="e.g., file size > 5MB, file type = pdf"
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}
              />
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    <SelectItem value="all">Run if all conditions met</SelectItem>
                    <SelectItem value="any">Run if any condition met</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button onClick={handleCreateWorkflow} className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Active Workflows</h3>
        {workflows.map(workflow => (
          <Card key={workflow.id} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{workflow.name}</h4>
                    <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} className={workflow.status === 'active' ? 'bg-green-500' : ''}>
                      {workflow.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {workflow.steps.map((step, i) => (
                      <Badge key={i} variant="outline" className={isDark ? 'border-violet-500/30 text-violet-300' : 'border-violet-300 text-violet-600'}>
                        {step}
                      </Badge>
                    ))}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {workflow.executions || 0} executions • Trigger: {workflow.trigger}
                    {workflow.lastRun && ` • Last run: ${new Date(workflow.lastRun).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleWorkflow(workflow.id)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteWorkflow(workflow.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}