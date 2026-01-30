import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, FileSearch, Shield, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIDocumentAnalyzer({ document, isDark = true }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisType, setAnalysisType] = useState('comprehensive');

  const analyzeDocument = async (type) => {
    setAnalyzing(true);
    setAnalysisType(type);
    
    try {
      const response = await base44.functions.invoke('aiDocumentAnalysis', {
        documentId: document.id,
        analysisType: type,
        options: { standards: ['GDPR', 'HIPAA', 'SOC2'] }
      });

      if (response.data.success) {
        setAnalysis(response.data.analysis);
        toast.success('Analysis complete');
      }
    } catch (error) {
      toast.error('Analysis failed');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const renderComprehensiveAnalysis = () => {
    if (!analysis) return null;

    return (
      <div className="space-y-6">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-violet-400">
                {analysis.overall_score}/100
              </div>
              <Progress value={analysis.overall_score} className="flex-1" />
            </div>
          </CardContent>
        </Card>

        {analysis.readability && (
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Readability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Score</span>
                <span className="font-semibold">{analysis.readability.score}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Grade Level</span>
                <span className="font-semibold">{analysis.readability.grade_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Sentence Length</span>
                <span className="font-semibold">{analysis.readability.avg_sentence_length} words</span>
              </div>
            </CardContent>
          </Card>
        )}

        {analysis.content_quality && (
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Content Quality</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-emerald-400">Strengths</h4>
                <ul className="space-y-1">
                  {analysis.content_quality.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2 text-amber-400">Areas for Improvement</h4>
                <ul className="space-y-1">
                  {analysis.content_quality.weaknesses?.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {analysis.compliance && (
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-400" />
                Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">GDPR Compliant</span>
                {analysis.compliance.gdpr_compliant ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Accessibility Score</span>
                <span className="font-semibold">{analysis.compliance.accessibility_score}/100</span>
              </div>
              {analysis.compliance.issues?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-amber-400">Issues</h4>
                  <ul className="space-y-1">
                    {analysis.compliance.issues.map((issue, i) => (
                      <li key={i} className="text-sm text-slate-400">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {analysis.recommendations && (
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-violet-400 font-bold">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={() => analyzeDocument('comprehensive')}
          disabled={analyzing}
          className="flex flex-col items-center gap-2 h-auto py-4"
        >
          <Brain className="w-5 h-5" />
          <span className="text-xs">Comprehensive</span>
        </Button>
        <Button
          onClick={() => analyzeDocument('readability')}
          disabled={analyzing}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
        >
          <FileSearch className="w-5 h-5" />
          <span className="text-xs">Readability</span>
        </Button>
        <Button
          onClick={() => analyzeDocument('security')}
          disabled={analyzing}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs">Security</span>
        </Button>
        <Button
          onClick={() => analyzeDocument('compliance')}
          disabled={analyzing}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs">Compliance</span>
        </Button>
      </div>

      {analyzing && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4" />
            <p className="text-slate-400">Analyzing document...</p>
          </CardContent>
        </Card>
      )}

      {!analyzing && analysis && renderComprehensiveAnalysis()}
    </div>
  );
}