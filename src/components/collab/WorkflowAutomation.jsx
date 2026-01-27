import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Zap, Plus, Edit, Trash2, Play, Pause, CheckCircle2,
  Mail, Bell, FileText, Users, Calendar, GitBranch, ArrowRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const triggers = [
  { id: 'status_change', label: 'Status Changed', icon: GitBranch },
  { id: 'comment_added', label: 'Comment Added', icon: FileText },
  { id: 'user_added', label: 'User Invited', icon: Users },
  { id: 'approval_needed', label: 'Approval Required', icon: CheckCircle2 },
  { id: 'deadline_approaching', label: 'Deadline Near', icon: Calendar },
];

const actions = [
  { id: 'send_email', label: 'Send Email', icon: Mail, requiresConfig: true },
  { id: 'send_notification', label: 'Send Notification', icon: Bell, requiresConfig: true },
  { id: 'assign_user', label: 'Assign User', icon: Users, requiresConfig: true },
  { id: 'change_status', label: 'Change Status', icon: GitBranch, requiresConfig: true },
  { id: 'create_task', label: 'Create Task', icon: CheckCircle2, requiresConfig: true },
];

const defaultWorkflows = [
  {
    id: 1,
    name: 'Auto-approve Reviews',
    trigger: 'status_change',
    triggerConfig: { status: 'in_review' },
    actions: [
      { type: 'send_notification', config: { message: 'Document ready for review' } },
      { type: 'assign_user', config: { role: 'admin' } }
    ],
    enabled: true
  },
  {
    id: 2,
    name: 'Deadline Reminders',
    trigger: 'deadline_approaching',
    triggerConfig: { days: 2 },
    actions: [
      { type: 'send_email', config: { template: 'deadline_reminder' } },
      { type: 'send_notification', config: { message: 'Deadline in 2 days' } }
    ],
    enabled: true
  }
];

export default function WorkflowAutomation({ collaborationId, isDark = true }) {
  const [workflows, setWorkflows] = useState(defaultWorkflows);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    trigger: '',
    actions: [],
    enabled: true
  });

  const toggleWorkflow = (id) => {
    setWorkflows(prev =>
      prev.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w)
    );
    toast.success('Workflow updated');
  };

  const createWorkflow = async () => {
    if (!newWorkflow.name || !newWorkflow.trigger || newWorkflow.actions.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const workflow = {
      ...newWorkflow,
      id: Date.now()
    };

    setWorkflows(prev => [...prev, workflow]);
    setShowCreateDialog(false);
    setNewWorkflow({ name: '', trigger: '', actions: [], enabled: true });
    toast.success('Workflow created');

    // Log activity
    await base44.entities.ActivityLog.create({
      action: 'create_task',
      details: { type: 'workflow_created', name: workflow.name }
    });
  };

  const deleteWorkflow = (id) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    toast.success('Workflow deleted');
  };

  const addAction = (actionType) => {
    setNewWorkflow(prev => ({
      ...prev,
      actions: [...prev.actions, { type: actionType, config: {} }]
    }));
  };

  const removeAction = (index) => {
    setNewWorkflow(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Workflow Automation
          </h4>
          <Badge variant="outline" className={isDark ? 'border-slate-700' : ''}>
            {workflows.filter(w => w.enabled).length} Active
          </Badge>
        </div>
        <Button
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          <Plus className="w-4 h-4 mr-1" />
          New Workflow
        </Button>
      </div>

      {/* Workflows List */}
      <div className="space-y-3">
        {workflows.map((workflow, i) => {
          const TriggerIcon = triggers.find(t => t.id === workflow.trigger)?.icon || Zap;
          return (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl p-4 border ${
                isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
              } ${!workflow.enabled ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    workflow.enabled ? 'bg-violet-500/20' : isDark ? 'bg-slate-700' : 'bg-slate-200'
                  }`}>
                    <TriggerIcon className={`w-5 h-5 ${workflow.enabled ? 'text-violet-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{workflow.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {triggers.find(t => t.id === workflow.trigger)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={workflow.enabled}
                    onCheckedChange={() => toggleWorkflow(workflow.id)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteWorkflow(workflow.id)}
                    className={`h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions Flow */}
              <div className="flex items-center gap-2 flex-wrap">
                {workflow.actions.map((action, i) => {
                  const ActionIcon = actions.find(a => a.id === action.type)?.icon || Zap;
                  return (
                    <React.Fragment key={i}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                        isDark ? 'bg-slate-900/50' : 'bg-white'
                      }`}>
                        <ActionIcon className="w-3 h-3 text-cyan-400" />
                        <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {actions.find(a => a.id === action.type)?.label}
                        </span>
                      </div>
                      {i < workflow.actions.length - 1 && (
                        <ArrowRight className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Create Workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Workflow Name
              </label>
              <Input
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                placeholder="e.g., Auto-assign reviewers"
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Trigger
              </label>
              <Select value={newWorkflow.trigger} onValueChange={(v) => setNewWorkflow({ ...newWorkflow, trigger: v })}>
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {triggers.map(t => (
                    <SelectItem key={t.id} value={t.id} className={isDark ? 'text-white' : ''}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Actions ({newWorkflow.actions.length})
              </label>
              <div className="space-y-2 mb-3">
                {newWorkflow.actions.map((action, i) => {
                  const ActionIcon = actions.find(a => a.id === action.type)?.icon || Zap;
                  return (
                    <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                      <ActionIcon className="w-4 h-4 text-cyan-400" />
                      <span className={`text-sm flex-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {actions.find(a => a.id === action.type)?.label}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeAction(i)}
                        className="h-6 w-6 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2">
                {actions.map(action => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => addAction(action.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button onClick={createWorkflow} className="bg-gradient-to-r from-violet-500 to-cyan-500">
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}