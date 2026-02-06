import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, FileText, Brain, Zap, Database, CheckCircle2, Loader2, Download, Copy, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RAGDocumentQuery({ documents, isDark = true }) {
  const [query, setQuery] = useState('');
  const [queryMode, setQueryMode] = useState('semantic');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [extractionType, setExtractionType] = useState('entities');

  const queryModes = {
    semantic: { name: 'Semantic Search', icon: Brain, desc: 'Find by meaning' },
    keyword: { name: 'Keyword Search', icon: Search, desc: 'Exact matches' },
    extract: { name: 'Data Extraction', icon: Database, desc: 'Structured data' },
    analyze: { name: 'Deep Analysis', icon: Sparkles, desc: 'Comprehensive insights' }
  };

  const extractionTypes = [
    { value: 'entities', label: 'Named Entities', desc: 'People, places, organizations' },
    { value: 'dates', label: 'Dates & Times', desc: 'Temporal information' },
    { value: 'numbers', label: 'Numbers & Metrics', desc: 'Quantitative data' },
    { value: 'relationships', label: 'Relationships', desc: 'Connections between entities' },
    { value: 'tables', label: 'Tables & Lists', desc: 'Structured tabular data' },
    { value: 'custom', label: 'Custom Schema', desc: 'Define your own' }
  ];

  const executeQuery = async () => {
    if (!query && queryMode !== 'analyze') {
      toast.error('Please enter a query');
      return;
    }

    setProcessing(true);

    try {
      const prompt = buildPrompt(queryMode, query);
      const schema = buildSchema(queryMode);

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: documents.map(d => d.file_url),
        add_context_from_internet: false,
        response_json_schema: schema
      });

      setResults({
        mode: queryMode,
        query,
        data: response,
        timestamp: new Date().toISOString()
      });

      toast.success('Query completed successfully');
    } catch (error) {
      toast.error('Query failed');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const buildPrompt = (mode, userQuery) => {
    switch (mode) {
      case 'semantic':
        return `Search these documents semantically for: "${userQuery}". Return relevant passages with context and similarity scores.`;
      
      case 'keyword':
        return `Find exact keyword matches for: "${userQuery}". Return locations, surrounding context, and frequency.`;
      
      case 'extract':
        return `Extract ${extractionType} from these documents. Be comprehensive and structured.`;
      
      case 'analyze':
        return `Perform deep document analysis:
1. Document type and structure
2. Main topics and themes
3. Key entities and relationships
4. Data quality and completeness
5. Actionable insights`;
      
      default:
        return userQuery;
    }
  };

  const buildSchema = (mode) => {
    const schemas = {
      semantic: {
        type: "object",
        properties: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                passage: { type: "string" },
                relevance_score: { type: "number" },
                document_reference: { type: "string" },
                context: { type: "string" }
              }
            }
          },
          total_matches: { type: "number" }
        }
      },
      keyword: {
        type: "object",
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                keyword: { type: "string" },
                occurrences: { type: "number" },
                locations: { type: "array", items: { type: "string" } },
                contexts: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      },
      extract: {
        type: "object",
        properties: {
          extracted_data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                value: { type: "string" },
                confidence: { type: "number" },
                context: { type: "string" }
              }
            }
          },
          summary: { type: "string" },
          data_quality_score: { type: "number" }
        }
      },
      analyze: {
        type: "object",
        properties: {
          document_type: { type: "string" },
          structure_analysis: { type: "string" },
          main_topics: { type: "array", items: { type: "string" } },
          key_entities: { type: "array", items: { type: "string" } },
          relationships: { type: "array", items: { type: "string" } },
          data_completeness: { type: "number" },
          insights: { type: "array", items: { type: "string" } },
          recommendations: { type: "array", items: { type: "string" } }
        }
      }
    };

    return schemas[mode] || schemas.semantic;
  };

  const exportResults = () => {
    const content = JSON.stringify(results, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Results exported');
  };

  return (
    <div className="space-y-6">
      <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20' : 'bg-gradient-to-r from-violet-50 to-cyan-50 border border-violet-200'}`}>
        <Database className="w-6 h-6 text-violet-500" />
        <div>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            RAG Document Intelligence
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Advanced retrieval-augmented generation for document analysis
          </p>
        </div>
      </div>

      {/* Query Mode Selection */}
      <div className="grid md:grid-cols-4 gap-3">
        {Object.entries(queryModes).map(([key, mode]) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={key}
              onClick={() => setQueryMode(key)}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl text-left transition-all ${
                queryMode === key
                  ? 'ring-2 ring-violet-500 bg-gradient-to-br from-violet-500/20 to-purple-500/10'
                  : isDark ? 'glass-light hover:border-violet-500/30' : 'bg-white border border-slate-200 hover:border-violet-300'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${queryMode === key ? 'text-violet-400' : 'text-violet-500'}`} />
              <h3 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{mode.name}</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{mode.desc}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Query Input */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
            {queryMode === 'extract' ? 'Configure Extraction' : 'Enter Query'}
          </CardTitle>
          <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
            {queryMode === 'extract' 
              ? 'Select what type of data to extract from documents'
              : 'Search across all uploaded documents using AI-powered understanding'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {queryMode === 'extract' ? (
            <Select value={extractionType} onValueChange={setExtractionType}>
              <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                {extractionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value} className={isDark ? 'text-white' : ''}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-slate-400">{type.desc}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : queryMode !== 'analyze' && (
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={queryMode === 'semantic' ? 'What information are you looking for?' : 'Enter keywords...'}
                className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                onKeyPress={(e) => e.key === 'Enter' && executeQuery()}
              />
            </div>
          )}

          <Button 
            onClick={executeQuery} 
            disabled={processing || documents.length === 0}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {queryMode === 'analyze' ? 'Analyze Documents' : 'Execute Query'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {results && (
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
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Query Results
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {new Date(results.timestamp).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(results.data, null, 2))} className={isDark ? 'border-slate-700' : ''}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={exportResults} className="bg-gradient-to-r from-violet-500 to-purple-600">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResultsDisplay results={results} isDark={isDark} />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultsDisplay({ results, isDark }) {
  const { mode, data } = results;

  if (mode === 'semantic' && data.results) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Badge className="bg-violet-500/20 text-violet-400">
            {data.total_matches} matches found
          </Badge>
        </div>
        {data.results.map((result, i) => (
          <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Relevance: {(result.relevance_score * 100).toFixed(0)}%
              </span>
              <Badge variant="outline" className={isDark ? 'border-violet-500/30 text-violet-300' : ''}>
                {result.document_reference}
              </Badge>
            </div>
            <p className={`text-sm mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {result.passage}
            </p>
            {result.context && (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Context: {result.context}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'extract' && data.extracted_data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-emerald-500/20 text-emerald-400">
            {data.extracted_data.length} items extracted
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400">
            Quality: {(data.data_quality_score * 100).toFixed(0)}%
          </Badge>
        </div>
        {data.summary && (
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {data.summary}
          </p>
        )}
        <div className="grid gap-3">
          {data.extracted_data.map((item, i) => (
            <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className={isDark ? 'border-cyan-500/30 text-cyan-300' : ''}>
                  {item.type}
                </Badge>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {(item.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {item.value}
              </p>
              {item.context && (
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {item.context}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (mode === 'analyze') {
    return (
      <div className="space-y-6">
        {data.document_type && (
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Document Type</h4>
            <Badge className="bg-violet-500/20 text-violet-400">{data.document_type}</Badge>
          </div>
        )}
        {data.main_topics?.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Main Topics</h4>
            <div className="flex flex-wrap gap-2">
              {data.main_topics.map((topic, i) => (
                <Badge key={i} variant="outline" className={isDark ? 'border-cyan-500/30 text-cyan-300' : ''}>
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {data.insights?.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Insights</h4>
            <ul className="space-y-2">
              {data.insights.map((insight, i) => (
                <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.recommendations?.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Recommendations</h4>
            <ul className="space-y-2">
              {data.recommendations.map((rec, i) => (
                <li key={i} className={`flex items-start gap-2 p-2 rounded-lg ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <pre className={`text-xs p-4 rounded-lg overflow-auto ${isDark ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}