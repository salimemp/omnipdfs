import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-light rounded-2xl p-6 hover:border-violet-500/30 transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${gradient ? 'text-gradient' : 'text-white'}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient || 'from-violet-500/20 to-cyan-500/20'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
      </div>
    </motion.div>
  );
}