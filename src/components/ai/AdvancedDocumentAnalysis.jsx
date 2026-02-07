import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, FileSearch, Shield, TrendingUp, CheckCircle2,
  AlertTriangle, Zap, Eye, Lock, Globe, Users,
  BarChart3, FileText, Sparkles, Target, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedDocumentAnalysis({ document, isDark = true }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const runAdvancedAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform comprehensive document analysis on the following document. Analyze:
        1. Content Quality & Structure
        2. Readability & Clarity (Flesch-Kincaid, grade level, sentence complexity)
        3. Tone & Sentiment Analysis
        4. SEO & Keyword Optimization
        5. Security & Privacy Concerns (PII detection, sensitive data)
        6. Compliance Check (GDPR, HIPAA, accessibility)
        7. Document Purpose & Audience
        8. Improvement Recommendations
        
        Document: ${document.name}
        Content: [Document content would be here]
        
        Provide detailed scores, insights, and actionable recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            content_quality: {
              type: "object",
              properties: {
                score: { type: "number" },
                structure_score: { type: "number" },
                clarity_score: { type: "number" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } }
              }
            },
            readability: {
              type: "object",
              properties: {
                flesch_reading_ease: { type: "number" },
                flesch_kincaid_grade: { type: "number" },
                avg_sentence_length: { type: "number" },
                avg_word_length: { type: "number" },
                difficulty: { type: "string" }
              }
            },
            sentiment: {
              type: "object",
              properties: {
                score: { type: "number" },
                tone: { type: "string" },
                emotions: { type: "array", items: { type: "string" } },
                confidence: { type: "number" }
              }
            },
            seo: {
              type: "object",
              properties: {
                score: { type: "number" },
                keyword_density: { type: "number" },
                top_keywords: { type: "array", items: { type: "string" } },
                meta_quality: { type: "string" }
              }
            },
            security: {
              type: "object",
              properties: {
                score: { type: "number" },
                pii_detected: { type: "boolean" },
                sensitive_data: { type: "array", items: { type: "string" } },
                risk_level: { type: "string" }
              }
            },
            compliance: {
              type: "object",
              properties: {
                gdpr_compliant: { type: "boolean" },
                hipaa_compliant: { type: "boolean" },
                accessibility_score: { type: "number" },
                wcag_level: { type: "string" },
                issues: { type: "array", items: { type: "string" } }
              }
            },
            audience: {
              type: "object",
              properties: {
                target: { type: "string" },
                expertise_level: { type: "string" },
                purpose: { type: "string" }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  priority: { type: "string" },
                  suggestion: { type: "string" },
                  impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysis(response);
      toast.success('Advanced analysis complete');
    } catch (error) {
      clearInterval(progressInterval);
      toast.error('Analysis failed: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Trigger */}
      {!analysis && !analyzing && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Advanced AI Document Analysis
            </h3>
            <p className={`mb-6 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Get comprehensive insights including readability, sentiment, SEO, security, compliance, and actionable recommendations
            </p>
            <Button
              onClick={runAdvancedAnalysis}
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Progress */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardContent className="py-12 text-center">
                <div className="animate-pulse w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Analyzing Document...
                </h3>
                <Progress value={analysisProgress} className="max-w-md mx-auto mb-2" />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {analysisProgress}% complete
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      {analysis && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-violet-400" />
                Overall Document Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className={`text-6xl font-bold ${
                  analysis.overall_score >= 80 ? 'text-emerald-400' :
                  analysis.overall_score >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {analysis.overall_score}/100
                </div>
                <div className="flex-1">
                  <Progress value={analysis.overall_score} className="h-3 mb-2" />
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {analysis.overall_score >= 80 ? 'Excellent' :
                     analysis.overall_score >= 60 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="quality" className="space-y-6">
            <TabsList className={`grid grid-cols-4 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="readability">Readability</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="quality" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <ScoreCard
                  title="Content Quality"
                  score={analysis.content_quality?.score || 0}
                  icon={FileText}
                  isDark={isDark}
                  details={[
                    { label: 'Structure', value: `${analysis.content_quality?.structure_score || 0}/100` },
                    { label: 'Clarity', value: `${analysis.content_quality?.clarity_score || 0}/100` }
                  ]}
                />
                <ScoreCard
                  title="SEO Score"
                  score={analysis.seo?.score || 0}
                  icon={TrendingUp}
                  isDark={isDark}
                  details={[
                    { label: 'Keyword Density', value: `${analysis.seo?.keyword_density || 0}%` },
                    { label: 'Meta Quality', value: analysis.seo?.meta_quality || 'N/A' }
                  ]}
                />
              </div>

              {analysis.content_quality?.strengths?.length > 0 && (
                <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.content_quality.strengths.map((strength, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="text-emerald-400">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="readability" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-violet-400" />
                      Readability Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <MetricRow
                      label="Flesch Reading Ease"
                      value={analysis.readability?.flesch_reading_ease || 0}
                      isDark={isDark}
                    />
                    <MetricRow
                      label="Grade Level"
                      value={analysis.readability?.flesch_kincaid_grade || 0}
                      isDark={isDark}
                    />
                    <MetricRow
                      label="Avg Sentence Length"
                      value={`${analysis.readability?.avg_sentence_length || 0} words`}
                      isDark={isDark}
                    />
                    <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : ''}>
                      {analysis.readability?.difficulty || 'N/A'}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      Sentiment Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Tone</span>
                      <Badge className="capitalize">{analysis.sentiment?.tone || 'Neutral'}</Badge>
                    </div>
                    <Progress value={analysis.sentiment?.score || 50} className="h-2" />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {analysis.sentiment?.emotions?.map((emotion, i) => (
                        <Badge key={i} variant="outline">{emotion}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-rose-400" />
                      Security Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Security Score</span>
                      <span className={`text-2xl font-bold ${
                        analysis.security?.score >= 80 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {analysis.security?.score || 0}/100
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>PII Detected</span>
                      {analysis.security?.pii_detected ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <Badge variant={analysis.security?.risk_level === 'low' ? 'default' : 'destructive'}>
                      Risk: {analysis.security?.risk_level || 'Unknown'}
                    </Badge>
                  </CardContent>
                </Card>

                <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ComplianceRow
                      label="GDPR"
                      compliant={analysis.compliance?.gdpr_compliant}
                      isDark={isDark}
                    />
                    <ComplianceRow
                      label="HIPAA"
                      compliant={analysis.compliance?.hipaa_compliant}
                      isDark={isDark}
                    />
                    <MetricRow
                      label="Accessibility"
                      value={`${analysis.compliance?.accessibility_score || 0}/100`}
                      isDark={isDark}
                    />
                    <Badge>{analysis.compliance?.wcag_level || 'Not Rated'}</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {analysis.recommendations?.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          rec.priority === 'high' ? 'bg-rose-500/20' :
                          rec.priority === 'medium' ? 'bg-amber-500/20' : 'bg-emerald-500/20'
                        }`}>
                          <Target className={`w-5 h-5 ${
                            rec.priority === 'high' ? 'text-rose-400' :
                            rec.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="capitalize">{rec.category}</Badge>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'} className="capitalize">
                              {rec.priority} Priority
                            </Badge>
                          </div>
                          <p className={`mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{rec.suggestion}</p>
                          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Impact: {rec.impact}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-center">
            <Button onClick={() => setAnalysis(null)} variant="outline">
              Run New Analysis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScoreCard({ title, score, icon: Icon, isDark, details }) {
  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="w-5 h-5 text-violet-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-violet-400 mb-3">{score}/100</div>
        <Progress value={score} className="mb-3" />
        {details && (
          <div className="space-y-2">
            {details.map((detail, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{detail.label}</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{detail.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, isDark }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

function ComplianceRow({ label, compliant, isDark }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
      {compliant ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-amber-400" />
      )}
    </div>
  );
}