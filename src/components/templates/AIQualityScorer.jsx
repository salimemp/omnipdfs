import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles, Award, TrendingUp, AlertTriangle, CheckCircle2,
  FileText, Target, Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIQualityScorer({ template, isDark = true }) {
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState(null);

  const analyzeQuality = async () => {
    if (!template) {
      toast.error('No template selected');
      return;
    }

    setScoring(true);
    try {
      const sections = template.template_data?.sections || [];
      const content = sections.map(s => `${s.title}: ${s.content}`).join('\n');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the quality of this ${template.category} template and provide a comprehensive quality score:

Template: ${template.name}
Content:
${content}

Evaluate:
1. Overall quality score (0-100)
2. Completeness score (0-100) - How complete is the template?
3. Professional score (0-100) - How professional does it look?
4. Usability score (0-100) - How easy to use?
5. Strengths (array of positive aspects)
6. Weaknesses (array of areas for improvement)
7. Grade (A+, A, B+, B, C+, C, D, F)
8. Recommendations (array of specific improvement suggestions)

Return JSON format.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            completeness: { type: "number" },
            professional: { type: "number" },
            usability: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            weaknesses: { type: "array", items: { type: "string" } },
            grade: { type: "string" },
            recommendations: { type: "array", items: { type: "string" } }
          }
        }
      });

      setScore(result);
      toast.success('Quality analysis complete');
    } catch (e) {
      toast.error('Analysis failed');
    } finally {
      setScoring(false);
    }
  };

  const getScoreColor = (value) => {
    if (value >= 90) return 'text-emerald-400';
    if (value >= 75) return 'text-cyan-400';
    if (value >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-emerald-500';
    if (grade.startsWith('B')) return 'bg-cyan-500';
    if (grade.startsWith('C')) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (!template) {
    return (
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-8 text-center">
          <Award className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            Select a template to analyze quality
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Quality Scorer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {template.name}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {template.category} template
            </p>
          </div>

          <Button
            onClick={analyzeQuality}
            disabled={scoring}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
          >
            {scoring ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Award className="w-4 h-4 mr-2" />
                Analyze Quality
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {score && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 mb-4">
                    <div>
                      <p className={`text-5xl font-bold ${getScoreColor(score.overall_score)}`}>
                        {score.overall_score}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        out of 100
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getGradeColor(score.grade)} text-lg px-4 py-1`}>
                    Grade: {score.grade}
                  </Badge>
                </div>

                {/* Metric Breakdown */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Completeness
                      </span>
                      <span className={`font-bold ${getScoreColor(score.completeness)}`}>
                        {score.completeness}%
                      </span>
                    </div>
                    <Progress value={score.completeness} className="h-2" />
                  </div>

                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Professional
                      </span>
                      <span className={`font-bold ${getScoreColor(score.professional)}`}>
                        {score.professional}%
                      </span>
                    </div>
                    <Progress value={score.professional} className="h-2" />
                  </div>

                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Usability
                      </span>
                      <span className={`font-bold ${getScoreColor(score.usability)}`}>
                        {score.usability}%
                      </span>
                    </div>
                    <Progress value={score.usability} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {/* Strengths */}
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {score.strengths?.map((strength, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${
                    isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {strength}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {score.weaknesses?.map((weakness, i) => (
                  <div key={i} className={`flex items-start gap-2 p-3 rounded-lg ${
                    isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                  }`}>
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {weakness}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Zap className="w-4 h-4 text-violet-400" />
                  Recommended Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {score.recommendations?.map((rec, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-xs">
                        {i + 1}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {rec}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}