import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutTemplate, Plus, Users, Settings, Search, Grid3X3, 
  Sparkles, Briefcase, GraduationCap, FileText, Heart, Home,
  TrendingUp, Scale, ChevronDown 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import ExpandedTemplateLibrary from '@/components/templates/ExpandedTemplateLibrary';
import EnhancedTemplateCreator from '@/components/templates/EnhancedTemplateCreator';
import TemplateSearchFilter from '@/components/templates/TemplateSearchFilter';
import EnhancedMarketplace from '@/components/templates/EnhancedMarketplace';
import AITemplateWizard from '@/components/templates/AITemplateWizard';
import ComprehensiveAnalyticsDashboard from '@/components/templates/ComprehensiveAnalyticsDashboard';
import AdvancedTemplateEditor from '@/components/templates/AdvancedTemplateEditor';

const categories = [
  { id: 'all', label: 'All Templates', icon: Grid3X3, count: 500 },
  { id: 'business', label: 'Business', icon: Briefcase, count: 120 },
  { id: 'education', label: 'Education', icon: GraduationCap, count: 85 },
  { id: 'legal', label: 'Legal', icon: Scale, count: 65 },
  { id: 'personal', label: 'Personal', icon: Heart, count: 95 },
  { id: 'real-estate', label: 'Real Estate', icon: Home, count: 45 },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp, count: 90 },
];

export default function Templates({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [selectedTab, setSelectedTab] = useState('browse');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
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
        <p className={`max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Choose from hundreds of professionally designed templates for any need. Create, customize, and deploy in minutes.
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg'
                    : isDark
                    ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.label}</span>
                <Badge variant="secondary" className={`${isActive ? 'bg-white/20 text-white' : ''} text-xs`}>
                  {category.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Navigation */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <TabsList className={`${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
            <TabsTrigger value="browse">
              <Grid3X3 className="w-4 h-4 mr-2" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="w-4 h-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="marketplace">
              <TrendingUp className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Sparkles className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            {/* AI Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={isDark ? 'border-slate-700' : 'border-slate-200'}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Tools
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
                <DropdownMenuLabel>AI-Powered Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedTab('ai-wizard')}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Template Wizard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTab('ai-optimizer')}>
                  AI Optimizer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTab('ai-personalizer')}>
                  AI Personalizer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTab('ai-manager')}>
                  AI Manager
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Advanced Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={isDark ? 'border-slate-700' : 'border-slate-200'}>
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}>
                <DropdownMenuLabel>Advanced Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedTab('editor')}>
                  Advanced Editor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTab('collaborate')}>
                  <Users className="w-4 h-4 mr-2" />
                  Collaboration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTab('versioning')}>
                  Version Control
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedTab('monetize')}>
                  Monetization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              onClick={() => setSelectedTab('create')} 
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="browse" className="mt-6">
          <ExpandedTemplateLibrary isDark={isDark} categoryFilter={selectedCategory} />
        </TabsContent>

        <TabsContent value="create">
          <EnhancedTemplateCreator isDark={isDark} onSave={() => setSelectedTab('browse')} />
        </TabsContent>

        <TabsContent value="search">
          <TemplateSearchFilter onResults={(results) => console.log(results)} isDark={isDark} />
        </TabsContent>

        <TabsContent value="marketplace">
          <EnhancedMarketplace isDark={isDark} />
        </TabsContent>

        <TabsContent value="analytics">
          <ComprehensiveAnalyticsDashboard isDark={isDark} />
        </TabsContent>

        <TabsContent value="ai-wizard">
          <AITemplateWizard onComplete={() => setSelectedTab('browse')} isDark={isDark} />
        </TabsContent>

        <TabsContent value="editor">
          <AdvancedTemplateEditor isDark={isDark} />
        </TabsContent>
      </Tabs>
    </div>
  );
}