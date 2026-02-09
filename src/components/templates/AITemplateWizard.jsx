import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Wand2, FileText,
  Target, Zap, Lightbulb, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { id: 1, title: 'Template Type', icon: FileText },
  { id: 2, title: 'Requirements', icon: Target },
  { id: 3, title: 'Customization', icon: Lightbulb },
  { id: 4, title: 'Generate', icon: Sparkles },
];

const categories = [
  { value: 'invoice', label: 'Invoice', icon: '🧾', description: 'Professional invoicing templates' },
  { value: 'contract', label: 'Contract', icon: '📄', description: 'Legal agreements and contracts' },
  { value: 'resume', label: 'Resume', icon: '📝', description: 'Professional resume layouts' },
  { value: 'letter', label: 'Letter', icon: '✉️', description: 'Business and personal letters' },
  { value: 'report', label: 'Report', icon: '📊', description: 'Reports and documentation' },
  { value: 'form', label: 'Form', icon: '📋', description: 'Forms and questionnaires' },
  { value: 'certificate', label: 'Certificate', icon: '🏆', description: 'Certificates and awards' }
];

export default function AITemplateWizard({ onComplete, isDark = true }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState({
    category: '',
    name: '',
    description: '',
    purpose: '',
    audience: '',
    tone: 'professional',
    includeFields: [],
    complexity: 'standard'
  });

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generateTemplate = async () => {
    if (!data.name || !data.category) {
      toast.error('Please fill in required fields');
      return;
    }

    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional ${data.category} template with the following specifications:

Name: ${data.name}
Description: ${data.description}
Purpose: ${data.purpose}
Target Audience: ${data.audience}
Tone: ${data.tone}
Complexity: ${data.complexity}

Create ${data.complexity === 'simple' ? '3-4' : data.complexity === 'standard' ? '5-6' : '7-10'} sections with appropriate titles and detailed placeholder content.
Make it professional, well-structured, and ready to use.

Return JSON with: sections (array of {title, content}), tags (array of relevant tags), description (enhanced description)`,
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
            tags: { type: "array", items: { type: "string" } },
            description: { type: "string" }
          }
        }
      });

      await base44.entities.Template.create({
        name: data.name,
        description: result.description || data.description,
        category: data.category,
        template_data: {
          sections: result.sections,
          tags: result.tags
        },
        is_public: false,
        usage_count: 0
      });

      await base44.entities.ActivityLog.create({
        action: 'upload',
        document_name: data.name,
        details: { type: 'ai_generated_template', category: data.category }
      });

      toast.success('Template generated successfully!');
      onComplete?.();
    } catch (e) {
      toast.error('Failed to generate template');
    } finally {
      setGenerating(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-emerald-500' :
                      isActive ? 'bg-gradient-to-br from-violet-500 to-cyan-500' :
                      isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-6 h-6 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-600'}`} />
                      )}
                    </div>
                    <p className={`text-xs font-medium ${
                      isActive ? isDark ? 'text-white' : 'text-slate-900' :
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-emerald-500' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-5 h-5 text-violet-400" />
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Select Template Category *
                </Label>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => updateData('category', cat.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        data.category === cat.value
                          ? 'border-violet-500 bg-violet-500/10'
                          : isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {cat.label}
                        </p>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {cat.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Template Name *
                </Label>
                <Input
                  placeholder="e.g., Modern Invoice Template"
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Purpose
                </Label>
                <Textarea
                  placeholder="What is this template for?"
                  value={data.purpose}
                  onChange={(e) => updateData('purpose', e.target.value)}
                  className={`mt-2 min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Target Audience
                </Label>
                <Input
                  placeholder="e.g., Small businesses, Freelancers"
                  value={data.audience}
                  onChange={(e) => updateData('audience', e.target.value)}
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Tone
                </Label>
                <Select value={data.tone} onValueChange={(value) => updateData('tone', value)}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Complexity
                </Label>
                <Select value={data.complexity} onValueChange={(value) => updateData('complexity', value)}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                    <SelectItem value="simple">Simple (3-4 sections)</SelectItem>
                    <SelectItem value="standard">Standard (5-6 sections)</SelectItem>
                    <SelectItem value="detailed">Detailed (7-10 sections)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Additional Description
                </Label>
                <Textarea
                  placeholder="Any specific requirements or features?"
                  value={data.description}
                  onChange={(e) => updateData('description', e.target.value)}
                  className={`mt-2 min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className={`p-6 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border ${
                isDark ? 'border-violet-500/30' : 'border-violet-300'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <Wand2 className="w-8 h-8 text-violet-400" />
                  <div>
                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Ready to Generate
                    </p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      AI will create your template based on your specifications
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Category:</span>
                  <Badge>{data.category}</Badge>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Name:</span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>{data.name}</span>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Tone:</span>
                  <Badge variant="outline">{data.tone}</Badge>
                </div>
                <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Complexity:</span>
                  <Badge variant="outline">{data.complexity}</Badge>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={nextStep}
                disabled={currentStep === 1 && !data.category}
                className="bg-gradient-to-r from-violet-500 to-cyan-500"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={generateTemplate}
                disabled={generating || !data.name}
                className="bg-gradient-to-r from-violet-500 to-cyan-500"
              >
                {generating ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Template
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}