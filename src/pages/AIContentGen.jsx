import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AIContentGenerator from '@/components/ai/AIContentGenerator';

export default function AIContentGenPage({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI Content Generation
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Generate professional content instantly with AI
          </p>
        </div>
      </motion.div>

      <AIContentGenerator isDark={isDark} />
    </div>
  );
}