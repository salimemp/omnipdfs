import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search, TrendingUp, Zap, Target, Hash
} from 'lucide-react';
import { toast } from 'sonner';

export default function KeywordResearch({ isDark = true }) {
  const [query, setQuery] = useState('');
  const [researching, setResearching] = useState(false);
  const [results, setResults] = useState(null);

  const researchKeywords = async () => {
    if (!query) return;
    
    setResearching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Perform comprehensive keyword research for: "${query}"

Provide:
1. Primary keywords (high volume, high competition)
2. Long-tail keywords (lower competition, specific)
3. Related keywords and LSI terms
4. Search intent analysis
5. Competition level (Low/Medium/High)
6. Estimated search volume range
7. Keyword difficulty score (0-100)
8. Content ideas for each keyword

Format as detailed keyword analysis.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            primary_keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  volume: { type: "string" },
                  difficulty: { type: "number" },
                  competition: { type: "string" }
                }
              }
            },
            long_tail: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  volume: { type: "string" },
                  difficulty: { type: "number" }
                }
              }
            },
            related: { type: "array", items: { type: "string" } },
            intent: { type: "string" },
            content_ideas: { type: "array", items: { type: "string" } }
          }
        }
      });

      setResults(result);
      toast.success('Keyword research complete');
    } catch (e) {
      toast.error('Research failed');
    } finally {
      setResearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Hash className="w-5 h-5 text-violet-400" />
            Keyword Research
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter topic or keyword..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && researchKeywords()}
              className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
            />
            <Button
              onClick={researchKeywords}
              disabled={researching || !query}
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              {researching ? (
                <Zap className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Research
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Search Intent: {results.intent}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Primary Keywords
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.primary_keywords?.map((kw, i) => (
                <div key={i} className={`p-4 rounded-lg border-2 ${
                  kw.difficulty < 30 ? 'border-emerald-500/30 bg-emerald-500/5' :
                  kw.difficulty < 60 ? 'border-amber-500/30 bg-amber-500/5' :
                  'border-red-500/30 bg-red-500/5'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {kw.keyword}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Volume: {kw.volume}
                      </p>
                    </div>
                    <Badge variant={kw.competition === 'Low' ? 'default' : 'secondary'}>
                      {kw.competition}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Difficulty
                      </span>
                      <span className={`text-xs font-bold ${
                        kw.difficulty < 30 ? 'text-emerald-400' :
                        kw.difficulty < 60 ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {kw.difficulty}/100
                      </span>
                    </div>
                    <Progress value={kw.difficulty} className="h-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Long-Tail Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {results.long_tail?.map((kw, i) => (
                  <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {kw.keyword}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {kw.volume}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        KD: {kw.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Related Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.related?.map((kw, i) => (
                  <Badge key={i} variant="secondary">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Content Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {results.content_ideas?.map((idea, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <TrendingUp className="w-5 h-5 text-violet-400 shrink-0" />
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {idea}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}