import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Cloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIAnalyticsDashboard from '@/components/analytics/AIAnalyticsDashboard';
import VersionControl from '@/components/versioning/VersionControl';
import ServiceSync from '@/components/integration/ServiceSync';

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

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className={`grid w-full md:w-auto grid-cols-3 ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="versioning" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Versioning
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Integration
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="integration">
          <div className="space-y-4">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sync your documents to external services like Google Drive, Dropbox, OneDrive, and Box.
            </p>
            <ServiceSync documentId={selectedDocId} isDark={isDark} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}