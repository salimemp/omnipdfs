import React from 'react';
import { motion } from 'framer-motion';
import { LayoutTemplate, Sparkles } from 'lucide-react';
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
}, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Filter,
  LayoutTemplate,
  FileSignature,
  Receipt,
  FileCheck,
  Briefcase,
  GraduationCap,
  Award,
  ClipboardList,
  Star,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  Users,
  Lock,
  Globe
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import TemplateGenerator from '@/components/templates/TemplateGenerator';
import TemplateManager from '@/components/templates/TemplateManager';
import TemplateAnalytics from '@/components/templates/TemplateAnalytics';
import VersionControl from '@/components/templates/VersionControl';
import AdvancedTemplateManager from '@/components/templates/AdvancedTemplateManager';

const categories = [
  { id: 'all', label: 'All Templates', icon: LayoutTemplate },
  { id: 'invoice', label: 'Invoices', icon: Receipt },
  { id: 'contract', label: 'Contracts', icon: FileSignature },
  { id: 'letter', label: 'Letters', icon: FileText },
  { id: 'report', label: 'Reports', icon: FileCheck },
  { id: 'resume', label: 'Resumes', icon: Briefcase },
  { id: 'certificate', label: 'Certificates', icon: Award },
  { id: 'form', label: 'Forms', icon: ClipboardList },
];

const defaultTemplates = [
  { id: 1, name: 'Professional Invoice', category: 'invoice', description: 'Clean and modern invoice template', usage_count: 1250, is_public: true },
  { id: 2, name: 'Service Agreement', category: 'contract', description: 'Standard service contract template', usage_count: 890, is_public: true },
  { id: 3, name: 'Business Letter', category: 'letter', description: 'Formal business correspondence', usage_count: 650, is_public: true },
  { id: 4, name: 'Annual Report', category: 'report', description: 'Corporate annual report layout', usage_count: 420, is_public: true },
  { id: 5, name: 'Modern Resume', category: 'resume', description: 'Contemporary CV design', usage_count: 2100, is_public: true },
  { id: 6, name: 'Achievement Certificate', category: 'certificate', description: 'Award and recognition certificate', usage_count: 780, is_public: true },
  { id: 7, name: 'Application Form', category: 'form', description: 'Multi-purpose application form', usage_count: 560, is_public: true },
  { id: 8, name: 'NDA Agreement', category: 'contract', description: 'Non-disclosure agreement template', usage_count: 1100, is_public: true },
  { id: 9, name: 'Employee Onboarding Form', category: 'form', description: 'New hire registration and information form', usage_count: 920, is_public: true },
  { id: 10, name: 'Expense Report Form', category: 'form', description: 'Business expense claim template', usage_count: 1450, is_public: true },
  { id: 11, name: 'Customer Feedback Form', category: 'form', description: 'Survey and feedback collection form', usage_count: 830, is_public: true },
  { id: 12, name: 'Leave Request Form', category: 'form', description: 'Employee vacation/leave application', usage_count: 1200, is_public: true },
  { id: 13, name: 'Purchase Order Form', category: 'form', description: 'Vendor purchase order template', usage_count: 980, is_public: true },
  { id: 14, name: 'Medical History Form', category: 'form', description: 'Patient health information form', usage_count: 670, is_public: true },
  { id: 15, name: 'Event Registration Form', category: 'form', description: 'Conference/event signup form', usage_count: 1100, is_public: true },
  { id: 16, name: 'Job Application Form', category: 'form', description: 'Employment application template', usage_count: 1890, is_public: true },
  { id: 17, name: 'Freelance Contract', category: 'contract', description: 'Independent contractor agreement', usage_count: 1340, is_public: true },
  { id: 18, name: 'Sales Proposal', category: 'report', description: 'Client sales pitch document', usage_count: 760, is_public: true },
  { id: 19, name: 'Meeting Minutes', category: 'report', description: 'Meeting notes and action items', usage_count: 540, is_public: true },
  { id: 20, name: 'Project Proposal', category: 'report', description: 'Project planning document', usage_count: 890, is_public: true },
];

