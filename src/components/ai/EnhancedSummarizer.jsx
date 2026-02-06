import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Clock, Zap, BookOpen, Target, CheckCircle2, Loader2, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EnhancedSummarizer({ document, text, isDark = true }) {
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryType, setSummaryType] = useState('comprehensive');

  const summaryTypes = [
    { id: 'brief', name: 'Brief', icon: Zap, description: 'Quick overview in 2-3 sentences' },
    { id: 'comprehensive', name: 'Comprehensive', icon: FileText, description: 'Detailed summary with key points' },
    { id: 'executive', name: 'Executive', icon: Target, description: 'Business-focused summary with actions' },
    { id: 'academic', name: 'Academic', icon: BookOpen, description: 'Structured with methodology and findings' }
  ];

  const generateSummary = async (type) => {
    setSummarizing(true);
    setSummaryType(type);

    try {
      const response = await base44.functions.invoke('aiAssistant', {
        task: 'summarize',
        input: {
          text: text || document?.content || '',
          fileUrl: document?.file_url,
          summaryType: type
        },
        options: {
          useInternet: false
        }
      });

      if (response.data.success) {
        setSummary(response.data.result);
        toast.success('Summary generated successfully');
      }
    } catch (error) {
      toast.error('Failed to generate summary');
      console.error(error);
    } finally {
      setSummarizing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadSummary = () => {
    const content = `
${summary.executive_summary ? `Executive Summary:\n${summary.executive_summary}\n\n` : ''}
Main Summary:\n${summary.main_summary}\n
${summary.key_points?.length > 0 ? `\nKey Points:\n${summary.key_points.map(p => `• ${p}`).join('\n')}` : ''}
${summary.details?.length > 0 ? `\n\nDetails:\n${summary.details.map(d => `• ${d}`).join('\n')}` : ''}
${summary.action_items?.length > 0 ? `\n\nAction Items:\n${summary.action_items.map(a => `• ${a}`).join('\n')}` : ''}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded');
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200'}`}>
        <Sparkles className="w-6 h-6 text-violet-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI-Powered Summarization
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Generate intelligent summaries tailored to your needs
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryTypes.map((type) => {
          const Icon = type.icon;
          return (
            <motion.button
              key={type.id}
              onClick={() => generateSummary(type.id)}
              disabled={summarizing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl text-left transition-all ${
                summaryType === type.id && summary
                  ? 'ring-2 ring-violet-500 bg-gradient-to-br from-violet-500/20 to-purple-500/10'
                  : isDark ? 'glass-light hover:border-violet-500/30' : 'bg-white border border-slate-200 hover:border-violet-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 ${summaryType === type.id && summary ? 'text-violet-400' : 'text-violet-500'}`} />
              <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{type.name}</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{type.description}</p>
            </motion.button>
          );
        })}
      </div>

      {summarizing && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-violet-500 mb-4" />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Generating {summaryType} summary...
              </p>
              <Progress value={65} className="w-48 mt-4" />
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {!summarizing && summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <Sparkles className="w-5 h-5 text-violet-400" />
                      Summary Results
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {summaryType.charAt(0).toUpperCase() + summaryType.slice(1)} summary
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(summary.main_summary)} className={isDark ? 'border-slate-700' : ''}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={downloadSummary} className="bg-gradient-to-r from-violet-500 to-purple-600">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {summary.executive_summary && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-violet-400" />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Summary</h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {summary.executive_summary}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Main Summary</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {summary.main_summary}
                  </p>
                </div>

                {summary.key_points?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Key Points</h3>
                    </div>
                    <ul className="space-y-2">
                      {summary.key_points.map((point, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.details?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Important Details</h3>
                    </div>
                    <ul className="space-y-2">
                      {summary.details.map((detail, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span className="text-cyan-400 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {summary.action_items?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Action Items</h3>
                    </div>
                    <ul className="space-y-2">
                      {summary.action_items.map((item, i) => (
                        <li key={i} className={`flex items-start gap-2 p-2 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                          <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  {summary.word_count && (
                    <Badge variant="secondary" className={isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}>
                      <FileText className="w-3 h-3 mr-1" />
                      {summary.word_count} words
                    </Badge>
                  )}
                  {summary.reading_time_minutes && (
                    <Badge variant="secondary" className={isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}>
                      <Clock className="w-3 h-3 mr-1" />
                      {summary.reading_time_minutes} min read
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}