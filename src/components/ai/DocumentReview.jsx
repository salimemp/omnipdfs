import React, { useState } from 'react';
import { FileCheck, AlertTriangle, CheckCircle2, XCircle, Info, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../shared/LanguageContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DocumentReview({ document, isDark }) {
  const { t } = useLanguage();
  const [reviewing, setReviewing] = useState(false);
  const [reviewResults, setReviewResults] = useState(null);

  const handleReview = async () => {
    setReviewing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform a comprehensive document review and quality check. Analyze:
1. Grammar and spelling errors
2. Readability score
3. Document structure and formatting
4. Content completeness
5. Compliance with best practices
6. Suggestions for improvement

Provide a detailed analysis with scores and actionable recommendations.`,
        add_context_from_internet: false,
        response_json_schema: {
          type: 'object',
          properties: {
            overall_score: { type: 'number' },
            grammar_score: { type: 'number' },
            readability_score: { type: 'number' },
            structure_score: { type: 'number' },
            issues: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  severity: { type: 'string' },
                  category: { type: 'string' },
                  description: { type: 'string' },
                  suggestion: { type: 'string' }
                }
              }
            },
            strengths: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setReviewResults(response);
      toast.success('Document review completed');

      await base44.entities.ActivityLog.create({
        action: 'review',
        document_id: document?.id,
        details: { overall_score: response.overall_score }
      });
    } catch (error) {
      toast.error('Review failed: ' + error.message);
    } finally {
      setReviewing(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-blue-500';
      default: return 'text-slate-500';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
        <FileCheck className="w-6 h-6 text-emerald-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI Document {t('review')}
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Comprehensive quality analysis and recommendations
          </p>
        </div>
      </div>

      {!reviewResults ? (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6 text-center">
            <FileCheck className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Get AI-powered insights on document quality, structure, and compliance
            </p>
            <Button 
              onClick={handleReview} 
              disabled={reviewing}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              {reviewing ? 'Analyzing...' : 'Start AI Review'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {reviewResults.overall_score}/100
                </div>
                <Progress value={reviewResults.overall_score} className="flex-1" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Grammar</p>
                  <div className="flex items-center gap-2">
                    <Progress value={reviewResults.grammar_score} className="flex-1" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {reviewResults.grammar_score}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Readability</p>
                  <div className="flex items-center gap-2">
                    <Progress value={reviewResults.readability_score} className="flex-1" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {reviewResults.readability_score}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Structure</p>
                  <div className="flex items-center gap-2">
                    <Progress value={reviewResults.structure_score} className="flex-1" />
                    <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {reviewResults.structure_score}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {reviewResults.issues && reviewResults.issues.length > 0 && (
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Issues Found</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviewResults.issues.map((issue, i) => {
                  const Icon = getSeverityIcon(issue.severity);
                  return (
                    <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${getSeverityColor(issue.severity)}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              {issue.category}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {issue.description}
                          </p>
                          <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            💡 {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {reviewResults.strengths && reviewResults.strengths.length > 0 && (
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reviewResults.strengths.map((strength, i) => (
                    <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {reviewResults.recommendations && reviewResults.recommendations.length > 0 && (
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {reviewResults.recommendations.map((rec, i) => (
                    <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="text-violet-400">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={() => setReviewResults(null)} 
            variant="outline"
            className={`w-full ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
          >
            Review Another Document
          </Button>
        </div>
      )}
    </div>
  );
}