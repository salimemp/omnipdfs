import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Star, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AuthPrompt({ feature, isDark = true }) {
  const handleSignUp = async () => {
    await base44.auth.redirectToLogin(window.location.pathname);
  };

  const features = [
    'Save and organize your files',
    'Access advanced editing tools',
    'Use AI assistant and templates',
    'Sync across all devices',
    'Priority processing',
    'No file size limits'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-8 text-center ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200 shadow-lg'}`}
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-white" />
      </div>

      <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {feature ? `Sign in to use ${feature}` : 'Create a Free Account'}
      </h3>
      
      <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Unlock all features with a free account
      </p>

      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {features.map((feat, i) => (
          <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <Star className="w-4 h-4 text-violet-400 shrink-0" />
            <span className={`text-sm text-left ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {feat}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleSignUp}
          className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white px-8 py-6"
        >
          <Zap className="w-5 h-5 mr-2" />
          Sign Up Free
        </Button>
        <Button
          variant="outline"
          onClick={handleSignUp}
          className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}
        >
          Sign In
        </Button>
      </div>

      <div className={`flex items-center justify-center gap-2 mt-6 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
        <Shield className="w-4 h-4 text-emerald-400" />
        <span>Free forever • No credit card required</span>
      </div>
    </motion.div>
  );
}