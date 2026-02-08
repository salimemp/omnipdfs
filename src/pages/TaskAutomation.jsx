import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkflowVisualizer from '@/components/workflows/WorkflowVisualizer';
import AutomationInsights from '@/components/automation/AutomationInsights';
import AIWorkflowOptimizer from '@/components/workflows/AIWorkflowOptimizer';
import AdvancedWorkflowBuilder from '@/components/workflows/AdvancedWorkflowBuilder';
import AIWorkflowAutomation from '@/components/workflows/AIWorkflowAutomation';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import AITaskEngine from '@/components/automation/AITaskEngine';

export default function TaskAutomationPage({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('builder');

  const mockWorkflow = {
    name: 'Auto OCR & Translate',
    trigger: 'upload',
    steps: ['OCR', 'Translate', 'Quality Check', 'Email Notification'],
    status: 'active'
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Task Automation
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Create intelligent workflows that run automatically
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid grid-cols-6 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border overflow-x-auto`}>
          <TabsTrigger value="automation">AI Automation</TabsTrigger>
          <TabsTrigger value="builder">Advanced Builder</TabsTrigger>
          <TabsTrigger value="engine">Quick Builder</TabsTrigger>
          <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
          <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="automation">
          <AIWorkflowAutomation isDark={isDark} />
        </TabsContent>

        <TabsContent value="builder">
          <AdvancedWorkflowBuilder isDark={isDark} />
        </TabsContent>

        <TabsContent value="engine">
          <AITaskEngine isDark={isDark} />
        </TabsContent>

        <TabsContent value="visualizer">
          <WorkflowVisualizer workflow={mockWorkflow} isDark={isDark} />
        </TabsContent>

        <TabsContent value="optimizer">
          <AIWorkflowOptimizer workflow={mockWorkflow} isDark={isDark} />
        </TabsContent>

        <TabsContent value="insights">
          <AutomationInsights isDark={isDark} />
        </TabsContent>
      </Tabs>
    </div>
  );
}