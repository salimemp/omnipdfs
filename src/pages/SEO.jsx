import React from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEOOptimizer from '@/components/seo/SEOOptimizer';
import KeywordResearch from '@/components/seo/KeywordResearch';

export default function SEO({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Search className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">SEO Tools</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          SEO Optimization Suite
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Boost your search rankings with AI-powered SEO tools
        </p>
      </motion.div>

      <Tabs defaultValue="optimizer" className="space-y-6">
        <TabsList className={`${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
          <TabsTrigger value="optimizer">SEO Optimizer</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Research</TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer">
          <SEOOptimizer
            content="Sample content for SEO analysis"
            title="PDF Tools and Conversion"
            isDark={isDark}
          />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordResearch isDark={isDark} />
        </TabsContent>
      </Tabs>
    </div>
  );
}