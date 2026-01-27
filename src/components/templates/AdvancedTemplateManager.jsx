import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings, GitBranch, BarChart3, Share2, Star,
  Copy, Trash2, Download, Eye
} from 'lucide-react';
import TemplateAnalytics from './TemplateAnalytics';
import VersionControl from './VersionControl';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdvancedTemplateManager({ template, onUpdate, isDark = true }) {
  const [activeTab, setActiveTab] = useState('settings');
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Template.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template updated');
      onUpdate?.();
    },
  });

  const duplicateTemplate = async () => {
    await base44.entities.Template.create({
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined
    });
    queryClient.invalidateQueries(['templates']);
    toast.success('Template duplicated');
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid grid-cols-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100'}`}>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="versions">
            <GitBranch className="w-4 h-4 mr-1" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-1" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sharing">
            <Share2 className="w-4 h-4 mr-1" />
            Sharing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={duplicateTemplate}
              className={isDark ? 'border-slate-700' : ''}
            >
              <Copy className="w-4 h-4 mr-1" />
              Duplicate
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={isDark ? 'border-slate-700' : ''}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="versions">
          <VersionControl
            template={template}
            onRestore={(version) => {
              updateMutation.mutate({
                id: template.id,
                data: { template_data: version.data }
              });
            }}
            isDark={isDark}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <TemplateAnalytics templates={[template]} isDark={isDark} />
        </TabsContent>

        <TabsContent value="sharing">
          <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Share this template with your team or make it public
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}