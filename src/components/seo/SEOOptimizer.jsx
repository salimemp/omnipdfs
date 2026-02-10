import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search, TrendingUp, CheckCircle2, AlertCircle, Sparkles, Copy, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function SEOOptimizer({ content, title, isDark = true }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [metaTitle, setMetaTitle] = useState(title || '');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [slug, setSlug] = useState('');

  const analyzeSEO = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this content for SEO optimization. Provide:
1. SEO score (0-100)
2. Optimal meta title (50-60 chars)
3. Meta description (150-160 chars)
4. 5-10 relevant keywords
5. URL-friendly slug
6. Content improvements
7. Keyword density analysis
8. Readability score

Content Title: ${metaTitle}
Content: ${content}`,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            meta_title: { type: "string" },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            slug: { type: "string" },
            improvements: { type: "array", items: { type: "string" } },
            keyword_density: { type: "object" },
            readability_score: { type: "number" }
          }
        }
      });

      setSeoData(result);
      setMetaTitle(result.meta_title);
      setMetaDescription(result.meta_description);
      setKeywords(result.keywords.join(', '));
      setSlug(result.slug);
      toast.success('SEO analysis complete');
    } catch (e) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateStructuredData = () => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": metaTitle,
      "description": metaDescription,
      "keywords": keywords,
      "author": {
        "@type": "Organization",
        "name": "OmniPDFs"
      },
      "publisher": {
        "@type": "Organization",
        "name": "OmniPDFs",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      }
    }, null, 2);
  };

  const copyMeta = () => {
    const meta = `<title>${metaTitle}</title>
<meta name="description" content="${metaDescription}">
<meta name="keywords" content="${keywords}">
<meta property="og:title" content="${metaTitle}">
<meta property="og:description" content="${metaDescription}">
<meta name="twitter:title" content="${metaTitle}">
<meta name="twitter:description" content="${metaDescription}">`;
    navigator.clipboard.writeText(meta);
    toast.success('Meta tags copied');
  };

  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Search className="w-5 h-5 text-violet-400" />
              SEO Optimizer
            </CardTitle>
            <Button
              onClick={analyzeSEO}
              disabled={analyzing || !content}
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
              size="sm"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyze SEO
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {seoData && (
        <>
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                SEO Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-3xl font-bold ${
                    seoData.score >= 80 ? 'text-emerald-400' :
                    seoData.score >= 60 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {seoData.score}
                  </span>
                  <Badge variant={seoData.score >= 80 ? 'default' : 'secondary'}>
                    {seoData.score >= 80 ? 'Excellent' : seoData.score >= 60 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
                <Progress value={seoData.score} className="h-2" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Readability
                  </p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {seoData.readability_score}/100
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Keywords
                  </p>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {seoData.keywords.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Meta Tags
                </CardTitle>
                <Button size="sm" variant="outline" onClick={copyMeta}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Title ({metaTitle.length}/60)
                </label>
                <Input
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Description ({metaDescription.length}/160)
                </label>
                <Textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className={`mt-2 min-h-[80px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Keywords
                </label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
              <div>
                <label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  URL Slug
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {seoData.improvements.map((imp, i) => (
                <div key={i} className={`flex gap-3 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  {imp.toLowerCase().includes('good') || imp.toLowerCase().includes('excellent') ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{imp}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardHeader>
              <CardTitle className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Structured Data (JSON-LD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateStructuredData()}
                readOnly
                className={`font-mono text-xs min-h-[200px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}