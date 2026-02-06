import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import AIDocumentComparison from '@/components/compare/AIDocumentComparison';
import {
  GitCompare,
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Minus,
  Eye,
  Columns,
  ArrowLeftRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import DropZone from '@/components/shared/DropZone';
import SideBySideViewer from '@/components/compare/SideBySideViewer';
import AIComparisonTools from '@/components/compare/AIComparisonTools';
import { useLanguage } from '@/components/shared/LanguageContext';

export default function Compare({ theme = 'dark' }) {
  const { t } = useLanguage();
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [viewMode, setViewMode] = useState('side-by-side');

  const isDark = theme === 'dark';

  const handleLeftFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setLeftFile(document);
    setComparisonResult(null);
  };

  const handleRightFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setRightFile(document);
    setComparisonResult(null);
  };

  const compareDocuments = async () => {
    if (!leftFile || !rightFile) return;

    setComparing(true);

    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two PDF documents and provide a detailed analysis:

Document 1: ${leftFile.name}
Document 2: ${rightFile.name}

Provide:
1. Overall similarity percentage
2. Key differences found
3. Added content (in Document 2 but not in Document 1)
4. Removed content (in Document 1 but not in Document 2)
5. Modified sections
6. Formatting changes
7. Summary of changes

Be thorough and specific about the differences.`,
        response_json_schema: {
          type: "object",
          properties: {
            similarity_percentage: { type: "number" },
            summary: { type: "string" },
            key_differences: { type: "array", items: { type: "string" } },
            added_content: { type: "array", items: { type: "object", properties: { section: { type: "string" }, content: { type: "string" } } } },
            removed_content: { type: "array", items: { type: "object", properties: { section: { type: "string" }, content: { type: "string" } } } },
            modified_sections: { type: "array", items: { type: "object", properties: { section: { type: "string" }, original: { type: "string" }, modified: { type: "string" } } } },
            formatting_changes: { type: "array", items: { type: "string" } },
            total_changes: { type: "number" }
          }
        },
        file_urls: [leftFile.file_url, rightFile.file_url]
      });

      setComparisonResult(result);

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_name: `${leftFile.name} vs ${rightFile.name}`,
        details: { action: 'compare', similarity: result.similarity_percentage }
      });

    } catch (error) {
      toast.error('Comparison failed. Please try again.');
    }

    setComparing(false);
  };

  const clearFiles = () => {
    setLeftFile(null);
    setRightFile(null);
    setComparisonResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Document Comparison
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Compare documents with AI-powered analysis or side-by-side view
        </p>
      </motion.div>

      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList className={`grid grid-cols-2 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border`}>
          <TabsTrigger value="ai">AI Comparison</TabsTrigger>
          <TabsTrigger value="visual">Visual Diff</TabsTrigger>
        </TabsList>

        <TabsContent value="ai">
          <AIDocumentComparison isDark={isDark} />
        </TabsContent>

        <TabsContent value="visual">
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
                <GitCompare className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-300">Advanced PDF Comparison</span>
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Compare PDFs Side-by-Side
              </h2>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Upload two documents to see detailed differences, changes, and similarities
              </p>
            </div>

      {/* Upload Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left Document */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className={`h-full ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">1</span>
                </div>
                Original Document
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Upload the original or older version
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leftFile ? (
                <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-blue-400" />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{leftFile.name}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready to compare</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLeftFile(null)}
                    className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <DropZone
                  onFileUploaded={handleLeftFileUploaded}
                  acceptedTypes={['.pdf']}
                  maxSize={25 * 1024 * 1024}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Document */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className={`h-full ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold text-sm">2</span>
                </div>
                Modified Document
              </CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Upload the modified or newer version
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rightFile ? (
                <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-emerald-400" />
                    <div>
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{rightFile.name}</p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Ready to compare</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRightFile(null)}
                    className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <DropZone
                  onFileUploaded={handleRightFileUploaded}
                  acceptedTypes={['.pdf']}
                  maxSize={25 * 1024 * 1024}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Side-by-Side Viewer */}
      {leftFile && rightFile && !comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <SideBySideViewer doc1={leftFile} doc2={rightFile} isDark={isDark} />
        </motion.div>
      )}

      {/* Compare Button */}
      {leftFile && rightFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mb-8"
        >
          <Button
            onClick={compareDocuments}
            disabled={comparing}
            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
          >
            {comparing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Comparing Documents...
              </>
            ) : (
              <>
                <GitCompare className="w-5 h-5 mr-2" />
                AI Compare Documents
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={clearFiles}
            className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </motion.div>
      )}

      {/* AI Comparison Tools */}
      {leftFile && rightFile && comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <AIComparisonTools doc1={leftFile} doc2={rightFile} isDark={isDark} />
        </motion.div>
      )}

      {/* Comparison Results */}
      <AnimatePresence>
        {comparisonResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="pt-6 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40" cy="40" r="35"
                        stroke={isDark ? '#334155' : '#e2e8f0'}
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40" cy="40" r="35"
                        stroke={comparisonResult.similarity_percentage > 70 ? '#10b981' : comparisonResult.similarity_percentage > 40 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={220}
                        strokeDashoffset={220 - (220 * comparisonResult.similarity_percentage) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {comparisonResult.similarity_percentage}%
                    </span>
                  </div>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Similarity</p>
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {comparisonResult.added_content?.length || 0}
                  </p>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Added</p>
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Minus className="w-6 h-6 text-red-400" />
                  </div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {comparisonResult.removed_content?.length || 0}
                  </p>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Removed</p>
                </CardContent>
              </Card>

              <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-amber-400" />
                  </div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {comparisonResult.modified_sections?.length || 0}
                  </p>
                  <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Modified</p>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Comparison Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{comparisonResult.summary}</p>
              </CardContent>
            </Card>

            {/* Detailed Changes */}
            <Tabs defaultValue="differences" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'} border`}>
                  <TabsTrigger value="differences">Key Differences</TabsTrigger>
                  <TabsTrigger value="added">Added Content</TabsTrigger>
                  <TabsTrigger value="removed">Removed Content</TabsTrigger>
                  <TabsTrigger value="modified">Modified Sections</TabsTrigger>
                </TabsList>

                <div className={`hidden md:flex ${isDark ? 'border-slate-700' : 'border-slate-200'} border rounded-lg overflow-hidden`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={viewMode === 'side-by-side' ? (isDark ? 'bg-slate-800' : 'bg-slate-100') : ''}
                    onClick={() => setViewMode('side-by-side')}
                  >
                    <Columns className="w-4 h-4 mr-1" />
                    Side by Side
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={viewMode === 'inline' ? (isDark ? 'bg-slate-800' : 'bg-slate-100') : ''}
                    onClick={() => setViewMode('inline')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Inline
                  </Button>
                </div>
              </div>

              <TabsContent value="differences">
                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="pt-6">
                    {comparisonResult.key_differences?.length > 0 ? (
                      <ul className="space-y-3">
                        {comparisonResult.key_differences.map((diff, i) => (
                          <li key={i} className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{diff}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No significant differences found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="added">
                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="pt-6">
                    {comparisonResult.added_content?.length > 0 ? (
                      <div className="space-y-4">
                        {comparisonResult.added_content.map((item, i) => (
                          <div key={i} className={`p-4 rounded-lg border-l-4 border-emerald-500 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              {item.section}
                            </p>
                            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No added content found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="removed">
                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="pt-6">
                    {comparisonResult.removed_content?.length > 0 ? (
                      <div className="space-y-4">
                        {comparisonResult.removed_content.map((item, i) => (
                          <div key={i} className={`p-4 rounded-lg border-l-4 border-red-500 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                            <p className={`text-sm font-medium mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                              {item.section}
                            </p>
                            <p className={`line-through ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No removed content found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modified">
                <Card className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="pt-6">
                    {comparisonResult.modified_sections?.length > 0 ? (
                      <div className="space-y-6">
                        {comparisonResult.modified_sections.map((item, i) => (
                          <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <p className={`text-sm font-medium mb-3 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                              {item.section}
                            </p>
                            <div className={viewMode === 'side-by-side' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4'}>
                              <div className={`p-3 rounded-lg border-l-4 border-red-500 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}>Original</p>
                                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.original}</p>
                              </div>
                              <div className={`p-3 rounded-lg border-l-4 border-emerald-500 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Modified</p>
                                <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item.modified}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        No modified sections found
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}