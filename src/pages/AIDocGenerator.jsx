import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Wand2,
  Loader2,
  Download,
  Copy,
  RefreshCw,
  FileOutput,
  Settings2,
  ChevronDown,
  BookOpen,
  Briefcase,
  Receipt,
  FileSignature,
  Award,
  ClipboardList,
  Mail,
  Presentation
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const documentTypes = [
  { id: 'contract', label: 'Contract', icon: FileSignature, description: 'Legal agreements and contracts' },
  { id: 'proposal', label: 'Proposal', icon: Presentation, description: 'Business proposals and pitches' },
  { id: 'invoice', label: 'Invoice', icon: Receipt, description: 'Billing and payment documents' },
  { id: 'report', label: 'Report', icon: BookOpen, description: 'Business and analysis reports' },
  { id: 'letter', label: 'Letter', icon: Mail, description: 'Formal business correspondence' },
  { id: 'resume', label: 'Resume/CV', icon: Briefcase, description: 'Professional resumes' },
  { id: 'certificate', label: 'Certificate', icon: Award, description: 'Awards and certifications' },
  { id: 'form', label: 'Form', icon: ClipboardList, description: 'Application and data forms' },
];

const tones = [
  { id: 'professional', label: 'Professional' },
  { id: 'formal', label: 'Formal' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'persuasive', label: 'Persuasive' },
  { id: 'concise', label: 'Concise' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

export default function AIDocGenerator({ theme = 'dark' }) {
  const [selectedType, setSelectedType] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState({
    tone: 'professional',
    language: 'en',
    includeSignature: true,
    includeDate: true,
    length: 'medium'
  });

  const isDark = theme === 'dark';

  const generateDocument = async () => {
    if (!selectedType || !prompt) {
      toast.error('Please select a document type and provide details');
      return;
    }

    setGenerating(true);
    setGeneratedContent(null);

    try {
      const docType = documentTypes.find(d => d.id === selectedType);
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional document generator. Create a ${docType.label} based on the following requirements:

Requirements: ${prompt}

Document Settings:
- Tone: ${settings.tone}
- Language: ${languages.find(l => l.code === settings.language)?.name || 'English'}
- Length: ${settings.length}
- Include Date: ${settings.includeDate}
- Include Signature Line: ${settings.includeSignature}

Generate a complete, professional ${docType.label} that is ready to use. Include all necessary sections, proper formatting, and placeholder text where specific details would be needed (marked with [PLACEHOLDER]).

Format the output with clear sections and proper structure.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  heading: { type: "string" },
                  body: { type: "string" }
                }
              }
            },
            placeholders: {
              type: "array",
              items: { type: "string" }
            },
            metadata: {
              type: "object",
              properties: {
                word_count: { type: "number" },
                estimated_pages: { type: "number" }
              }
            }
          }
        }
      });

      setGeneratedContent(result);

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_name: result.title || `Generated ${docType.label}`,
        details: { type: 'ai_generation', doc_type: selectedType }
      });

      toast.success('Document generated successfully!');
    } catch (error) {
      toast.error('Failed to generate document');
    }

    setGenerating(false);
  };

  const copyToClipboard = () => {
    const text = generatedContent?.sections?.map(s => `${s.heading}\n\n${s.body}`).join('\n\n') || generatedContent?.content;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadAsText = () => {
    const text = generatedContent?.sections?.map(s => `${s.heading}\n\n${s.body}`).join('\n\n') || generatedContent?.content;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContent?.title || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>AI-Powered Document Generation</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Generate Documents with AI
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Create professional documents instantly using artificial intelligence
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Configuration */}
        <div className="space-y-6">
          {/* Document Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Select Document Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {documentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-2 border-violet-500/50'
                        : isDark
                          ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-violet-400' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{type.label}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{type.description}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Prompt Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Document Details
            </h3>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Describe what you need in your ${selectedType ? documentTypes.find(d => d.id === selectedType)?.label.toLowerCase() : 'document'}...

Example: "A service agreement between ABC Company and XYZ Corp for web development services, including payment terms, deliverables, and timeline."`}
              className={`min-h-[150px] ${isDark ? 'bg-slate-900 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
            />
          </motion.div>

          {/* Advanced Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger className={`flex items-center justify-between w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-violet-400" />
                  <span className="font-semibold">Advanced Settings</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Tone</Label>
                    <Select value={settings.tone} onValueChange={(v) => setSettings({ ...settings, tone: v })}>
                      <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                        {tones.map(tone => (
                          <SelectItem key={tone.id} value={tone.id} className={isDark ? 'text-white' : ''}>{tone.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Language</Label>
                    <Select value={settings.language} onValueChange={(v) => setSettings({ ...settings, language: v })}>
                      <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                        {languages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code} className={isDark ? 'text-white' : ''}>{lang.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Include Date</Label>
                  <Switch checked={settings.includeDate} onCheckedChange={(v) => setSettings({ ...settings, includeDate: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Include Signature Line</Label>
                  <Switch checked={settings.includeSignature} onCheckedChange={(v) => setSettings({ ...settings, includeSignature: v })} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          {/* Generate Button */}
          <Button
            onClick={generateDocument}
            disabled={generating || !selectedType || !prompt}
            className="w-full py-6 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white text-lg"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Document
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Generated Document</h3>
            {generatedContent && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className={isDark ? 'border-slate-700 text-slate-300' : ''}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAsText} className={isDark ? 'border-slate-700 text-slate-300' : ''}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {generatedContent ? (
            <div className={`rounded-xl p-6 min-h-[500px] max-h-[600px] overflow-y-auto ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
              <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {generatedContent.title}
              </h2>
              {generatedContent.sections?.map((section, i) => (
                <div key={i} className="mb-6">
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {section.heading}
                  </h4>
                  <p className={`whitespace-pre-wrap leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {section.body}
                  </p>
                </div>
              ))}
              {generatedContent.placeholders?.length > 0 && (
                <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                  <p className={`text-sm font-medium mb-2 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                    Placeholders to fill:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {generatedContent.placeholders.map((p, i) => (
                      <li key={i} className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <Button onClick={generateDocument} variant="outline" className={isDark ? 'border-slate-700 text-slate-300' : ''}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Link to={createPageUrl('PDFEditor')}>
                  <Button className="bg-violet-500 hover:bg-violet-600">
                    <FileOutput className="w-4 h-4 mr-2" />
                    Edit in PDF Editor
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center min-h-[500px] rounded-xl border-2 border-dashed ${isDark ? 'border-slate-700 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
              <FileText className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-center">
                Select a document type and describe your needs<br />
                to generate a professional document
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}