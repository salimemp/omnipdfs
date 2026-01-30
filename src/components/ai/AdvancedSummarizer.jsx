import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { BookOpen, Loader2, Copy, Download, CheckCircle2, Sparkles, FileText, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const summaryStyles = [
  { id: 'executive', name: 'Executive', description: 'High-level overview for decision makers' },
  { id: 'technical', name: 'Technical', description: 'Detailed with terminology preserved' },
  { id: 'simple', name: 'Simple', description: 'Easy to understand for any audience' },
  { id: 'bullet', name: 'Bullet Points', description: 'Quick scan-friendly format' },
  { id: 'narrative', name: 'Narrative', description: 'Story-like flowing summary' }
];

const focusAreas = [
  { id: 'key_points', name: 'Key Points', icon: '📌' },
  { id: 'action_items', name: 'Action Items', icon: '✅' },
  { id: 'financial', name: 'Financial Data', icon: '💰' },
  { id: 'dates', name: 'Important Dates', icon: '📅' },
  { id: 'people', name: 'Key People', icon: '👥' },
  { id: 'risks', name: 'Risks & Issues', icon: '⚠️' }
];

export default function AdvancedSummarizer({ document, isDark }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState({
    style: 'executive',
    length: 300,
    focus: [],
    customInstructions: '',
    includeCitations: false,
    multilingual: false
  });

  const generateSummary = async () => {
    setLoading(true);
    try {
      const focusText = settings.focus.length > 0 
        ? `Focus specifically on: ${settings.focus.map(f => focusAreas.find(a => a.id === f)?.name).join(', ')}`
        : '';

      const prompt = `Create a ${settings.style} summary of this document. 
Target length: approximately ${settings.length} words.
${focusText}
${settings.customInstructions ? `Additional instructions: ${settings.customInstructions}` : ''}
${settings.includeCitations ? 'Include page/section references where applicable.' : ''}

Provide the summary in a structured format with:
- Main summary text
- Key takeaways (3-5 points)
- Confidence score (0-100)
- Reading time estimate
${settings.focus.includes('action_items') ? '- Actionable items list' : ''}
${settings.focus.includes('dates') ? '- Important dates timeline' : ''}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: false,
        file_urls: [document.file_url],
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_takeaways: { type: "array", items: { type: "string" } },
            confidence_score: { type: "number" },
            reading_time: { type: "string" },
            word_count: { type: "number" },
            action_items: { type: "array", items: { type: "string" } },
            important_dates: { type: "array", items: { 
              type: "object",
              properties: {
                date: { type: "string" },
                description: { type: "string" }
              }
            }}
          }
        }
      });

      setSummary(response);

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document.id,
        document_name: document.name,
        details: { 
          type: 'advanced_summary',
          style: settings.style,
          length: settings.length,
          focus: settings.focus
        }
      });

      toast.success('Summary generated successfully');
    } catch (error) {
      toast.error('Failed to generate summary');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary.summary);
    toast.success('Copied to clipboard');
  };

  const downloadSummary = () => {
    const content = `# Document Summary: ${document.name}\n\n${summary.summary}\n\n## Key Takeaways\n${summary.key_takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.name}-summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Brain className="w-5 h-5 text-violet-400" />
            Advanced Summarization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Summary Style</Label>
            <Select value={settings.style} onValueChange={(v) => setSettings({ ...settings, style: v })}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {summaryStyles.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    <div>
                      <p className="font-medium">{style.name}</p>
                      <p className="text-xs text-slate-500">{style.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>Target Length</Label>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ~{settings.length} words
              </span>
            </div>
            <Slider
              value={[settings.length]}
              onValueChange={([v]) => setSettings({ ...settings, length: v })}
              min={100}
              max={1000}
              step={50}
              className="mb-2"
            />
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300 mb-2 block' : 'text-slate-700 mb-2 block'}>
              Focus Areas (Optional)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {focusAreas.map(area => (
                <Button
                  key={area.id}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const selected = settings.focus.includes(area.id);
                    setSettings({
                      ...settings,
                      focus: selected 
                        ? settings.focus.filter(f => f !== area.id)
                        : [...settings.focus, area.id]
                    });
                  }}
                  className={`justify-start ${
                    settings.focus.includes(area.id)
                      ? 'bg-violet-500/20 border-violet-500'
                      : isDark ? 'border-slate-700' : 'border-slate-200'
                  }`}
                >
                  <span className="mr-2">{area.icon}</span>
                  {area.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Custom Instructions (Optional)
            </Label>
            <Textarea
              value={settings.customInstructions}
              onChange={(e) => setSettings({ ...settings, customInstructions: e.target.value })}
              placeholder="Add any specific requirements or focus areas..."
              className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}
              rows={3}
            />
          </div>

          <Button
            onClick={generateSummary}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Advanced Summary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Summary</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadSummary}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{summary.word_count} words</Badge>
                <Badge variant="outline">{summary.reading_time}</Badge>
                <Badge className={summary.confidence_score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}>
                  {summary.confidence_score}% confident
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Summary</h4>
                <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {summary.summary}
                </p>
              </div>

              {summary.key_takeaways?.length > 0 && (
                <div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {summary.key_takeaways.map((point, i) => (
                      <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.action_items?.length > 0 && (
                <div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Action Items
                  </h4>
                  <ul className="space-y-2">
                    {summary.action_items.map((item, i) => (
                      <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="text-violet-400 mt-1">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.important_dates?.length > 0 && (
                <div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Important Dates
                  </h4>
                  <div className="space-y-2">
                    {summary.important_dates.map((item, i) => (
                      <div key={i} className={`flex gap-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="font-mono text-sm text-violet-400">{item.date}</span>
                        <span>{item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}