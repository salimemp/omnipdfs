import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Workflow, Play, Pause, Plus, Trash2, Settings, 
  Sparkles, FileText, RefreshCw, CheckCircle2, 
  AlertCircle, Zap, Clock, Users, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const workflowTemplates = [
  {
    id: 'batch-convert',
    name: 'Batch Convert & Organize',
    description: 'Convert multiple files and organize by type',
    icon: RefreshCw,
    triggers: ['upload', 'folder'],
    actions: ['convert', 'organize', 'notify']
  },
  {
    id: 'ocr-extract',
    name: 'OCR & Data Extract',
    description: 'Extract text and data from images/PDFs',
    icon: FileText,
    triggers: ['upload'],
    actions: ['ocr', 'extract', 'store']
  },
  {
    id: 'ai-review',
    name: 'AI Document Review',
    description: 'Analyze and tag documents automatically',
    icon: Sparkles,
    triggers: ['upload', 'schedule'],
    actions: ['analyze', 'tag', 'summarize']
  },
  {
    id: 'collaboration',
    name: 'Auto Collaboration Setup',
    description: 'Share and notify team members',
    icon: Users,
    triggers: ['upload', 'update'],
    actions: ['share', 'notify', 'track']
  }
];

export default function AIWorkflowAutomation({ isDark = false }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [workflowConfig, setWorkflowConfig] = useState({
    name: '',
    trigger: 'upload',
    conditions: {},
    actions: [],
    schedule: null,
    active: true
  });

  const queryClient = useQueryClient();

  const { data: workflows = [] } = useQuery({
    queryKey: ['automation-workflows'],
    queryFn: async () => {
      // Store workflows in a custom entity or use ActivityLog
      return [];
    }
  });

  const createWorkflow = useMutation({
    mutationFn: async (workflow) => {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate an optimal workflow configuration for: ${workflow.name}
        
        Template: ${selectedTemplate?.name || 'Custom'}
        Trigger: ${workflow.trigger}
        
        Create a complete workflow with:
        - Detailed step-by-step actions
        - Conditions and logic flows
        - Error handling
        - Success criteria
        - Estimated execution time`,
        response_json_schema: {
          type: "object",
          properties: {
            steps: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  action: { type: "string" },
                  description: { type: "string" },
                  params: { type: "object" }
                }
              }
            },
            estimated_time: { type: "string" },
            success_criteria: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Store workflow configuration
      return await base44.entities.ActivityLog.create({
        action: 'workflow',
        details: { 
          config: workflow,
          aiGenerated: result,
          status: 'active'
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['automation-workflows']);
      toast.success('Workflow created successfully');
      setWorkflowConfig({
        name: '',
        trigger: 'upload',
        conditions: {},
        actions: [],
        schedule: null,
        active: true
      });
      setSelectedTemplate(null);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-violet-500/20' : 'bg-gradient-to-br from-violet-50 to-cyan-50 border border-violet-200'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Workflow Automation
            </h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Automate document processing with intelligent workflows
            </p>
          </div>
          <Zap className="w-8 h-8 text-violet-400" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Templates */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Workflow Templates
          </h3>
          {workflowTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setSelectedTemplate(template);
                  setWorkflowConfig({
                    ...workflowConfig,
                    name: template.name,
                    actions: template.actions
                  });
                }}
              >
                <Card className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-violet-500 bg-violet-500/10'
                    : isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/30' : 'bg-white border-slate-200 hover:border-violet-300'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.triggers.length} triggers
                      </Badge>
                    </div>
                    <CardTitle className={`text-sm mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {template.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Right: Configuration */}
        <div className="lg:col-span-2">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
                {selectedTemplate ? 'Configure Workflow' : 'Create Custom Workflow'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Workflow Name</Label>
                <Input
                  value={workflowConfig.name}
                  onChange={(e) => setWorkflowConfig({ ...workflowConfig, name: e.target.value })}
                  placeholder="e.g., Auto-convert invoices"
                  className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                />
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Trigger</Label>
                <Select 
                  value={workflowConfig.trigger} 
                  onValueChange={(v) => setWorkflowConfig({ ...workflowConfig, trigger: v })}
                >
                  <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                    <SelectItem value="upload" className={isDark ? 'text-white' : ''}>On File Upload</SelectItem>
                    <SelectItem value="schedule" className={isDark ? 'text-white' : ''}>Scheduled</SelectItem>
                    <SelectItem value="folder" className={isDark ? 'text-white' : ''}>Folder Watch</SelectItem>
                    <SelectItem value="manual" className={isDark ? 'text-white' : ''}>Manual Trigger</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {workflowConfig.trigger === 'schedule' && (
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Schedule</Label>
                  <Input
                    type="text"
                    placeholder="e.g., Every day at 9 AM"
                    className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
                  />
                </div>
              )}

              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Active</Label>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Workflow will run automatically
                  </p>
                </div>
                <Switch
                  checked={workflowConfig.active}
                  onCheckedChange={(checked) => setWorkflowConfig({ ...workflowConfig, active: checked })}
                />
              </div>

              {selectedTemplate && (
                <div className={`p-4 rounded-xl ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-violet-400 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                        AI will optimize this workflow
                      </p>
                      <p className={`text-xs ${isDark ? 'text-violet-400/70' : 'text-violet-600/70'}`}>
                        Actions: {selectedTemplate.actions.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={() => createWorkflow.mutate(workflowConfig)}
                disabled={!workflowConfig.name || createWorkflow.isPending}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white"
              >
                {createWorkflow.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating Workflow...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workflow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          {workflows.length > 0 && (
            <Card className={`mt-6 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className={`text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Active Workflows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workflows.map((workflow, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {workflow.details?.config?.name}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Last run: {new Date(workflow.created_date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}