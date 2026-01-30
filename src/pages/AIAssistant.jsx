import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Languages,
  Tags,
  Lightbulb,
  Loader2,
  Upload,
  CheckCircle2,
  Copy,
  Download,
  X,
  Brain,
  Wand2,
  BookOpen,
  Volume2,
  FileSearch,
  Play
} from 'lucide-react';
import UserStatisticsBar from '@/components/shared/UserStatisticsBar';
import OnboardingVideo from '@/components/shared/OnboardingVideo';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DropZone from '@/components/shared/DropZone';
import ReadAloud from '@/components/shared/ReadAloud';
import PDFSummarizer from '@/components/ai/PDFSummarizer';
import DocumentAssistant from '@/components/ai/DocumentAssistant';
import DocumentReview from '@/components/ai/DocumentReview';
import AIWorkflowEngine from '@/components/workflows/AIWorkflowEngine';
import PDFChatAssistant from '@/components/ai/PDFChatAssistant';
import PDFWorkflowBuilder from '@/components/workflows/PDFWorkflowBuilder';
import RealtimeEditor from '@/components/editor/RealtimeEditor';
import AdvancedWorkflowAutomation from '@/components/workflows/AdvancedWorkflowAutomation';
import { useEffect } from 'react';

const detectLanguage = (text) => {
  const langPatterns = {
    ar: /[\u0600-\u06FF]/, zh: /[\u4E00-\u9FFF]/, ja: /[\u3040-\u30FF]/,
    ko: /[\uAC00-\uD7AF]/, ru: /[\u0400-\u04FF]/, hi: /[\u0900-\u097F]/,
  };
  for (const [lang, pattern] of Object.entries(langPatterns)) {
    if (pattern.test(text)) return lang;
  }
  const lower = text.toLowerCase();
  if (/\b(el|la|los|es|está)\b/.test(lower)) return 'es';
  if (/\b(le|la|les|est|sont)\b/.test(lower)) return 'fr';
  if (/\b(der|die|das|ist|sind)\b/.test(lower)) return 'de';
  return navigator.language.split('-')[0] || 'en';
};

const languageNames = {
  en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
  pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ko: 'Korean', ar: 'Arabic'
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'bn', name: 'Bengali' },
];

