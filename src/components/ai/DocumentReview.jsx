import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  FileSearch, CheckCircle2, AlertTriangle, Info, XCircle,
  Loader2, Download, RefreshCw, BarChart3, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DocumentReview({ document, isDark = true }) {
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState(null);

  const performReview = async () => {
    if (!document) return;

    setReviewing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform a comprehensive document review and quality analysis.

Document: ${document.name}

Analyze:
1. Overall quality score (0-100)
2. Completeness - are there missing sections?
3. Accuracy - check for errors, inconsistencies
4. Clarity - readability and structure
5. Compliance - legal/regulatory issues
6. Security - sensitive data concerns
7. Formatting - professional appearance
8. Specific issues found with severity (critical, warning, info)
9. Recommendations for improvement

Provide actionable feedback.`,
        file_urls: document.file_url ? [document.file_url] : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            quality_grade: { type: "string" },
            completeness_score: { type: "number" },
            accuracy_score: { type: "number" },
            clarity_score: { type: "number" },
            compliance_score: { type: "number" },
            security_score: { type: "number" },
            formatting_score: { type: "number" },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  location: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            strengths: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setReview(response);
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document.id,
        document_name: document.name,
        details: { type: 'ai_review', score: response.overall_score }
      });

      toast.success('Review completed!');
    } catch (e) {
      toast.error('Review failed');
    }
    setReviewing(false);
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
      warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/20' },
      info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/20' }
    };
    return configs[severity] || configs.info;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={performReview}
        disabled={reviewing}
        className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
      >
        {reviewing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Reviewing Document...
          </>
        ) : (
          <>
            <FileSearch className="w-4 h-4 mr-2" />
            Start AI Review
          </>
        )}
      </Button>

      {review && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Overall Score */}
          <div className={`rounded-xl p-6 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Overall Quality</h4>
                <p className={`text-3xl font-bold ${getScoreColor(review.overall_score)}`}>
                  {review.overall_score}/100
                </p>
              </div>
              <Badge className={`text-lg px-4 py-2 ${
                review.overall_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                review.overall_score >= 60 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                Grade {review.quality_grade}
              </Badge>
            </div>
            <Progress value={review.overall_score} className="h-2" />
          </div>

          {/* Score Breakdown */}
          <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quality Breakdown</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Completeness', score: review.completeness_score },
                { label: 'Accuracy', score: review.accuracy_score },
                { label: 'Clarity', score: review.clarity_score },
                { label: 'Compliance', score: review.compliance_score },
                { label: 'Security', score: review.security_score },
                { label: 'Formatting', score: review.formatting_score }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.label}</span>
                    <span className={`text-sm font-semibold ${getScoreColor(item.score)}`}>{item.score}</span>
                  </div>
                  <Progress value={item.score} className="h-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {review.issues?.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Issues Found ({review.issues.length})
              </h4>
              <div className="space-y-2">
                {review.issues.map((issue, i) => {
                  const config = getSeverityConfig(issue.severity);
                  const Icon = config.icon;
                  return (
                    <div key={i} className={`p-3 rounded-lg ${config.bg} border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                      <div className="flex items-start gap-2">
                        <Icon className={`w-4 h-4 mt-0.5 ${config.color}`} />
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{issue.title}</p>
                          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{issue.description}</p>
                          {issue.location && (
                            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Location: {issue.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths */}
          {review.strengths?.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Strengths
              </h4>
              <ul className="space-y-2">
                {review.strengths.map((strength, i) => (
                  <li key={i} className={`text-sm flex gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className="text-emerald-400">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {review.recommendations?.length > 0 && (
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Recommendations</h4>
              <ul className="space-y-2">
                {review.recommendations.map((rec, i) => (
                  <li key={i} className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {i + 1}. {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}