import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InsightsDashboard({ collaborations, isDark }) {
  const totalComments = collaborations.reduce((acc, c) => acc + (c.comments?.length || 0), 0);
  const resolvedComments = collaborations.reduce((acc, c) => 
    acc + (c.comments?.filter(cm => cm.resolved)?.length || 0), 0);
  const activeCollaborators = new Set(
    collaborations.flatMap(c => c.collaborators?.map(col => col.email) || [])
  ).size;
  const avgResponseTime = '2.5 hours'; // Mock data

  const stats = [
    { label: 'Total Comments', value: totalComments, icon: MessageSquare, color: 'text-violet-400' },
    { label: 'Resolved', value: resolvedComments, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Active Users', value: activeCollaborators, icon: Users, color: 'text-cyan-400' },
    { label: 'Avg Response', value: avgResponseTime, icon: Clock, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {stat.label}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}