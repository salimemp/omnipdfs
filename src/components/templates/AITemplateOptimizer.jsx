import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles, Wand2, CheckCircle2, AlertTriangle, TrendingUp,
  FileText, Target, Zap, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

export default function AITemplateOptimizer({ template, onOptimized, isDark = true }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [optimization, setOptimization] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  const analyzeTemplate = async () => {
    if (!template) {
      toast.error('No template selected');
      return;
    }

    setAnalyzing(true);
    try {
      const sections = template.template_data?.sections || [];
      const content = sections.map(s => `${s.title}: ${s.content}`).join('\n');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this template and provide optimization suggestions:

Template: ${template.name}
Category: ${template.category}
Content:
${content}

Provide:
1. Overall quality score (0-100)
2. Specific improvement suggestions
3. SEO/discoverability recommendations
4. Completeness assessment
5. Optimized versions of sections that need improvement

Return JSON format with: score, suggestions (array), improvements (array of {section, original, optimized}), keywords (array)`,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            improvements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string" },
                  original: { type: "string" },
                  optimized: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            keywords: { type: "array", items: { type: "string" } }
          }
        }
      });

      setOptimization(result);
      toast.success('Analysis complete');
    } catch (e) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const applyOptimizations = async () => {
    if (!optimization || selectedSuggestions.length === 0) {
      toast.error('Select suggestions to apply');
      return;
    }

    try {
      const selectedImprovements = optimization.improvements.filter((_, i) =>
        selectedSuggestions.includes(i)
      );

      const updatedSections = template.template_data.sections.map(section => {
        const improvement = selectedImprovements.find(imp =>
          imp.section.toLowerCase().includes(section.title.toLowerCase())
        );
        return improvement ? { ...section, content: improvement.optimized } : section;
      });

      await base44.entities.Template.update(template.id, {
        template_data: {
          ...template.template_data,
          sections: updatedSections
        }
      });

      toast.success('Template optimized successfully');
      onOptimized?.();
      setOptimization(null);
      setSelectedSuggestions([]);
    } catch (e) {
      toast.error('Failed to apply optimizations');
    }
  };

  const toggleSuggestion = (index) => {
    setSelectedSuggestions(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Template Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Selected Template
              </Label>
              <div className={`mt-2 p-4 rounded-lg border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {template?.name || 'No template selected'}
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {template?.description}
                </p>
              </div>
            </div>

            <Button
              onClick={analyzeTemplate}
              disabled={!template || analyzing}
              className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              {analyzing ? (
                <>
                  <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {optimization && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6 space-y-6">
                {/* Quality Score */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      Quality Score
                    </Label>
                    <span className={`text-3xl font-bold ${getScoreColor(optimization.score)}`}>
                      {optimization.score}/100
                    </span>
                  </div>
                  <Progress value={optimization.score} className="h-3" />
                </div>

                {/* Keywords */}
                <div>
                  <Label className={`mb-3 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Recommended Keywords
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {optimization.keywords?.map((keyword, i) => (
                      <Badge key={i} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-violet-400" />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Suggestions
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {optimization.suggestions?.length || 0}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Improvements
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {optimization.improvements?.length || 0}
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Potential
                      </span>
                    </div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      +{100 - optimization.score}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="space-y-3">
              {optimization.suggestions?.map((suggestion, i) => (
                <Card key={i} className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {suggestion.title}
                          </p>
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="improvements">
            <div className="space-y-4">
              {optimization.improvements?.map((improvement, i) => (
                <Card key={i} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} ${
                  selectedSuggestions.includes(i) ? 'ring-2 ring-violet-500' : ''
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-violet-400" />
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {improvement.section}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={selectedSuggestions.includes(i) ? 'default' : 'outline'}
                        onClick={() => toggleSuggestion(i)}
                      >
                        {selectedSuggestions.includes(i) ? (
                          <><CheckCircle2 className="w-4 h-4 mr-1" />Selected</>
                        ) : (
                          'Select'
                        )}
                      </Button>
                    </div>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {improvement.reason}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label className={`text-xs mb-2 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Original
                        </Label>
                        <Textarea
                          value={improvement.original}
                          readOnly
                          className={`text-sm min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50'}`}
                        />
                      </div>
                      <div>
                        <Label className={`text-xs mb-2 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          Optimized
                        </Label>
                        <Textarea
                          value={improvement.optimized}
                          readOnly
                          className={`text-sm min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                onClick={applyOptimizations}
                disabled={selectedSuggestions.length === 0}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
              >
                <Zap className="w-4 h-4 mr-2" />
                Apply {selectedSuggestions.length} Optimization{selectedSuggestions.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}