export default function Templates({ theme = 'dark' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showManager, setShowManager] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showVersions, setShowVersions] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'custom',
    is_public: false,
  });

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  const { data: userTemplates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Template.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      setShowCreateDialog(false);
      setNewTemplate({ name: '', description: '', category: 'custom', is_public: false });
      toast.success('Template created successfully');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Template.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template deleted');
    },
  });

  const allTemplates = [...defaultTemplates, ...userTemplates.map(t => ({ ...t, isUser: true }))];
  
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    return categories.find(c => c.id === category)?.icon || FileText;
  };

  const useTemplate = async (template) => {
    if (template.id && !template.isUser) {
      toast.success(`Loading template: ${template.name}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Document Templates
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Professional templates for every document type
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAnalytics(true)}
            variant="outline"
            className={isDark ? 'border-slate-700' : ''}
          >
            Analytics
          </Button>
          <Button
            onClick={() => setShowManager(true)}
            variant="outline"
            className={isDark ? 'border-slate-700' : ''}
          >
            Manage
          </Button>
          <Button
            onClick={() => setShowAIGenerator(true)}
            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            AI Generate
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            variant="outline"
            className={isDark ? 'border-slate-700' : ''}
          >
            <Plus className="w-5 h-5 mr-2" />
            Manual
          </Button>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 mb-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-violet-500 text-white'
                    : isDark
                      ? 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredTemplates.map((template, index) => {
            const CategoryIcon = getCategoryIcon(template.category);
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-2xl overflow-hidden ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'} hover:shadow-lg transition-all`}
              >
                {/* Preview Thumbnail */}
                <div className={`h-40 relative ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-24 h-32 rounded-lg shadow-lg ${isDark ? 'bg-slate-700' : 'bg-white'} flex items-center justify-center`}>
                      <CategoryIcon className={`w-10 h-10 ${isDark ? 'text-slate-500' : 'text-slate-300'}`} />
                    </div>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowPreviewDialog(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Link to={createPageUrl('PDFEditor')}>
                      <Button size="sm" className="bg-violet-500 hover:bg-violet-600">
                        <Edit className="w-4 h-4 mr-1" />
                        Use
                      </Button>
                    </Link>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {template.is_public && (
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    )}
                    {template.isUser && (
                      <Badge className="bg-violet-500/20 text-violet-400">
                        <Lock className="w-3 h-3 mr-1" />
                        My Template
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {template.name}
                    </h3>
                    {template.isUser && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => deleteMutation.mutate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={isDark ? 'border-slate-700 text-slate-300' : 'text-slate-700'}>
                      {categories.find(c => c.id === template.category)?.label || 'Custom'}
                    </Badge>
                    {template.usage_count > 0 && (
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <Users className="w-3 h-3 inline mr-1" />
                        {template.usage_count.toLocaleString()} uses
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-16 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200'}`}
        >
          <LayoutTemplate className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No templates found
          </h3>
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            Try adjusting your search or create a new template
          </p>
        </motion.div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Create New Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Template Name</Label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., My Invoice Template"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Description</Label>
              <Textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Describe your template..."
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Category</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(v) => setNewTemplate({ ...newTemplate, category: v })}
              >
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                  {categories.filter(c => c.id !== 'all').map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className={isDark ? 'text-white' : ''}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate(newTemplate)}
              disabled={!newTemplate.name}
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Analytics */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Template Analytics</h2>
            <Button variant="outline" onClick={() => setShowAnalytics(false)} className={isDark ? 'border-slate-700' : ''}>
              Close
            </Button>
          </div>
          <TemplateAnalytics templates={allTemplates} isDark={isDark} />
        </motion.div>
      )}

      {/* Template Manager */}
      {showManager && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Template Manager</h2>
            <Button variant="outline" onClick={() => setShowManager(false)} className={isDark ? 'border-slate-700' : ''}>
              Close
            </Button>
          </div>
          <TemplateManager
            onSelectTemplate={(template) => {
              setSelectedTemplate(template);
              setShowManager(false);
            }}
            isDark={isDark}
          />
        </motion.div>
      )}

      {/* AI Generator */}
      <TemplateGenerator
        open={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onTemplateCreated={() => {
          queryClient.invalidateQueries(['templates']);
          setShowAIGenerator(false);
        }}
        isDark={isDark}
      />

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <div className={`h-96 rounded-xl flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div className={`w-48 h-64 rounded-lg shadow-2xl ${isDark ? 'bg-slate-700' : 'bg-white'} flex items-center justify-center`}>
              <FileText className={`w-16 h-16 ${isDark ? 'text-slate-500' : 'text-slate-300'}`} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Close
            </Button>
            <Link to={createPageUrl('PDFEditor')}>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-500">
                <Edit className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}