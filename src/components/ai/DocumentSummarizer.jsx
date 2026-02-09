import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Loader2,
  Copy,
  Download,
  Tag,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function DocumentSummarizer({ document, isDark = true }) {
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [tags, setTags] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [entities, setEntities] = useState([]);

  const generateSummary = async () => {
    setProcessing(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze and summarize the following document. Provide:
1. Executive Summary (1-2 sentences)
2. Main Summary (detailed)
3. Key Points (bullet points)
4. Action Items (if any)
5. Sentiment Analysis (positive/negative/neutral with confidence)
6. Named Entities (people, organizations, locations)

Document: ${document?.content || 'Sample document content'}`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            main_summary: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            action_items: { type: "array", items: { type: "string" } },
            reading_time_minutes: { type: "number" },
            word_count: { type: "number" },
            sentiment: {
              type: "object",
              properties: {
                tone: { type: "string" },
                confidence: { type: "number" }
              }
            },
            entities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  type: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSummary(result);
      if (result.sentiment) setSentiment(result.sentiment);
      if (result.entities) setEntities(result.entities);
      toast.success('AI analysis complete');
    } catch (e) {
      toast.error('Analysis failed');
    } finally {
      setProcessing(false);
    }
  };

  const generateTags = async () => {
    setProcessing(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5-8 relevant tags for this document content. Return only an array of tags.

Document: ${document?.content || summary?.main_summary || 'Sample content'}`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      if (result.tags) {
        setTags(result.tags);
        
        if (document?.id) {
          await base44.entities.Document.update(document.id, {
            tags: result.tags
          });
        }
        
        toast.success('Tags generated');
      }
    } catch (e) {
      toast.error('Tagging failed');
    } finally {
      setProcessing(false);
    }
  };

  const copySummary = () => {
    const text = summary?.main_summary || summary?.executive_summary || '';
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadSummary = () => {
    const content = `
Document Summary
Generated: ${new Date().toLocaleString()}

Executive Summary:
${summary?.executive_summary || ''}

Main Summary:
${summary?.main_summary || ''}

Key Points:
${summary?.key_points?.map((p, i) => `${i + 1}. ${p}`).join('\n') || ''}

${summary?.action_items?.length ? `Action Items:\n${summary.action_items.map((a, i) => `${i + 1}. ${a}`).join('\n')}` : ''}

Reading Time: ${summary?.reading_time_minutes || 0} minutes
Word Count: ${summary?.word_count || 0}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Sparkles className="w-5 h-5 inline mr-2 text-violet-400" />
          AI Document Analysis
        </h3>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={generateSummary}
          disabled={processing}
          className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <BookOpen className="w-4 h-4 mr-2" />
          )}
          Summarize
        </Button>
        <Button
          onClick={generateTags}
          disabled={processing}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
        >
          {processing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Tag className="w-4 h-4 mr-2" />
          )}
          Generate Tags
        </Button>
      </div>

      {/* Summary Display */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 space-y-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
        >
          {/* Executive Summary */}
          {summary.executive_summary && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-violet-400" />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Executive Summary
                </h4>
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {summary.executive_summary}
              </p>
            </div>
          )}

          {/* Main Summary */}
          {summary.main_summary && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Detailed Summary
                </h4>
              </div>
              <Textarea
                value={summary.main_summary}
                readOnly
                className={`min-h-[120px] text-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
          )}

          {/* Key Points */}
          {summary.key_points?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Key Points
                </h4>
              </div>
              <ul className="space-y-2">
                {summary.key_points.map((point, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {summary.action_items?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Action Items
                </h4>
              </div>
              <ul className="space-y-2">
                {summary.action_items.map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 text-sm p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Reading Time</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {summary.reading_time_minutes || 0} min
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Word Count</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {summary.word_count || 0}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copySummary}
              className={isDark ? 'border-slate-700 text-slate-300' : ''}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={downloadSummary}
              className={isDark ? 'border-slate-700 text-slate-300' : ''}
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </motion.div>
      )}

      {/* Sentiment Analysis */}
      {sentiment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sentiment Analysis
            </h4>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-lg font-semibold capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {sentiment.tone}
              </p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Confidence: {(sentiment.confidence * 100).toFixed(0)}%
              </p>
            </div>
            <Progress value={sentiment.confidence * 100} className="w-32" />
          </div>
        </motion.div>
      )}

      {/* Named Entities */}
      {entities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Named Entities
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {entities.map((entity, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              >
                {entity.text} <span className="text-xs ml-1 opacity-70">({entity.type})</span>
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tags Display */}
      {tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-violet-400" />
            <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Generated Tags
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="px-3 py-1 bg-violet-500/20 text-violet-300 border border-violet-500/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}