import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Bot, Zap, Trash2, Copy, Merge, Sparkles, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function AITemplateManager({ isDark = true }) {
  const [processing, setProcessing] = useState(false);
  const [operation, setOperation] = useState(null);
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ['user-templates'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Template.filter({ created_by: user.email });
    }
  });

  const duplicateRemovalMutation = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      setOperation('duplicate');
      
      const duplicates = [];
      for (let i = 0; i < templates.length; i++) {
        for (let j = i + 1; j < templates.length; j++) {
          if (templates[i].name === templates[j].name && 
              templates[i].category === templates[j].category) {
            duplicates.push(templates[j].id);
          }
        }
      }

      for (const id of duplicates) {
        await base44.entities.Template.delete(id);
      }

      return duplicates.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries(['user-templates']);
      toast.success(`Removed ${count} duplicate templates`);
      setProcessing(false);
      setOperation(null);
    }
  });

  const autoCategorizeMutation = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      setOperation('categorize');
      
      const uncategorized = templates.filter(t => t.category === 'custom');
      
      for (const template of uncategorized) {
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Categorize this template into one category: invoice, contract, letter, report, resume, certificate, form, or custom.

Template: ${template.name}
Description: ${template.description || 'No description'}

Return only the category name.`,
          response_json_schema: {
            type: "object",
            properties: {
              category: { type: "string" }
            }
          }
        });

        await base44.entities.Template.update(template.id, {
          category: result.category
        });
      }

      return uncategorized.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries(['user-templates']);
      toast.success(`Categorized ${count} templates`);
      setProcessing(false);
      setOperation(null);
    }
  });

  const mergeSimilarMutation = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      setOperation('merge');
      
      // Simple similarity check by category
      const byCategory = {};
      templates.forEach(t => {
        if (!byCategory[t.category]) byCategory[t.category] = [];
        byCategory[t.category].push(t);
      });

      let merged = 0;
      for (const cat in byCategory) {
        const group = byCategory[cat];
        if (group.length > 1) {
          const combined = {
            name: `${cat} - Merged Collection`,
            category: cat,
            description: `Merged from ${group.length} templates`,
            template_data: {
              sections: group.flatMap(t => t.template_data?.sections || [])
            },
            is_public: false
          };

          await base44.entities.Template.create(combined);
          merged++;
        }
      }

      return merged;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries(['user-templates']);
      toast.success(`Created ${count} merged templates`);
      setProcessing(false);
      setOperation(null);
    }
  });

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      setOperation('optimize');
      
      for (const template of templates.slice(0, 5)) {
        const sections = template.template_data?.sections || [];
        const content = sections.map(s => `${s.title}: ${s.content}`).join('\n');

        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Optimize this template for clarity and efficiency. Remove redundancy, improve structure:\n\n${content}`,
          response_json_schema: {
            type: "object",
            properties: {
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" }
                  }
                }
              }
            }
          }
        });

        await base44.entities.Template.update(template.id, {
          template_data: {
            ...template.template_data,
            sections: result.sections
          }
        });
      }

      return Math.min(5, templates.length);
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries(['user-templates']);
      toast.success(`Optimized ${count} templates`);
      setProcessing(false);
      setOperation(null);
    }
  });

  const operations = [
    {
      id: 'duplicate',
      title: 'Remove Duplicates',
      description: 'Find and remove duplicate templates',
      icon: Trash2,
      color: 'text-red-400',
      action: duplicateRemovalMutation.mutate
    },
    {
      id: 'categorize',
      title: 'Auto-Categorize',
      description: 'AI categorizes uncategorized templates',
      icon: Zap,
      color: 'text-amber-400',
      action: autoCategorizeMutation.mutate
    },
    {
      id: 'merge',
      title: 'Merge Similar',
      description: 'Combine similar templates by category',
      icon: Merge,
      color: 'text-cyan-400',
      action: mergeSimilarMutation.mutate
    },
    {
      id: 'optimize',
      title: 'Optimize Content',
      description: 'AI optimizes your top 5 templates',
      icon: TrendingUp,
      color: 'text-emerald-400',
      action: optimizeMutation.mutate
    }
  ];

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Bot className="w-5 h-5 text-violet-400" />
            AI Template Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              You have <span className="font-bold text-violet-400">{templates.length}</span> templates
            </p>
          </div>
        </CardContent>
      </Card>

      {processing && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Processing...
              </p>
            </div>
            <Progress value={50} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {operations.map((op) => {
          const Icon = op.icon;
          return (
            <Card
              key={op.id}
              className={`hover:shadow-xl transition-all ${
                isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/50' : 'bg-white border-slate-200'
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    op.id === 'duplicate' ? 'from-red-500/20 to-red-600/10' :
                    op.id === 'categorize' ? 'from-amber-500/20 to-amber-600/10' :
                    op.id === 'merge' ? 'from-cyan-500/20 to-cyan-600/10' :
                    'from-emerald-500/20 to-emerald-600/10'
                  } flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${op.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {op.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {op.description}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={op.action}
                  disabled={processing || templates.length === 0}
                  className="w-full bg-violet-500 hover:bg-violet-600"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}