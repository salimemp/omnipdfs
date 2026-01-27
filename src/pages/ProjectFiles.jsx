import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Folder, FileCode, FileJson, Search, Download,
  Eye, Copy, ChevronRight, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const projectStructure = {
  entities: [
    'ConversionJob.json', 'Document.json', 'Folder.json', 'ActivityLog.json',
    'ComplianceLog.json', 'LegalDocument.json', 'Collaboration.json',
    'Template.json', 'Webhook.json', 'OCRJob.json'
  ],
  pages: [
    'Dashboard.jsx', 'Convert.jsx', 'PDFTools.jsx', 'PDFEditor.jsx',
    'FormFiller.jsx', 'OCR.jsx', 'Templates.jsx', 'AIDocGenerator.jsx',
    'Compare.jsx', 'AIAssistant.jsx', 'Collaboration.jsx', 'LegalDocs.jsx',
    'TranslationMemory.jsx', 'Files.jsx', 'Analytics.jsx', 'APIDocs.jsx',
    'Settings.jsx', 'ProjectFiles.jsx'
  ],
  components: {
    ui: [
      'button.jsx', 'input.jsx', 'select.jsx', 'badge.jsx', 'dialog.jsx',
      'tabs.jsx', 'card.jsx', 'avatar.jsx', 'switch.jsx', 'slider.jsx',
      'progress.jsx', 'textarea.jsx', 'label.jsx', 'popover.jsx',
      'dropdown-menu.jsx', 'alert-dialog.jsx', 'sheet.jsx', 'toast.jsx'
    ],
    shared: [
      'DropZone.jsx', 'FileCard.jsx', 'StatsCard.jsx', 'FileIcon.jsx',
      'CookieConsent.jsx', 'AccessibilityPanel.jsx', 'ReadAloud.jsx'
    ],
    editor: [
      'AIToolsPanel.jsx', 'AdvancedToolbar.jsx', 'RealtimeEditor.jsx'
    ],
    templates: [
      'TemplateGenerator.jsx', 'TemplateManager.jsx', 'TemplateAnalytics.jsx',
      'VersionControl.jsx', 'AdvancedTemplateManager.jsx'
    ],
    collab: [
      'CollaboratorCard.jsx', 'PermissionsManager.jsx', 'TeamWorkspace.jsx',
      'WorkflowAutomation.jsx', 'CollaborationAnalytics.jsx', 'InsightsDashboard.jsx'
    ],
    ai: [
      'PDFSummarizer.jsx', 'DocumentAssistant.jsx', 'DocumentReview.jsx'
    ],
    workflows: [
      'AIWorkflowEngine.jsx'
    ],
    conversion: [
      'QualitySettings.jsx'
    ],
    compliance: [
      'ComplianceWidget.jsx'
    ],
    api: [
      'EndpointCard.jsx'
    ]
  },
  config: [
    'Layout.jsx', 'pages.config.js'
  ]
};

export default function ProjectFiles({ theme = 'dark' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({ components: true });
  const isDark = theme === 'dark';

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const copyFileName = (name) => {
    navigator.clipboard.writeText(name);
    toast.success('Copied to clipboard');
  };

  const FileItem = ({ name, type = 'file', onClick }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
      }`}
      onClick={onClick}
    >
      {type === 'file' ? (
        name.endsWith('.json') ? (
          <FileJson className="w-4 h-4 text-amber-400" />
        ) : (
          <FileCode className="w-4 h-4 text-cyan-400" />
        )
      ) : (
        <Folder className="w-4 h-4 text-violet-400" />
      )}
      <span className={`text-sm flex-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        {name}
      </span>
      <Button
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          copyFileName(name);
        }}
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
      >
        <Copy className="w-3 h-3" />
      </Button>
    </motion.div>
  );

  const FolderSection = ({ title, files, isNested = false }) => {
    const isExpanded = expandedFolders[title];
    const filtered = Array.isArray(files) 
      ? files.filter(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      : null;

    return (
      <div className={isNested ? 'ml-4' : ''}>
        <button
          onClick={() => toggleFolder(title)}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
          }`}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-violet-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-violet-400" />
          )}
          <Folder className="w-4 h-4 text-violet-400" />
          <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </span>
          <Badge variant="outline" className="ml-auto text-xs">
            {Array.isArray(files) ? files.length : Object.values(files).flat().length}
          </Badge>
        </button>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1 space-y-1">
                {Array.isArray(files) ? (
                  filtered?.map((file, i) => (
                    <FileItem key={i} name={file} />
                  ))
                ) : (
                  Object.entries(files).map(([folder, items]) => (
                    <FolderSection key={folder} title={folder} files={items} isNested />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Project Files
        </h1>
        <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Browse and manage all files in your OmniPDF project
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
        />
      </div>

      {/* File Tree */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="space-y-2">
          <FolderSection title="entities" files={projectStructure.entities} />
          <FolderSection title="pages" files={projectStructure.pages} />
          <FolderSection title="components" files={projectStructure.components} />
          <FolderSection title="config" files={projectStructure.config} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { label: 'Total Files', value: Object.values(projectStructure).flat(2).length },
          { label: 'Components', value: Object.values(projectStructure.components).flat().length },
          { label: 'Pages', value: projectStructure.pages.length }
        ].map((stat, i) => (
          <div key={i} className={`rounded-xl p-4 text-center ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {stat.value}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}