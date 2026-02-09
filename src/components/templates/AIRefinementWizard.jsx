import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Wand2, ArrowRight, CheckCircle2, Sparkles, Zap, Save
} from 'lucide-react';
import { toast } from 'sonner';

const refinementSteps = [
  { id: 1, title: 'Clarity', description: 'Improve clarity and readability' },
  { id: 2, title: 'Professional', description: 'Enhance professional tone' },
  { id: 3, title: 'Details', description: 'Add relevant details' },
  { id: 4, title: 'Polish', description: 'Final polish and optimization' }
];

export default function AIRefinementWizard({ template, onSave, isDark = true }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [refining, setRefining] = useState(false);
  const [refinedSections, setRefinedSections] = useState([]);
  const [feedback, setFeedback] = useState('');

  const runRefinement = async (stepIndex) => {
    if (!template) return;

    setRefining(true);
    try {
      const step = refinementSteps[stepIndex];
      const sections = stepIndex === 0 
        ? template.template_data?.sections 
        : refinedSections;

      const content = sections.map(s => `${s.title}: ${s.content}`).join('\n');

      const prompts = {
        0: `Improve clarity and readability of this template. Make it easier to understand while keeping all information:\n\n${content}`,
        1: `Enhance the professional tone. Make it more polished and business-appropriate:\n\n${content}`,
        2: `Add relevant details and expand sections where appropriate. Make it more comprehensive:\n\n${content}`,
        3: `Final polish - optimize flow, fix any issues, ensure consistency:\n\n${content}`
      };

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `${prompts[stepIndex]}\n\nUser feedback: ${feedback || 'None'}\n\nReturn JSON with refined sections array.`,
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

      setRefinedSections(result.sections);
      setCurrentStep(stepIndex + 1);
      setFeedback('');
      toast.success(`${step.title} refinement complete`);
    } catch (e) {
      toast.error('Refinement failed');
    } finally {
      setRefining(false);
    }
  };

  const saveRefinedTemplate = async () => {
    try {
      await base44.entities.Template.update(template.id, {
        template_data: {
          ...template.template_data,
          sections: refinedSections
        }
      });

      toast.success('Refined template saved');
      onSave?.();
    } catch (e) {
      toast.error('Failed to save');
    }
  };

  if (!template) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Wand2 className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to refine
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress = (currentStep / refinementSteps.length) * 100;
  const isComplete = currentStep >= refinementSteps.length;

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Wand2 className="w-5 h-5 text-violet-400" />
            AI Refinement Wizard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </p>
            <Badge variant="outline" className="mt-2">{template.category}</Badge>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Progress
              </span>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentStep}/{refinementSteps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-6 space-y-4">
          {refinementSteps.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
              i < currentStep ? 'border-emerald-500 bg-emerald-500/10' :
              i === currentStep ? 'border-violet-500 bg-violet-500/10' :
              'border-slate-700'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                i < currentStep ? 'bg-emerald-500' :
                i === currentStep ? 'bg-violet-500' :
                'bg-slate-700'
              }`}>
                {i < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white font-bold">{i + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Current Step Action */}
      {!isComplete && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Additional Feedback (Optional)
              </p>
              <Textarea
                placeholder="Any specific improvements you'd like..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={`min-h-[80px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>

            <Button
              onClick={() => runRefinement(currentStep)}
              disabled={refining}
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              {refining ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Refining...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run {refinementSteps[currentStep].title} Refinement
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview & Save */}
      {refinedSections.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isComplete ? 'Final Result' : 'Current Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg max-h-64 overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              {refinedSections.map((section, i) => (
                <div key={i} className="mb-4">
                  <h4 className="font-semibold text-violet-400 mb-1">{section.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {isComplete && (
              <Button onClick={saveRefinedTemplate} className="w-full bg-emerald-500">
                <Save className="w-4 h-4 mr-2" />
                Save Refined Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}