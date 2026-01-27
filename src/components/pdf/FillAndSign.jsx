import React, { useState } from 'react';
import { Type, Signature, CheckSquare, Calendar, Image, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FillAndSign({ document, isDark }) {
  const [fields, setFields] = useState([
    { id: 1, type: 'text', label: 'Full Name', value: '', x: 100, y: 100 },
    { id: 2, type: 'text', label: 'Email', value: '', x: 100, y: 150 },
    { id: 3, type: 'date', label: 'Date', value: '', x: 100, y: 200 },
    { id: 4, type: 'signature', label: 'Signature', value: '', x: 100, y: 250 },
  ]);
  const [activeTool, setActiveTool] = useState('text');

  const tools = [
    { id: 'text', icon: Type, label: 'Text Field' },
    { id: 'signature', icon: Signature, label: 'Signature' },
    { id: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
    { id: 'date', icon: Calendar, label: 'Date' },
    { id: 'image', icon: Image, label: 'Image' },
  ];

  const updateField = (id, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, value } : f));
  };

  const saveForm = async () => {
    const filledFields = fields.filter(f => f.value).length;
    
    if (filledFields === 0) {
      toast.error('Please fill at least one field');
      return;
    }

    await base44.entities.ActivityLog.create({
      action: 'convert',
      document_id: document?.id,
      details: { type: 'form_filled', fields_filled: filledFields }
    });

    toast.success('Form saved successfully!');
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Fill & Sign Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {tools.map(tool => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col h-auto py-3 ${activeTool === tool.id ? 'bg-violet-500' : ''}`}
              >
                <tool.icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Form Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(field => (
            <div key={field.id}>
              <Label className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {field.label}
              </Label>
              {field.type === 'text' && (
                <Input
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                />
              )}
              {field.type === 'date' && (
                <Input
                  type="date"
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                />
              )}
              {field.type === 'signature' && (
                <div className={`h-24 rounded-lg border-2 border-dashed flex items-center justify-center ${isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-slate-50'}`}>
                  {field.value ? (
                    <span className="text-2xl font-script italic">{field.value}</span>
                  ) : (
                    <Button size="sm" onClick={() => updateField(field.id, 'John Doe')} className="bg-violet-500">
                      <Signature className="w-4 h-4 mr-2" />
                      Add Signature
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}

          <Button onClick={saveForm} className="w-full bg-violet-500">
            <Save className="w-4 h-4 mr-2" />
            Save Form
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}