import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DeepAnalysisPanel({ document, isDark = true }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeDeep = async (type) => {
    setAnalyzing(true);
    try {
      const response = await base44.functions.invoke('deepAIAnalysis', {
        documentId: document.id,
        deepAnalysisType: type
      });

      if (response.data.success) {
        setAnalysis({ type, data: response.data.analysis });
        toast.success('Deep analysis complete');
      }
    } catch (error) {
      toast.error('Analysis failed');
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Button onClick={() => analyzeDeep('entity_extraction')} disabled={analyzing} variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Entities
        </Button>
        <Button onClick={() => analyzeDeep('relationship_mapping')} disabled={analyzing} variant="outline">
          <Target className="w-4 h-4 mr-2" />
          Relations
        </Button>
        <Button onClick={() => analyzeDeep('intent_analysis')} disabled={analyzing} variant="outline">
          <Brain className="w-4 h-4 mr-2" />
          Intent
        </Button>
        <Button onClick={() => analyzeDeep('quality_metrics')} disabled={analyzing} variant="outline">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Quality
        </Button>
        <Button onClick={() => analyzeDeep('predictive_insights')} disabled={analyzing} variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Insights
        </Button>
      </div>

      {analyzing && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4" />
            <p className="text-slate-400">Performing deep analysis...</p>
          </CardContent>
        </Card>
      )}

      {!analyzing && analysis && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Deep Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>
              {JSON.stringify(analysis.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}