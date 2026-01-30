import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Settings, TrendingUp, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';

export default function CustomDashboard({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalConversions: 0,
    recentActivity: []
  });
  const [widgets, setWidgets] = useState([
    { id: 'quick-actions', title: 'Quick Actions', enabled: true },
    { id: 'recent-files', title: 'Recent Files', enabled: true },
    { id: 'stats', title: 'Statistics', enabled: true },
    { id: 'ai-suggestions', title: 'AI Suggestions', enabled: true }
  ]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [documents, conversions, activities] = await Promise.all([
        base44.entities.Document.list(),
        base44.entities.ConversionJob.list(),
        base44.entities.ActivityLog.list('-created_date', 5)
      ]);

      setStats({
        totalFiles: documents.length,
        totalConversions: conversions.filter(c => c.status === 'completed').length,
        recentActivity: activities
      });
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                My Dashboard
              </h1>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Your personalized workspace
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Files</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stats.totalFiles}
                </p>
              </div>
              <FileText className="w-12 h-12 text-violet-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Conversions</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stats.totalConversions}
                </p>
              </div>
              <Zap className="w-12 h-12 text-cyan-400 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Activity</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {stats.recentActivity.length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-emerald-400 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to={createPageUrl('Convert')}>
              <Button className="w-full justify-start" variant="outline">
                <Zap className="w-4 h-4 mr-2" />
                Convert Files
              </Button>
            </Link>
            <Link to={createPageUrl('AIAssistant')}>
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
            </Link>
            <Link to={createPageUrl('CloudStorage')}>
              <Button className="w-full justify-start" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Cloud Storage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.recentActivity.map((activity, idx) => (
              <div key={idx} className={`p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {new Date(activity.created_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}