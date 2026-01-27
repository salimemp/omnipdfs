import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
} from "@/components/ui/dialog";
import { Wand2, Loader2, Sparkles, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const industries = [
  'Legal', 'Healthcare', 'Finance', 'Real Estate', 'Education',
  'Marketing', 'HR', 'Sales', 'Technology', 'Consulting', 'Retail'
];

const purposes = [
  'Agreement', 'Invoice', 'Proposal', 'Report', 'Letter',
  'Contract', 'Form', 'Certificate', 'Receipt', 'Presentation'
];

export default function TemplateGenerator({ open, onClose, onTemplateCreated, isDark = true }) {
  const [generating, setGenerating] = useState(false);
  const [config, setConfig] = useState({
    name: '',
    description: '',
    industry: '',
    purpose: '',
    customFields: ''
  });
  const [generatedTemplate, setGeneratedTemplate] = useState(null);

  const generateTemplate = async () => {
    if (!config.name || !config.industry || !config.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert template designer. Create a professional, reusable document template.

Template Specifications:
- Name: ${config.name}
- Industry: ${config.industry}
- Purpose: ${config.purpose}
- Description: ${config.description}
${config.customFields ? `- Custom Fields Needed: ${config.customFields}` : ''}

Generate a complete template structure with:
1. Field definitions (name, type, required, default value, validation)
2. Layout structure (sections, positioning)
3. Styling guidelines (fonts, colors, spacing)
4. Sample content for each section
5. Placeholder syntax for variable fields

Make it professional, industry-standard, and easily customizable.`,
        response_json_schema: {
          type: "object",
          properties: {
            template_name: { type: "string" },
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  label: { type: "string" },
                  type: { type: "string" },
                  required: { type: "boolean" },
                  default_value: { type: "string" },
                  placeholder: { type: "string" },
                  validation: { type: "string" }
                }
              }
            },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  order: { type: "number" }
                }
              }
            },
            styling: {
              type: "object",
              properties: {
                primary_font: { type: "string" },
                heading_font: { type: "string" },
                primary_color: { type: "string" },
                accent_color: { type: "string" }
              }
            },
            tags: {
              type: "array",
              items: { type: "string" }
            },
            usage_instructions: { type: "string" }
          }
        }
      });

      setGeneratedTemplate(response);

      // Save to database
      await base44.entities.Template.create({
        name: config.name,
        description: config.description,
        category: config.purpose.toLowerCase(),
        template_data: response,
        is_public: false
      });

      toast.success('Template generated successfully!');
      onTemplateCreated?.(response);
    } catch (e) {
      toast.error('Template generation failed');
    }
    setGenerating(false);
  };

  const downloadTemplate = () => {
    const json = JSON.stringify(generatedTemplate, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.replace(/\s+/g, '_')}_template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : ''}`}>
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Template Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Configuration */}
          <div className="space-y-4">
            <div>
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Template Name *</Label>
              <Input
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="e.g., Service Agreement Template"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Industry *</Label>
              <Select value={config.industry} onValueChange={(v) => setConfig({ ...config, industry: v })}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {industries.map(ind => (
                    <SelectItem key={ind} value={ind} className={isDark ? 'text-white' : ''}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Purpose *</Label>
              <Select value={config.purpose} onValueChange={(v) => setConfig({ ...config, purpose: v })}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                  {purposes.map(pur => (
                    <SelectItem key={pur} value={pur} className={isDark ? 'text-white' : ''}>{pur}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Description</Label>
              <Textarea
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Describe the template's purpose and use cases..."
                className={`mt-2 h-24 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>

            <div>
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Custom Fields (optional)</Label>
              <Input
                value={config.customFields}
                onChange={(e) => setConfig({ ...config, customFields: e.target.value })}
                placeholder="e.g., Company Name, Contract Date, Amount"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>

            <Button
              onClick={generateTemplate}
              disabled={generating}
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Template
                </>
              )}
            </Button>
          </div>

          {/* Preview */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Preview</h4>
            {generatedTemplate ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Fields ({generatedTemplate.fields?.length || 0})</p>
                  <div className="mt-2 space-y-2">
                    {generatedTemplate.fields?.slice(0, 5).map((field, i) => (
                      <div key={i} className={`p-2 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{field.label}</span>
                          <Badge variant="outline" className="text-xs">{field.type}</Badge>
                        </div>
                        {field.placeholder && (
                          <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{field.placeholder}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sections ({generatedTemplate.sections?.length || 0})</p>
                  <div className="mt-2 space-y-1">
                    {generatedTemplate.sections?.map((section, i) => (
                      <p key={i} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {i + 1}. {section.title}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={downloadTemplate} className={isDark ? 'border-slate-700' : ''}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" onClick={() => onClose()} className="bg-violet-500 hover:bg-violet-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className={`flex flex-col items-center justify-center h-64 text-center ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <Wand2 className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">Configure and generate your template</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}