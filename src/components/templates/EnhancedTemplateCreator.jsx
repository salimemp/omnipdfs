import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plus, X, Sparkles, Save, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  { value: 'invoice', label: 'Invoice', icon: '🧾' },
  { value: 'contract', label: 'Contract', icon: '📄' },
  { value: 'resume', label: 'Resume', icon: '📝' },
  { value: 'letter', label: 'Letter', icon: '✉️' },
  { value: 'report', label: 'Report', icon: '📊' },
  { value: 'form', label: 'Form', icon: '📋' },
  { value: 'certificate', label: 'Certificate', icon: '🏆' },
  { value: 'custom', label: 'Custom', icon: '📑' }
];

const sectionTemplates = {
  header: { title: 'Header', content: '[Company Name]\n[Address]\n[Contact Information]' },
  body: { title: 'Body', content: '[Main content goes here]' },
  footer: { title: 'Footer', content: '[Additional information]\n[Terms and conditions]' },
  signature: { title: 'Signature', content: '_____________________\n[Name]\n[Title]' }
};

export default function EnhancedTemplateCreator({ onSave, isDark = true }) {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [sections, setSections] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const addSection = (template) => {
    const newSection = template || { title: 'New Section', content: '' };
    setSections([...sections, { ...newSection, id: Date.now() }]);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const generateWithAI = async () => {
    if (!templateName) {
      toast.error('Please enter a template name first');
      return;
    }

    setAiGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional template structure for a "${templateName}" in the ${category} category. Generate 3-5 relevant sections with titles and placeholder content. Return JSON with sections array containing objects with title and content fields.`,
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
            },
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      if (result.sections) {
        setSections(result.sections.map((s, i) => ({ ...s, id: Date.now() + i })));
      }
      if (result.description) {
        setDescription(result.description);
      }
      if (result.tags) {
        setTags(result.tags);
      }

      toast.success('AI generated template structure');
    } catch (e) {
      toast.error('AI generation failed');
    } finally {
      setAiGenerating(false);
    }
  };

  const saveTemplate = async () => {
    if (!templateName) {
      toast.error('Please enter a template name');
      return;
    }

    if (sections.length === 0) {
      toast.error('Please add at least one section');
      return;
    }

    try {
      await base44.entities.Template.create({
        name: templateName,
        description,
        category,
        is_public: isPublic,
        template_data: { 
          sections: sections.map(({ id, ...rest }) => rest),
          tags
        },
        usage_count: 0
      });

      await base44.entities.ActivityLog.create({
        action: 'upload',
        document_name: templateName,
        details: { type: 'template_created', category }
      });

      toast.success('Template created successfully');
      onSave?.();
      
      // Reset form
      setTemplateName('');
      setDescription('');
      setSections([]);
      setTags([]);
    } catch (e) {
      toast.error('Failed to create template');
    }
  };

  const previewTemplate = () => {
    if (sections.length === 0) {
      toast.error('Add sections to preview');
      return;
    }

    const preview = sections.map(s => `${s.title}\n${'-'.repeat(s.title.length)}\n${s.content}\n`).join('\n');
    const blob = new Blob([preview], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileText className="w-5 h-5 text-violet-400" />
            Create New Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Template Name *</Label>
              <Input
                placeholder="e.g., Professional Invoice"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
            <Textarea
              placeholder="Brief description of the template..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`min-h-[80px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
              />
              <Button onClick={addTag} size="sm" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Generate */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20">
            <div>
              <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Generate with AI
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Let AI create a template structure for you
              </p>
            </div>
            <Button onClick={generateWithAI} disabled={aiGenerating} className="bg-violet-500">
              <Sparkles className="w-4 h-4 mr-2" />
              {aiGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Template Sections *
              </Label>
              <div className="flex gap-2">
                {Object.entries(sectionTemplates).map(([key, template]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant="outline"
                    onClick={() => addSection(template)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {template.title}
                  </Button>
                ))}
              </div>
            </div>

            {sections.map((section, index) => (
              <Card key={section.id} className={isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50'}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge>Section {index + 1}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSection(section.id)}
                      className="h-7 w-7 text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Section title"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className={isDark ? 'bg-slate-900 border-slate-600 text-white' : ''}
                  />
                  <Textarea
                    placeholder="Section content..."
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    className={`min-h-[100px] ${isDark ? 'bg-slate-900 border-slate-600 text-white' : ''}`}
                  />
                </CardContent>
              </Card>
            ))}

            {sections.length === 0 && (
              <div className={`text-center py-8 border-2 border-dashed rounded-lg ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
                <FileText className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Add sections using the buttons above or generate with AI
                </p>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Make Public
              </Label>
              <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Allow others to use this template
              </p>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={saveTemplate} className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500">
              <Save className="w-4 h-4 mr-2" />
              Create Template
            </Button>
            <Button onClick={previewTemplate} variant="outline" disabled={sections.length === 0}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}