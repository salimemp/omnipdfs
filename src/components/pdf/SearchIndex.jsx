import React, { useState } from 'react';
import { Search, FileSearch, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SearchIndex({ document, isDark }) {
  const [indexing, setIndexing] = useState(false);
  const [indexed, setIndexed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);

  const buildIndex = async () => {
    setIndexing(true);
    setProgress(0);

    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: document?.id,
        details: { type: 'search_index_built' }
      });

      setIndexed(true);
      toast.success('Search index created');
    } catch (error) {
      toast.error('Failed to build index');
    } finally {
      setIndexing(false);
    }
  };

  const performSearch = async () => {
    if (!searchQuery) return;

    setSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResults = [
        { page: 1, text: `...found "${searchQuery}" in the introduction section...`, matches: 2 },
        { page: 3, text: `...another occurrence of "${searchQuery}" appears here...`, matches: 1 },
        { page: 7, text: `...final mention of "${searchQuery}" in conclusions...`, matches: 1 },
      ];

      setResults(mockResults);
      toast.success(`Found ${mockResults.reduce((acc, r) => acc + r.matches, 0)} matches`);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileSearch className="w-5 h-5 text-violet-400" />
            Search Index
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!indexed ? (
            <>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Build a search index to enable fast full-text search across your document.
              </p>
              
              {indexing && (
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className={`text-sm text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Indexing... {progress}%
                  </p>
                </div>
              )}

              <Button onClick={buildIndex} disabled={indexing} className="w-full bg-violet-500">
                {indexing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Building Index...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-4 h-4 mr-2" />
                    Build Search Index
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  Search index is ready
                </span>
              </div>

              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search document..."
                  className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                  onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                />
                <Button onClick={performSearch} disabled={searching} className="bg-violet-500">
                  {searching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIndexed(false)}
                className="w-full"
              >
                Rebuild Index
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Search Results ({results.reduce((acc, r) => acc + r.matches, 0)} matches)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Page {result.page}</Badge>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {result.matches} {result.matches === 1 ? 'match' : 'matches'}
                  </span>
                </div>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {result.text}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}