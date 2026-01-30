import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import AITaskEngine from '@/components/automation/AITaskEngine';

export default function TaskAutomationPage({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Task Automation
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              Create intelligent workflows that run automatically
            </p>
          </div>
        </div>
      </motion.div>

      <AITaskEngine isDark={isDark} />
    </div>
  );
}