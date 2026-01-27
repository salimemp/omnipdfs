import React, { useState } from 'react';
import { Plus, Save, Eye } from 'lucide-react';
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

  const saveTemplate = async () => {
    if (!template.name || !template.category) {
      toast.error('Please fill required fields');
      return;
    }

    toast.promise(
      async () => {
        await base44.entities.Template.create(template);
        setTemplate({ name: '', description: '', category: '', isPublic: false });
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
            className={isDark ? 'bg-slate-800 border-slate-700' : ''}
          />
        </div>

        <div>
          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Category *</Label>
          <Select value={template.category} onValueChange={(v) => setTemplate({ ...template, category: v })}>
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Description</Label>
          <Textarea
            value={template.description}
            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
            placeholder="Describe your template..."
            className={isDark ? 'bg-slate-800 border-slate-700' : ''}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={saveTemplate} className="flex-1 bg-violet-500">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button variant="outline" className="flex-1">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}