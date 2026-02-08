import React, { useState } from 'react';
import { Plus, Save, Eye, Sparkles, Loader2, Tag, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function TemplateCreator({ isDark }) {
  const [template, setTemplate] = useState({
    name: '',
    description: '',
    category: '',
    isPublic: false,
  });
  const [aiGenerating, setAiGenerating] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState([]);

  const generateTemplateWithAI = async () => {
    if (!template.name) {
      toast.error('Please enter a template name first');
      return;
    }

    setAiGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional document template structure for: "${template.name}"
        
        Create a detailed template including:
        - Recommended sections and layout
        - Sample content placeholders
        - Best practices for this type of document
        - Suggested styling and formatting
        
        ${template.description ? `Additional context: ${template.description}` : ''}`,
        response_json_schema: {
          type: "object",
          properties: {
            sections: { type: "array", items: { type: "string" } },
            description: { type: "string" },
            suggested_tags: { type: "array", items: { type: "string" } },
            best_practices: { type: "array", items: { type: "string" } },
            template_content: { type: "string" }
          }
        }
      });

      setTemplate({
        ...template,
        description: result.description || template.description,
        template_data: { 
          sections: result.sections,
          best_practices: result.best_practices,
          content: result.template_content
        }
      });
      
      setSuggestedTags(result.suggested_tags || []);
      toast.success('AI template structure generated!');
    } catch (e) {
      toast.error('AI generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  const saveTemplate = async () => {
    if (!template.name || !template.category) {
      toast.error('Please fill required fields');
      return;
    }

    toast.promise(
      async () => {
        await base44.entities.Template.create({
          ...template,
          tags: suggestedTags
        });
        setTemplate({ name: '', description: '', category: '', isPublic: false });
        setSuggestedTags([]);
      },
      {
        loading: 'Saving template...',
        success: 'Template saved successfully!',
        error: 'Failed to save template'
      }
    );
  };

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Plus className="w-5 h-5 text-violet-400" />
          Create New Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Template Name *</Label>
          <Input
            value={template.name}
            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            placeholder="e.g., Business Proposal"
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
          />
        </div>

        <div>
          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Category *</Label>
          <Select value={template.category} onValueChange={(v) => setTemplate({ ...template, category: v })}>
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
              <SelectItem value="business" className={isDark ? 'text-white' : ''}>Business</SelectItem>
              <SelectItem value="personal" className={isDark ? 'text-white' : ''}>Personal</SelectItem>
              <SelectItem value="education" className={isDark ? 'text-white' : ''}>Education</SelectItem>
              <SelectItem value="legal" className={isDark ? 'text-white' : ''}>Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
          <Textarea
            value={template.description}
            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
            placeholder="Describe your template..."
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            rows={3}
          />
        </div>

        {/* AI Generate Button */}
        <Button
          onClick={generateTemplateWithAI}
          disabled={aiGenerating || !template.name}
          variant="outline"
          className={`w-full ${isDark ? 'border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10' : 'border-violet-300 bg-violet-50'}`}
        >
          {aiGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Structure...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2 text-violet-400" />
              Generate with AI
            </>
          )}
        </Button>

        {/* Suggested Tags */}
        {suggestedTags.length > 0 && (
          <div>
            <Label className={`mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Tag className="w-4 h-4 inline mr-1" />
              AI Suggested Tags
            </Label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={saveTemplate} className="flex-1 bg-violet-500 hover:bg-violet-600">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" className={`flex-1 ${isDark ? 'border-slate-700 text-slate-300' : ''}`}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}