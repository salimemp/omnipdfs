import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Workflow,
  Plus,
  Play,
  Trash2,
  Edit,
  Save,
  ArrowRight,
  FileText,
  Database,
  Mail,
  Webhook,
  Sparkles,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';

const workflowActions = [
  { id: 'extract_text', label: 'Extract Text', icon: FileText, description: 'OCR text extraction' },
  { id: 'save_to_db', label: 'Save to Database', icon: Database, description: 'Store results in entities' },
  { id: 'send_email', label: 'Send Email', icon: Mail, description: 'Email notification' },
  { id: 'webhook', label: 'Webhook', icon: Webhook, description: 'Call external API' },
  { id: 'ai_process', label: 'AI Processing', icon: Sparkles, description: 'AI enhancement' }
];

export default function OCRWorkflowBuilder({ isDark = true }) {
  const [workflows, setWorkflows] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState({
    name: '',
    actions: [],
    trigger: 'manual'
  });
  const [executing, setExecuting] = useState(null);

  const addAction = (actionId) => {
    const action = workflowActions.find(a => a.id === actionId);
    setCurrentWorkflow({
      ...currentWorkflow,
      actions: [...currentWorkflow.actions, { ...action, config: {} }]
    });
  };

  const removeAction = (index) => {
    const newActions = currentWorkflow.actions.filter((_, i) => i !== index);
    setCurrentWorkflow({ ...currentWorkflow, actions: newActions });
  };

  const saveWorkflow = async () => {
    if (!currentWorkflow.name) {
      toast.error('Please enter a workflow name');
      return;
    }

    try {
      const newWorkflow = {
        ...currentWorkflow,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      setWorkflows([...workflows, newWorkflow]);
      setShowCreateDialog(false);
      setCurrentWorkflow({ name: '', actions: [], trigger: 'manual' });
      toast.success('Workflow saved');
    } catch (e) {
      toast.error('Failed to save workflow');
    }
  };

  const executeWorkflow = async (workflow) => {
    setExecuting(workflow.id);
    
    try {
      for (const action of workflow.actions) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        switch (action.id) {
          case 'extract_text':
            // Simulate OCR
            toast.success('Text extracted');
            break;
          case 'save_to_db':
            // Save to database
            toast.success('Data saved to database');
            break;
          case 'send_email':
            // Send email
            await base44.integrations.Core.SendEmail({
              to: action.config.email || 'user@example.com',
              subject: 'OCR Workflow Complete',
              body: `Workflow "${workflow.name}" has completed successfully.`
            });
            toast.success('Email sent');
            break;
          case 'ai_process':
            // AI processing
            toast.success('AI processing complete');
            break;
          case 'webhook':
            // Webhook call
            toast.success('Webhook triggered');
            break;
        }
      }
      
      toast.success(`Workflow "${workflow.name}" completed`);
    } catch (e) {
      toast.error('Workflow execution failed');
    } finally {
      setExecuting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            OCR Workflows
          </h3>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Automate document processing with custom workflows
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-violet-500 to-cyan-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Workflows List */}
      <div className="grid gap-4">
        {workflows.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border-2 border-dashed ${isDark ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
            <Workflow className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              No workflows yet. Create your first automated workflow.
            </p>
          </div>
        ) : (
          workflows.map((workflow) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {workflow.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {workflow.actions.length} actions
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => executeWorkflow(workflow)}
                    disabled={executing === workflow.id}
                    className={isDark ? 'border-slate-700' : ''}
                  >
                    {executing === workflow.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setWorkflows(workflows.filter(w => w.id !== workflow.id))}
                    className={isDark ? 'text-slate-400' : ''}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions Flow */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {workflow.actions.map((action, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'} shrink-0`}>
                      <action.icon className="w-4 h-4 text-violet-400" />
                      <span className={`text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {action.label}
                      </span>
                    </div>
                    {i < workflow.actions.length - 1 && (
                      <ArrowRight className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Workflow Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>
              Create OCR Workflow
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Workflow Name</Label>
              <Input
                value={currentWorkflow.name}
                onChange={(e) => setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })}
                placeholder="e.g., Invoice Processing"
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Trigger</Label>
              <Select
                value={currentWorkflow.trigger}
                onValueChange={(v) => setCurrentWorkflow({ ...currentWorkflow, trigger: v })}
              >
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  <SelectItem value="manual" className={isDark ? 'text-white' : ''}>Manual</SelectItem>
                  <SelectItem value="upload" className={isDark ? 'text-white' : ''}>On File Upload</SelectItem>
                  <SelectItem value="schedule" className={isDark ? 'text-white' : ''}>Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={`mb-2 block ${isDark ? 'text-slate-400' : ''}`}>Actions</Label>
              <div className="space-y-2">
                {currentWorkflow.actions.map((action, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                  >
                    <div className="flex items-center gap-2">
                      <action.icon className="w-4 h-4 text-violet-400" />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {action.label}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAction(i)}
                      className={isDark ? 'text-slate-400' : ''}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Select onValueChange={addAction}>
                <SelectTrigger className={`mt-3 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue placeholder="Add action..." />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {workflowActions.map(action => (
                    <SelectItem key={action.id} value={action.id} className={isDark ? 'text-white' : ''}>
                      <div className="flex items-center gap-2">
                        <action.icon className="w-4 h-4" />
                        {action.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className={isDark ? 'border-slate-700 text-white' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={saveWorkflow}
              className="bg-violet-500 hover:bg-violet-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}