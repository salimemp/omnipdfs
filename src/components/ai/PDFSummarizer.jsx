import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Loader2, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Volume2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ReadAloud from '@/components/shared/ReadAloud';

export default function PDFSummarizer({ 
  file, 
  isDark = true,
  onSummaryReady 
}) {
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [expanded, setExpanded] = useState(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSummary(null);
      setProcessing(false);
    };
  }, []);

  const summarizePDF = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    
    const browserLang = navigator.language.split('-')[0];
    const langNames = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese'
    };
    const langName = langNames[browserLang] || 'English';
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Respond in ${langName}. Analyze and summarize this PDF document "${file.name}". Provide:
1. Executive summary (2-3 sentences)
2. Key points (bullet points)
3. Document type
4. Main topics
5. Estimated reading time`,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            key_points: { type: "array", items: { type: "string" } },
            document_type: { type: "string" },
            main_topics: { type: "array", items: { type: "string" } },
            reading_time: { type: "string" }
          }
        },
        file_urls: file.file_url ? [file.file_url] : undefined
      });
      
      setSummary(response);
      onSummaryReady?.(response);
      toast.success('PDF summarized successfully');
    } catch (e) {
      toast.error('Failed to summarize PDF');
    }
    setProcessing(false);
  }, [file, onSummaryReady]);

  const copyToClipboard = () => {
    if (!summary) return;
    const text = `${summary.executive_summary}\n\nKey Points:\n${summary.key_points?.join('\n• ')}\n\nTopics: ${summary.main_topics?.join(', ')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (!file) return null;

  return (
    <div 
      className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}
      role="region"
      aria-label="PDF Summarizer"
    >
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI PDF Summarizer
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {summary ? 'Summary ready' : 'Generate summary'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!summary && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                summarizePDF();
              }}
              disabled={processing}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-xs"
            >
              {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Summarize'}
            </Button>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded && summary && (
        <div className={`p-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {summary.reading_time || '~5 min read'}
              </span>
              <Badge className="text-xs bg-violet-500/20 text-violet-400">
                {summary.document_type || 'Document'}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={copyToClipboard} className="h-7 w-7">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {summary.executive_summary}
          </p>

          <ReadAloud text={summary.executive_summary} isDark={isDark} />

          {summary.key_points?.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Key Points
              </p>
              <ul className="space-y-1">
                {summary.key_points.slice(0, 5).map((point, i) => (
                  <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span className="text-violet-400 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.main_topics?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {summary.main_topics.map((topic, i) => (
                <Badge key={i} variant="outline" className={`text-xs ${isDark ? 'border-slate-700' : ''}`}>
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}