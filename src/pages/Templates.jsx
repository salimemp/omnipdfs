import React from 'react';
import { motion } from 'framer-motion';
import { LayoutTemplate } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TemplateGallery from '@/components/templates/TemplateGallery';
import TemplateCreator from '@/components/templates/TemplateCreator';

export default function Templates({ theme = 'dark' }) {
  const isDark = theme === 'dark';

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

      <Tabs defaultValue="gallery" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="gallery">Template Gallery</TabsTrigger>
          <TabsTrigger value="create">Create Template</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <TemplateGallery isDark={isDark} />
        </TabsContent>

        <TabsContent value="create">
          <TemplateCreator isDark={isDark} />
        </TabsContent>

        <TabsContent value="my-templates">
          <TemplateGallery isDark={isDark} />
        </TabsContent>
      </Tabs>
    </div>
  );
}