export default function AIAssistant({ theme = 'dark' }) {
  const [activeTab, setActiveTab] = useState('summarize');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [detectedLang, setDetectedLang] = useState('en');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const isDark = theme === 'dark';

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      setResult(null);
      setSuggestedTags([]);
      setUploadedFile(null);
    };
  }, []);

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setUploadedFile(document);
    setUploadedFiles([document]);
    setResult(null);
  };

  const processWithAI = async (action) => {
    setProcessing(true);
    setResult(null);

    // Detect language from input
    const inputLang = detectLanguage(textInput || '');
    setDetectedLang(inputLang);
    const langName = languageNames[inputLang] || 'English';

    try {
      let prompt = '';
      let schema = null;

      switch (action) {
        case 'summarize':
          prompt = `Respond in ${langName}. Analyze and summarize the following document content. Provide:
1. A concise executive summary (2-3 sentences)
2. Key points (bullet points)
3. Main topics covered
4. Document type/category

${textInput || `Document: ${uploadedFile?.name}`}

Be thorough but concise. Focus on the most important information.`;
          schema = {
            type: "object",
            properties: {
              executive_summary: { type: "string" },
              key_points: { type: "array", items: { type: "string" } },
              main_topics: { type: "array", items: { type: "string" } },
              document_type: { type: "string" },
              reading_time: { type: "string" }
            }
          };
          break;

        case 'translate':
          const targetLang = languages.find(l => l.code === targetLanguage)?.name || 'Spanish';
          prompt = `Translate the following text to ${targetLang}. Maintain the original formatting, tone, and meaning.

Text to translate:
${textInput}

Provide a high-quality, natural translation.`;
          schema = {
            type: "object",
            properties: {
              translated_text: { type: "string" },
              source_language: { type: "string" },
              target_language: { type: "string" },
              translation_notes: { type: "string" }
            }
          };
          break;

        case 'tags':
          prompt = `Respond in ${langName}. Analyze the following document/text and suggest relevant tags for organization and searchability. Consider:
- Main topics and themes
- Document type
- Industry/domain
- Key entities mentioned
- Action items or status

${textInput || `Document: ${uploadedFile?.name}`}

Provide 5-10 relevant tags.`;
          schema = {
            type: "object",
            properties: {
              tags: { type: "array", items: { type: "string" } },
              category: { type: "string" },
              confidence: { type: "number" }
            }
          };
          break;

        case 'suggestions':
          prompt = `Respond in ${langName}. Based on the following document content, provide intelligent suggestions:
1. Recommended next actions
2. Related documents to review
3. Missing information that should be added
4. Formatting improvements
5. Potential issues or inconsistencies

${textInput || `Document: ${uploadedFile?.name}`}

Be specific and actionable.`;
          schema = {
            type: "object",
            properties: {
              next_actions: { type: "array", items: { type: "string" } },
              related_documents: { type: "array", items: { type: "string" } },
              missing_info: { type: "array", items: { type: "string" } },
              formatting_tips: { type: "array", items: { type: "string" } },
              potential_issues: { type: "array", items: { type: "string" } }
            }
          };
          break;
      }

      const response = await base44.functions.invoke('processWithGemini', {
        prompt,
        fileUrl: uploadedFile?.file_url,
        action
      });

      if (response.data.success) {
        // Try to parse JSON result if it's a string
        let parsedData;
        try {
          parsedData = typeof response.data.result === 'string' 
            ? JSON.parse(response.data.result) 
            : response.data.result;
        } catch {
          parsedData = { text: response.data.result };
        }
        setResult({ action, data: parsedData });
        
        if (action === 'tags' && parsedData.tags) {
          setSuggestedTags(parsedData.tags);
        }
      } else {
        throw new Error(response.data.error || 'Processing failed');
      }

      if (action === 'tags' && response.tags) {
        setSuggestedTags(response.tags);
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_name: uploadedFile?.name || 'Text Input',
        details: { ai_action: action }
      });

    } catch (error) {
      toast.error('AI processing failed. Please try again.');
    }

    setProcessing(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const clearAll = () => {
    setUploadedFile(null);
    setTextInput('');
    setResult(null);
    setSuggestedTags([]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-violet-500/10' : 'bg-violet-100'} border border-violet-500/20 mb-4`}>
              <Brain className="w-4 h-4 text-violet-400" />
              <span className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>Powered by Gemini AI</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Document Assistant
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Summarize, translate, auto-tag, and get intelligent suggestions for your documents
            </p>
          </div>
          <Button
            onClick={() => setShowOnboarding(true)}
            variant="outline"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            Watch Tour
          </Button>
        </div>

        <UserStatisticsBar isDark={isDark} />
      </motion.div>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingVideo onClose={() => setShowOnboarding(false)} isDark={isDark} />
        )}
      </AnimatePresence>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid grid-cols-9 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border p-1`}>
          <TabsTrigger value="summarize" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <BookOpen className="w-4 h-4 mr-1" />
            Summarize
          </TabsTrigger>
          <TabsTrigger value="translate" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Languages className="w-4 h-4 mr-1" />
            Translate
          </TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Tags className="w-4 h-4 mr-1" />
            Tags
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Lightbulb className="w-4 h-4 mr-1" />
            Tips
          </TabsTrigger>
          <TabsTrigger value="assistant" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Brain className="w-4 h-4 mr-1" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="review" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <FileSearch className="w-4 h-4 mr-1" />
            Review
          </TabsTrigger>
          <TabsTrigger value="workflows" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            <Wand2 className="w-4 h-4 mr-1" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="editor" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            Edit
          </TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
            Auto
          </TabsTrigger>
        </TabsList>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* File Upload */}
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Upload className="w-5 h-5 text-violet-400" />
                Upload Document
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Upload a file for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedFile ? (
                <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-violet-400" />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{uploadedFile.name}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready for analysis</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUploadedFile(null)}
                    className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <DropZone
                  onFileUploaded={handleFileUploaded}
                  maxSize={25 * 1024 * 1024}
                />
              )}
            </CardContent>
          </Card>

          {/* Text Input */}
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <FileText className="w-5 h-5 text-cyan-400" />
                Or Paste Text
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Enter text directly for processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your document text here..."
                className={`min-h-[200px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <TabsContent value="summarize" className="mt-6">
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <BookOpen className="w-12 h-12 mx-auto text-violet-400 mb-3" />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Document Summarization
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Get an executive summary, key points, and main topics from your document
                </p>
              </div>
              <Button
                onClick={() => processWithAI('summarize')}
                disabled={processing || (!uploadedFile && !textInput)}
                className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white py-6"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Summary
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translate" className="mt-6">
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Languages className="w-12 h-12 mx-auto text-cyan-400 mb-3" />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Document Translation
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Translate your document to any language with AI precision
                </p>
              </div>
              <div className="mb-6">
                <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Target Language</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code} className={isDark ? 'text-white' : 'text-slate-900'}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => processWithAI('translate')}
                disabled={processing || !textInput}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-6"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Languages className="w-5 h-5 mr-2" />
                    Translate Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Tags className="w-12 h-12 mx-auto text-emerald-400 mb-3" />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Auto-Tagging
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Automatically generate relevant tags for organization
                </p>
              </div>
              <Button
                onClick={() => processWithAI('tags')}
                disabled={processing || (!uploadedFile && !textInput)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Tags...
                  </>
                ) : (
                  <>
                    <Tags className="w-5 h-5 mr-2" />
                    Generate Tags
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Lightbulb className="w-12 h-12 mx-auto text-amber-400 mb-3" />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Smart Suggestions
                </h3>
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Get AI-powered recommendations and insights
                </p>
              </div>
              <Button
                onClick={() => processWithAI('suggestions')}
                disabled={processing || (!uploadedFile && !textInput)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-6"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Get Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          {uploadedFile ? (
            <PDFChatAssistant document={uploadedFile} isDark={isDark} />
          ) : (
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Brain className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Upload a document to start chatting with the AI assistant
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="review" className="mt-6">
          <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="pt-6">
              {uploadedFile ? (
                <DocumentReview document={uploadedFile} isDark={isDark} />
              ) : (
                <div className="text-center py-12">
                  <FileSearch className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Upload a document to perform an AI quality review
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          {uploadedFile ? (
            <PDFWorkflowBuilder document={uploadedFile} isDark={isDark} />
          ) : (
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardContent className="py-12 text-center">
                <Wand2 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Upload a document to build AI workflows
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          {uploadedFile ? (
            <RealtimeEditor documentId={uploadedFile.id} isDark={isDark} />
          ) : (
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardContent className="py-12 text-center">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Upload a document to start real-time editing
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="automation" className="mt-6">
          <AdvancedWorkflowAutomation isDark={isDark} />
        </TabsContent>
      </Tabs>

      {/* Results Section */}
      <AnimatePresence>
        {activeTab === 'pdf-summary' && uploadedFiles.length > 0 && (
          <PDFSummarizer
            document={uploadedFiles[0]}
            isDark={isDark}
          />
        )}

        {result && activeTab !== 'pdf-summary' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    AI Result
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result.data, null, 2))}
                      className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAll}
                      className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.action === 'summarize' && result.data && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Executive Summary</h4>
                        <ReadAloud text={result.data.executive_summary} isDark={isDark} />
                      </div>
                      <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{result.data.executive_summary}</p>
                    </div>
                    {result.data.key_points?.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Key Points</h4>
                        <ul className="space-y-2">
                          {result.data.key_points.map((point, i) => (
                            <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              <span className="text-violet-400 mt-1">•</span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.data.main_topics?.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Main Topics</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.data.main_topics.map((topic, i) => (
                            <Badge key={i} variant="secondary" className={`${isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {result.action === 'translate' && result.data && (
                  <div className="space-y-4">
                    <div className="flex justify-end mb-2">
                      <ReadAloud text={result.data.translated_text} isDark={isDark} />
                    </div>
                    <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                      <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{result.data.translated_text}</p>
                    </div>
                    {result.data.translation_notes && (
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Note: {result.data.translation_notes}
                      </p>
                    )}
                  </div>
                )}

                {result.action === 'tags' && result.data && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {result.data.tags?.map((tag, i) => (
                        <Badge key={i} className={`${isDark ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'} cursor-pointer`}>
                          <Tags className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {result.data.category && (
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                        Category: <span className={isDark ? 'text-white' : 'text-slate-900'}>{result.data.category}</span>
                      </p>
                    )}
                  </div>
                )}

                {result.action === 'suggestions' && result.data && (
                  <div className="space-y-6">
                    {result.data.next_actions?.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Recommended Actions</h4>
                        <ul className="space-y-2">
                          {result.data.next_actions.map((action, i) => (
                            <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.data.potential_issues?.length > 0 && (
                      <div>
                        <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Potential Issues</h4>
                        <ul className="space-y-2">
                          {result.data.potential_issues.map((issue, i) => (
                            <li key={i} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                              <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}