import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, FileText, Sparkles, AlertCircle, CheckCircle2, Info, Zap, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import DropZone from '@/components/shared/DropZone';

export default function AIDocumentComparison({ isDark = true }) {
  const [document1, setDocument1] = useState(null);
  const [document2, setDocument2] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [results, setResults] = useState(null);
  const [comparisonMode, setComparisonMode] = useState('comprehensive');

  const comparisonModes = {
    comprehensive: { label: 'Comprehensive', desc: 'Full detailed analysis' },
    quick: { label: 'Quick', desc: 'Fast key differences' },
    semantic: { label: 'Semantic', desc: 'Meaning-based comparison' },
    structural: { label: 'Structural', desc: 'Format and layout' }
  };

  const compareDocuments = async () => {
    if (!document1 || !document2) {
      toast.error('Please upload both documents');
      return;
    }

    setComparing(true);

    try {
      const response = await base44.functions.invoke('compareDocuments', {
        document1Id: document1.id,
        document2Id: document2.id,
        mode: comparisonMode
      });

      setResults(response.data);
      toast.success('Comparison completed');
    } catch (error) {
      toast.error('Comparison failed');
      console.error(error);
    } finally {
      setComparing(false);
    }
  };

  const exportComparison = () => {
    if (!results) return;
    const content = JSON.stringify(results, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Comparison exported');
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200'}`}>
        <div className="flex items-center gap-3">
          <GitCompare className="w-6 h-6 text-cyan-400" />
          <div>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Document Comparison
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Intelligent document diff with semantic understanding
            </p>
          </div>
        </div>
        {results && (
          <Button onClick={exportComparison} variant="outline" size="sm" className={isDark ? 'border-slate-700' : ''}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </div>

      {/* Comparison Mode Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(comparisonModes).map(([key, mode]) => (
          <motion.button
            key={key}
            onClick={() => setComparisonMode(key)}
            whileHover={{ scale: 1.02 }}
            className={`p-3 rounded-xl text-left transition-all ${
              comparisonMode === key
                ? 'ring-2 ring-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/10'
                : isDark ? 'glass-light hover:border-cyan-500/30' : 'bg-white border border-slate-200 hover:border-cyan-300'
            }`}
          >
            <p className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{mode.label}</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{mode.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Upload Areas */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Document 1 (Original)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!document1 ? (
              <DropZone
                onFileUploaded={async (fileData) => {
                  const doc = await base44.entities.Document.create(fileData);
                  setDocument1(doc);
                }}
                maxSize={50 * 1024 * 1024}
              />
            ) : (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {document1.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {(document1.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDocument1(null)}
                  className="w-full"
                >
                  Change Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={`text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Document 2 (Comparison)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!document2 ? (
              <DropZone
                onFileUploaded={async (fileData) => {
                  const doc = await base44.entities.Document.create(fileData);
                  setDocument2(doc);
                }}
                maxSize={50 * 1024 * 1024}
              />
            ) : (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {document2.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {(document2.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDocument2(null)}
                  className="w-full"
                >
                  Change Document
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compare Button */}
      <Button
        onClick={compareDocuments}
        disabled={!document1 || !document2 || comparing}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
      >
        {comparing ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
            Analyzing Differences...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Compare Documents
          </>
        )}
      </Button>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ComparisonResults results={results} isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparisonResults({ results, isDark }) {
  const similarityColor = results.similarity_score >= 80 ? 'text-emerald-400' : results.similarity_score >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>Comparison Results</CardTitle>
          <Badge className={`${similarityColor} bg-opacity-20`}>
            {results.similarity_score}% Similar
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Similarity Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Similarity Score
            </span>
            <span className={`text-sm font-bold ${similarityColor}`}>
              {results.similarity_score}%
            </span>
          </div>
          <Progress value={results.similarity_score} className="h-2" />
        </div>

        {/* Summary */}
        {results.summary && (
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Summary
            </h4>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {results.summary}
            </p>
          </div>
        )}

        {/* Differences Tabs */}
        <Tabs defaultValue="additions" className="w-full">
          <TabsList className={`grid grid-cols-3 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
            <TabsTrigger value="additions">
              Additions {results.additions?.length > 0 && `(${results.additions.length})`}
            </TabsTrigger>
            <TabsTrigger value="deletions">
              Deletions {results.deletions?.length > 0 && `(${results.deletions.length})`}
            </TabsTrigger>
            <TabsTrigger value="modifications">
              Changes {results.modifications?.length > 0 && `(${results.modifications.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="additions" className="space-y-2">
            {results.additions?.length > 0 ? (
              results.additions.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 border-emerald-500 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</p>
                </div>
              ))
            ) : (
              <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No additions found
              </p>
            )}
          </TabsContent>

          <TabsContent value="deletions" className="space-y-2">
            {results.deletions?.length > 0 ? (
              results.deletions.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 border-red-500 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</p>
                </div>
              ))
            ) : (
              <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No deletions found
              </p>
            )}
          </TabsContent>

          <TabsContent value="modifications" className="space-y-2">
            {results.modifications?.length > 0 ? (
              results.modifications.map((item, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 border-amber-500 ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</p>
                </div>
              ))
            ) : (
              <p className={`text-sm text-center py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No modifications found
              </p>
            )}
          </TabsContent>
        </Tabs>

        {/* Key Insights */}
        {results.insights?.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Key Insights
            </h4>
            <div className="space-y-2">
              {results.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}