import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutTemplate, Plus, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TemplateGallery from '@/components/templates/TemplateGallery';
import ExpandedTemplateLibrary from '@/components/templates/ExpandedTemplateLibrary';
import AdvancedTemplateEditor from '@/components/templates/AdvancedTemplateEditor';
import VisualTemplateEditor from '@/components/templates/VisualTemplateEditor';
import EnhancedTemplateCreator from '@/components/templates/EnhancedTemplateCreator';
import TemplateCollaboration from '@/components/templates/TemplateCollaboration';
import TemplateAnalytics from '@/components/templates/TemplateAnalytics';
import TemplateMarketplace from '@/components/templates/TemplateMarketplace';
import AITemplateOptimizer from '@/components/templates/AITemplateOptimizer';
import TemplateUsageAnalytics from '@/components/templates/TemplateUsageAnalytics';
import AITemplateWizard from '@/components/templates/AITemplateWizard';

export default function Templates({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [selectedTab, setSelectedTab] = useState('library');
  const [showCollaboration, setShowCollaboration] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <LayoutTemplate className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300">Template Library</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Professional PDF Templates
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Choose from hundreds of professionally designed templates for any need
        </p>
      </motion.div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className={`${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'} flex-wrap`}>
            <TabsTrigger value="library">Browse</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="visual">Visual Editor</TabsTrigger>
            <TabsTrigger value="editor">Advanced</TabsTrigger>
            <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
            <TabsTrigger value="wizard">AI Wizard</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="usage">Usage Stats</TabsTrigger>
            <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCollaboration(!showCollaboration)}
              className={showCollaboration ? 'bg-violet-500/20' : ''}
            >
              <Users className="w-4 h-4 mr-2" />
              Collaborate
            </Button>
            <Button size="sm" onClick={() => setSelectedTab('create')} className="bg-gradient-to-r from-violet-500 to-cyan-500">
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>

        <TabsContent value="library">
          <ExpandedTemplateLibrary isDark={isDark} />
        </TabsContent>

        <TabsContent value="gallery">
          <TemplateGallery isDark={isDark} />
        </TabsContent>

        <TabsContent value="visual">
          <VisualTemplateEditor isDark={isDark} />
        </TabsContent>

        <TabsContent value="editor">
          <AdvancedTemplateEditor isDark={isDark} />
        </TabsContent>

        <TabsContent value="create">
          {showCollaboration ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EnhancedTemplateCreator isDark={isDark} onSave={() => setSelectedTab('my-templates')} />
              </div>
              <div>
                <TemplateCollaboration templateId={null} isDark={isDark} />
              </div>
            </div>
          ) : (
            <EnhancedTemplateCreator isDark={isDark} onSave={() => setSelectedTab('my-templates')} />
          )}
        </TabsContent>

        <TabsContent value="marketplace">
          <TemplateMarketplace isDark={isDark} />
        </TabsContent>

        <TabsContent value="optimizer">
          <AITemplateOptimizer 
            template={null}
            onOptimized={() => setSelectedTab('my-templates')}
            isDark={isDark}
          />
        </TabsContent>

        <TabsContent value="wizard">
          <AITemplateWizard onComplete={() => setSelectedTab('my-templates')} isDark={isDark} />
        </TabsContent>

        <TabsContent value="analytics">
          <TemplateAnalytics isDark={isDark} />
        </TabsContent>

        <TabsContent value="usage">
          <TemplateUsageAnalytics isDark={isDark} />
        </TabsContent>

        <TabsContent value="my-templates">
          <TemplateGallery isDark={isDark} />
        </TabsContent>
      </Tabs>
    </div>
  );
}