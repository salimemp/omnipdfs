import React, { useState } from 'react';
import { Sparkles, FileText, AlertCircle, CheckCircle2, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '../shared/LanguageContext';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIComparisonTools({ doc1, doc2, isDark }) {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);

  const handleAIComparison = async () => {
    if (!doc1 || !doc2) {
      toast.error('Please upload both documents');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two documents in detail. Analyze:
1. Content differences and similarities
2. Structural changes
3. Added/removed sections
4. Formatting differences
5. Overall similarity score (0-100)
6. Key changes summary
7. Recommended actions

Document 1: ${doc1.name}
Document 2: ${doc2.name}

Provide comprehensive comparison results.`,
        file_urls: [doc1.file_url, doc2.file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            similarity_score: { type: 'number' },
            content_changes: {
              type: 'object',
              properties: {
                additions: { type: 'array', items: { type: 'string' } },
                deletions: { type: 'array', items: { type: 'string' } },
                modifications: { type: 'array', items: { type: 'string' } }
              }
            },
            structural_differences: { type: 'array', items: { type: 'string' } },
            key_changes: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            summary: { type: 'string' }
          }
        }
      });

      setComparisonResults(response);
      toast.success('AI comparison completed');

      await base44.entities.ActivityLog.create({
        action: 'compare',
        details: {
          doc1_id: doc1.id,
          doc2_id: doc2.id,
          similarity: response.similarity_score
        }
      });
    } catch (error) {
      toast.error('AI comparison failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
        <Sparkles className="w-6 h-6 text-purple-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI-Powered Comparison
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Intelligent document analysis and difference detection
          </p>
        </div>
      </div>

      {!comparisonResults ? (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="pt-6 text-center">
            <Sparkles className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Use AI to analyze differences, similarities, and key changes between documents
            </p>
            <Button 
              onClick={handleAIComparison}
              disabled={analyzing || !doc1 || !doc2}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start AI Comparison
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Similarity Score */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Similarity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {comparisonResults.similarity_score}%
                </div>
                <Progress value={comparisonResults.similarity_score} className="flex-1 h-3" />
              </div>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {comparisonResults.summary}
              </p>
            </CardContent>
          </Card>

          {/* Content Changes */}
          {comparisonResults.content_changes && (
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Content Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisonResults.content_changes.additions?.length > 0 && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      Additions
                    </h4>
                    <ul className="space-y-1">
                      {comparisonResults.content_changes.additions.map((item, i) => (
                        <li key={i} className={`text-sm pl-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          + {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {comparisonResults.content_changes.deletions?.length > 0 && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      <AlertCircle className="w-4 h-4" />
                      Deletions
                    </h4>
                    <ul className="space-y-1">
                      {comparisonResults.content_changes.deletions.map((item, i) => (
                        <li key={i} className={`text-sm pl-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          - {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {comparisonResults.content_changes.modifications?.length > 0 && (
                  <div>
                    <h4 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      <TrendingUp className="w-4 h-4" />
                      Modifications
                    </h4>
                    <ul className="space-y-1">
                      {comparisonResults.content_changes.modifications.map((item, i) => (
                        <li key={i} className={`text-sm pl-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          ≈ {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Key Changes */}
          {comparisonResults.key_changes?.length > 0 && (
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Key Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparisonResults.key_changes.map((change, i) => (
                    <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <FileText className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {comparisonResults.recommendations?.length > 0 && (
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {comparisonResults.recommendations.map((rec, i) => (
                    <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="text-purple-400">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={() => setComparisonResults(null)}
            variant="outline"
            className={`w-full ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
          >
            New Comparison
          </Button>
        </div>
      )}
    </div>
  );
}