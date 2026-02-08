import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wand2, Copy, Download, Share2, Settings, Sparkles,
  Eye, Code, Palette, Layout, FileText, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EnhancedTemplateFeatures({ template, isDark = false }) {
  const [generating, setGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const generateFromAI = async () => {
    if (!customPrompt) return toast.error('Enter a description');
    
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional document template based on this description: "${customPrompt}"
        
        Create a complete template with:
        1. Document structure (sections, headers, footers)
        2. Placeholder fields for dynamic content
        3. Styling and formatting guidelines
        4. Sample content for each section
        5. Best practices and recommendations
        
        Return as structured template data.`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            category: { type: "string" },
            sections: { type: "array", items: { type: "object" } },
            fields: { type: "array", items: { type: "object" } },
            styling: { type: "object" }
          }
        }
      });

      await base44.entities.Template.create({
        name: result.name,
        category: result.category,
        template_data: result,
        is_public: false
      });

      toast.success('Template generated with AI');
    } catch (error) {
      toast.error('Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const duplicateTemplate = async () => {
    if (!template) return;
    try {
      await base44.entities.Template.create({
        ...template,
        name: `${template.name} (Copy)`,
        is_public: false
      });
      toast.success('Template duplicated');
    } catch (error) {
      toast.error('Duplication failed');
    }
  };

  const exportTemplate = () => {
    if (!template) return;
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.json`;
    a.click();
    toast.success('Template exported');
  };

  const features = [
    { icon: Wand2, label: 'AI-powered generation', color: 'violet' },
    { icon: Palette, label: 'Custom styling', color: 'pink' },
    { icon: Layout, label: 'Flexible layouts', color: 'blue' },
    { icon: Code, label: 'Advanced fields', color: 'emerald' },
    { icon: Eye, label: 'Live preview', color: 'amber' },
    { icon: Zap, label: 'Quick fill', color: 'cyan' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${isDark ? 'bg-gradient-to-br from-pink-500/10 to-violet-500/10 border-pink-500/20' : 'bg-gradient-to-br from-pink-50 to-violet-50 border-pink-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Enhanced Templates
                </h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Professional templates with AI assistance
                </p>
              </div>
            </div>
            <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Generation */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Wand2 className="w-5 h-5 text-violet-400" />
              AI Template Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Describe Your Template
              </Label>
              <Input
                placeholder="e.g., Professional invoice with payment terms"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            </div>

            <Button
              onClick={generateFromAI}
              disabled={generating}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
            >
              {generating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>

            <div className={`p-3 rounded-lg ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
              <p className={`text-xs ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                AI will create a complete template structure with smart fields and formatting
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Template Actions */}
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Template Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={duplicateTemplate}
              variant="outline"
              className="w-full justify-start"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Template
            </Button>
            <Button
              onClick={exportTemplate}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as JSON
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Share with Team
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <Card
              key={i}
              className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} hover:shadow-lg transition-all`}
            >
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${feature.color}-400`} />
                </div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {feature.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}