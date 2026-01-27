import React, { useState } from 'react';
import { Zap, Plus, Play, Pause, Trash2, Settings, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function WorkflowAutomation({ isDark }) {
  const [workflows, setWorkflows] = useState([
    { id: 1, name: 'Auto-compress & Archive', trigger: 'upload', actions: ['compress', 'move_to_folder'], status: 'active' },
    { id: 2, name: 'OCR & Translate', trigger: 'tag:scanned', actions: ['ocr', 'translate'], status: 'paused' },
  ]);
  const [creating, setCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', trigger: '', actions: [] });

  const triggers = ['upload', 'convert', 'tag', 'schedule'];
  const actions = ['compress', 'ocr', 'translate', 'convert', 'protect', 'sign', 'move_to_folder', 'email'];

  const createWorkflow = async () => {
    if (!newWorkflow.name || !newWorkflow.trigger || newWorkflow.actions.length === 0) {
      toast.error('Please fill all fields');
      return;
    }

    const workflow = { ...newWorkflow, id: Date.now(), status: 'active' };
    setWorkflows([...workflows, workflow]);
    setNewWorkflow({ name: '', trigger: '', actions: [] });
    setCreating(false);
    toast.success('Workflow created');

    await base44.entities.ActivityLog.create({
      action: 'convert',
      details: { type: 'workflow_created', name: workflow.name }
    });
  };

  const toggleWorkflow = (id) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
    ));
  };

  const deleteWorkflow = (id) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    toast.success('Workflow deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Workflow Automation
        </h3>
        <Button size="sm" onClick={() => setCreating(!creating)} className="bg-violet-500">
          <Plus className="w-4 h-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {creating && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Workflow Name</Label>
              <Input
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                placeholder="e.g., Auto-process invoices"
                className={isDark ? 'bg-slate-800 border-slate-700' : ''}
              />
            </div>

            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Trigger</Label>
              <Select value={newWorkflow.trigger} onValueChange={(v) => setNewWorkflow({ ...newWorkflow, trigger: v })}>
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggers.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Actions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {actions.map(action => (
                  <Badge
                    key={action}
                    variant={newWorkflow.actions.includes(action) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const updated = newWorkflow.actions.includes(action)
                        ? newWorkflow.actions.filter(a => a !== action)
                        : [...newWorkflow.actions, action];
                      setNewWorkflow({ ...newWorkflow, actions: updated });
                    }}
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createWorkflow} className="bg-violet-500">Create</Button>
              <Button variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {workflows.map(workflow => (
          <Card key={workflow.id} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    workflow.status === 'active' ? 'bg-emerald-500/20' : 'bg-slate-500/20'
                  }`}>
                    {workflow.status === 'active' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {workflow.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {workflow.trigger}
                      </Badge>
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>→</span>
                      {workflow.actions.map(action => (
                        <Badge key={action} className="text-xs bg-violet-500/20 text-violet-400">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleWorkflow(workflow.id)}
                    className={isDark ? 'text-slate-400' : 'text-slate-500'}
                  >
                    {workflow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteWorkflow(workflow.id)}
                    className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
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