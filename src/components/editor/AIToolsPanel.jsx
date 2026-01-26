import React, { useState } from 'react';
import { 
  Wand2, 
  Loader2, 
  MessageSquare, 
  FileText, 
  Sparkles,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const detectLanguage = (text) => {
  const langPatterns = {
    ar: /[\u0600-\u06FF]/,
    zh: /[\u4E00-\u9FFF]/,
    ja: /[\u3040-\u30FF]/,
    ko: /[\uAC00-\uD7AF]/,
    ru: /[\u0400-\u04FF]/,
    hi: /[\u0900-\u097F]/,
  };
  
  for (const [lang, pattern] of Object.entries(langPatterns)) {
    if (pattern.test(text)) return lang;
  }
  
  const lower = text.toLowerCase();
  if (/\b(el|la|los|es|está)\b/.test(lower)) return 'es';
  if (/\b(le|la|les|est|sont)\b/.test(lower)) return 'fr';
  if (/\b(der|die|das|ist|sind)\b/.test(lower)) return 'de';
  
  return 'en';
};

const languageNames = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German',
  it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese',
  ko: 'Korean', ar: 'Arabic', ru: 'Russian', hi: 'Hindi'
};

export default function AIToolsPanel({ 
  isDark = true, 
  elements = [], 
  onAddElement,
  onSuggestionsReady 
}) {
  const [processing, setProcessing] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('auto');

  const getPromptLanguage = () => {
    if (outputLanguage === 'auto') {
      const browserLang = navigator.language.split('-')[0];
      return languageNames[browserLang] || 'English';
    }
    return languageNames[outputLanguage] || 'English';
  };

  const generateSuggestions = async () => {
    setProcessing(true);
    const lang = getPromptLanguage();
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a document improvement assistant. Respond in ${lang}.
        
Analyze a PDF document with ${elements.length} annotations and suggest 3-5 professional improvements.
Focus on:
- Layout and visual hierarchy
- Content organization
- Professional appearance
- Accessibility considerations

Provide actionable, specific suggestions.`,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: { type: "array", items: { type: "string" } },
            priority: { type: "string" }
          }
        }
      });
      
      setSuggestions(response.suggestions);
      onSuggestionsReady?.(response.suggestions);
      toast.success('AI suggestions ready');
    } catch (e) {
      toast.error('AI processing failed');
    }
    setProcessing(false);
  };

  const generateText = async () => {
    if (!customPrompt) {
      toast.error('Please enter a prompt');
      return;
    }
    
    setProcessing(true);
    const lang = getPromptLanguage();
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate professional text in ${lang} for a document based on this request: ${customPrompt}
        
Keep it concise (2-4 sentences), professional, and suitable for business documents.`,
        response_json_schema: {
          type: "object",
          properties: {
            text: { type: "string" },
            language: { type: "string" }
          }
        }
      });
      
      onAddElement?.('text', { content: response.text, width: 300, height: 60 });
      setCustomPrompt('');
      toast.success('AI text added to document');
    } catch (e) {
      toast.error('AI generation failed');
    }
    setProcessing(false);
  };

  const summarizeContent = async () => {
    setProcessing(true);
    const lang = getPromptLanguage();
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a brief executive summary in ${lang} for a document. 
Generate a placeholder summary that could apply to a typical business document.
Keep it professional and under 100 words.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" }
          }
        }
      });
      
      onAddElement?.('text', { content: response.summary, width: 400, height: 100 });
      toast.success('Summary added to document');
    } catch (e) {
      toast.error('Summarization failed');
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-4" role="region" aria-label="AI Tools">
      <Label className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        <Sparkles className="w-4 h-4 text-violet-400" />
        AI Features
      </Label>

      {/* Language Selection */}
      <div>
        <Label className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Output Language
        </Label>
        <Select value={outputLanguage} onValueChange={setOutputLanguage}>
          <SelectTrigger className={`mt-1 text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
            <SelectItem value="auto" className={isDark ? 'text-white' : ''}>
              Auto (Browser Language)
            </SelectItem>
            {Object.entries(languageNames).map(([code, name]) => (
              <SelectItem key={code} value={code} className={isDark ? 'text-white' : ''}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className={`text-xs ${isDark ? 'border-slate-700' : ''}`}
          disabled={processing}
          onClick={generateSuggestions}
          aria-label="Get AI suggestions for document improvements"
        >
          {processing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Wand2 className="w-3 h-3 mr-1" />}
          Suggest
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={`text-xs ${isDark ? 'border-slate-700' : ''}`}
          disabled={processing}
          onClick={summarizeContent}
          aria-label="Generate executive summary"
        >
          {processing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <FileText className="w-3 h-3 mr-1" />}
          Summary
        </Button>
      </div>

      {/* Custom Prompt */}
      <div>
        <Label className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Custom AI Text
        </Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe what text to generate..."
          className={`mt-1 text-xs min-h-[60px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
          aria-label="Enter custom prompt for AI text generation"
        />
        <Button
          variant="outline"
          size="sm"
          className={`w-full mt-2 text-xs ${isDark ? 'border-slate-700' : ''}`}
          disabled={processing || !customPrompt}
          onClick={generateText}
        >
          {processing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <MessageSquare className="w-3 h-3 mr-1" />}
          Generate Text
        </Button>
      </div>

      {/* Suggestions Display */}
      {suggestions && (
        <div 
          className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
          role="region"
          aria-label="AI Suggestions"
        >
          <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            AI Suggestions:
          </p>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <li key={i} className={`text-xs flex items-start gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}