import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Cloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Users, Workflow, Code, Brain } from 'lucide-react';
import AIAnalyticsDashboard from '@/components/analytics/AIAnalyticsDashboard';
import VersionControl from '@/components/versioning/VersionControl';
import ServiceSync from '@/components/integration/ServiceSync';
import WorkflowIntegrations from '@/components/integration/WorkflowIntegrations';

export default function AdvancedFeaturesPage({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [selectedDocId, setSelectedDocId] = useState(null);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Advanced Features
            </h1>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              AI analytics, versioning, and external integrations
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={`grid w-full md:w-auto grid-cols-4 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="versioning" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Versioning
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-4">
            <Link to={createPageUrl('TeamDashboard')}>
              <Card className={`group hover:shadow-lg transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Team Dashboard</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Monitor team activity and collaboration</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('TaskAutomation')}>
              <Card className={`group hover:shadow-lg transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Workflow className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Workflow Automation</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Build custom workflows with AI</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('APIIntegrations')}>
              <Card className={`group hover:shadow-lg transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>API Integration</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>RESTful API for external apps</p>
                </CardContent>
              </Card>
            </Link>

            <Link to={createPageUrl('AIContentGen')}>
              <Card className={`group hover:shadow-lg transition-all cursor-pointer ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Content Generation</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Generate content with AI</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AIAnalyticsDashboard isDark={isDark} />
        </TabsContent>

        <TabsContent value="versioning">
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              View and manage document versions. Select a document from your files to see its version history.
            </p>
            <VersionControl documentId={selectedDocId} isDark={isDark} />
          </div>
        </TabsContent>

        <TabsContent value="workflows">
          <WorkflowIntegrations isDark={isDark} />
        </TabsContent>
      </Tabs>
    </div>
  );
}