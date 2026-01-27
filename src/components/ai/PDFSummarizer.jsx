import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText, Sparkles, Loader2, Copy, Download, RefreshCw,
  BookOpen, List, Lightbulb, Target, Clock, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const summaryLengths = {
  brief: { label: 'Brief', words: '50-100', icon: Sparkles },
  standard: { label: 'Standard', words: '200-300', icon: FileText },
  detailed: { label: 'Detailed', words: '500-800', icon: BookOpen }
};

export default function PDFSummarizer({ document, isDark = true }) {
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [selectedLength, setSelectedLength] = useState('standard');
  const [customInstructions, setCustomInstructions] = useState('');

  const generateSummary = async () => {
    if (!document) {
      toast.error('No document selected');
      return;
    }

    setSummarizing(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze and summarize this document. Generate a ${selectedLength} summary.

${customInstructions ? `Additional instructions: ${customInstructions}\n\n` : ''}

Provide:
1. Executive summary
2. Key points (3-7 main points)
3. Main topics/themes
4. Actionable insights
5. Important details/statistics

Document reference: ${document.name}`,
        file_urls: document.file_url ? [document.file_url] : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            main_topics: { type: "array", items: { type: "string" } },
            insights: { type: "array", items: { type: "string" } },
            statistics: { type: "array", items: { type: "string" } },
            word_count: { type: "number" },
            reading_time_minutes: { type: "number" },
            complexity_score: { type: "number" }
          }
        }
      });

      setSummary(response);
      
      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document.id,
        document_name: document.name,
        details: { type: 'ai_summarization', length: selectedLength }
      });

      toast.success('Summary generated successfully!');
    } catch (e) {
      toast.error('Failed to generate summary');
    }
    setSummarizing(false);
  };

  const copySummary = () => {
    const text = `${summary.executive_summary}\n\nKey Points:\n${summary.key_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadSummary = () => {
    const text = `Document Summary: ${document.name}\n\n${summary.executive_summary}\n\nKey Points:\n${summary.key_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nMain Topics:\n${summary.main_topics.join(', ')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.name}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Length Selection */}
      <div>
        <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Summary Length
        </label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(summaryLengths).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedLength(key)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedLength === key
                    ? 'bg-violet-500/20 border-violet-500/50'
                    : isDark ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${selectedLength === key ? 'text-violet-400' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{config.label}</p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{config.words} words</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Instructions */}
      <div>
        <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Custom Instructions (Optional)
        </label>
        <Textarea
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="E.g., Focus on financial data, summarize technical sections..."
          className={`h-20 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateSummary}
        disabled={summarizing}
        className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
      >
        {summarizing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Document...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Summary
          </>
        )}
      </Button>

      {/* Summary Results */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 space-y-4 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}
        >
          {/* Stats Bar */}
          <div className="flex gap-2 flex-wrap">
            <Badge className="bg-violet-500/20 text-violet-400">
              <Clock className="w-3 h-3 mr-1" />
              {summary.reading_time_minutes} min read
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400">
              <BarChart3 className="w-3 h-3 mr-1" />
              {summary.word_count} words
            </Badge>
            <Badge className={`${summary.complexity_score > 7 ? 'bg-red-500/20 text-red-400' : summary.complexity_score > 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              Complexity: {summary.complexity_score}/10
            </Badge>
          </div>

          {/* Executive Summary */}
          <div>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <FileText className="w-4 h-4 text-violet-400" />
              Executive Summary
            </h4>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {summary.executive_summary}
            </p>
          </div>

          {/* Key Points */}
          <div>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <List className="w-4 h-4 text-cyan-400" />
              Key Points
            </h4>
            <ul className="space-y-2">
              {summary.key_points.map((point, i) => (
                <li key={i} className={`text-sm flex gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="text-violet-400 font-semibold">{i + 1}.</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Insights */}
          {summary.insights?.length > 0 && (
            <div>
              <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Actionable Insights
              </h4>
              <ul className="space-y-1">
                {summary.insights.map((insight, i) => (
                  <li key={i} className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-700">
            <Button variant="outline" size="sm" onClick={copySummary} className={isDark ? 'border-slate-700' : ''}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadSummary} className={isDark ? 'border-slate-700' : ''}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={generateSummary} className={isDark ? 'border-slate-700' : ''}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Regenerate
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}