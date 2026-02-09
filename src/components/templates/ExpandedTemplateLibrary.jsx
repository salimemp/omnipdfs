import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  FileText, Briefcase, GraduationCap, Heart, Home,
  TrendingUp, Users, Mail, Calendar, Award, Search,
  Star, Download, Eye, Copy, Edit, Share2, Lock, Unlock,
  Save, Trash2, MoreVertical, FileOutput
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import AdvancedSharingDialog from './AdvancedSharingDialog';

const categories = [
  { id: 'all', name: 'All Templates', icon: FileText },
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'personal', name: 'Personal', icon: Heart },
  { id: 'real-estate', name: 'Real Estate', icon: Home },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp },
  { id: 'hr', name: 'Human Resources', icon: Users },
  { id: 'legal', name: 'Legal', icon: Award },
];

const categoryIcons = {
  invoice: '🧾',
  contract: '📄',
  resume: '📝',
  letter: '✉️',
  report: '📊',
  form: '📋',
  certificate: '🏆'
};

export default function ExpandedTemplateLibrary({ isDark = true }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [modifyTemplate, setModifyTemplate] = useState(null);
  const [modifiedContent, setModifiedContent] = useState({});
  const [shareTemplate, setShareTemplate] = useState(null);

  const { data: templates = [], refetch } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const dbTemplates = await base44.entities.Template.filter({ is_public: true });
      return dbTemplates.length > 0 ? dbTemplates : [];
    }
  });

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const useTemplate = async (template) => {
    try {
      await base44.entities.Template.update(template.id, {
        usage_count: (template.usage_count || 0) + 1
      });
      await base44.entities.ActivityLog.create({
        action: 'download',
        document_name: template.name,
        details: { template_id: template.id, type: 'template_use' }
      });
      toast.success(`Template "${template.name}" ready to use`);
      refetch();
    } catch (error) {
      toast.error('Failed to use template');
    }
  };

  const downloadTemplate = (template) => {
    const content = generateTemplateContent(template);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const generateTemplateContent = (template) => {
    let content = `${template.name}\n${'='.repeat(template.name.length)}\n\n`;
    template.template_data?.sections?.forEach((section) => {
      content += `${section.title}\n${'-'.repeat(section.title.length)}\n${section.content}\n\n`;
    });
    return content;
  };

  const saveModifications = async () => {
    if (!modifyTemplate) return;

    const updatedSections = modifyTemplate.template_data?.sections?.map((section) => ({
      ...section,
      content: modifiedContent[section.title] || section.content
    }));

    try {
      await base44.entities.Template.create({
        name: `${modifyTemplate.name} (Modified)`,
        description: modifyTemplate.description,
        category: modifyTemplate.category,
        template_data: {
          ...modifyTemplate.template_data,
          sections: updatedSections
        },
        is_public: false
      });
      
      toast.success('Modified template saved to My Templates');
      setModifyTemplate(null);
      setModifiedContent({});
      refetch();
    } catch (e) {
      toast.error('Failed to save modifications');
    }
  };

  const toggleFavorite = async (template, e) => {
    e.stopPropagation();
    try {
      await base44.entities.Template.update(template.id, {
        is_favorite: !template.is_favorite
      });
      toast.success(template.is_favorite ? 'Removed from favorites' : 'Added to favorites');
      refetch();
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  const duplicateTemplate = async (template) => {
    try {
      await base44.entities.Template.create({
        ...template,
        id: undefined,
        name: `${template.name} (Copy)`,
        is_public: false,
        created_date: undefined
      });
      toast.success('Template duplicated');
      refetch();
    } catch (e) {
      toast.error('Failed to duplicate');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={selectedCategory === cat.id ? 'bg-violet-500' : ''}
            >
              <Icon className="w-4 h-4 mr-2" />
              {cat.name}
            </Button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {filteredTemplates.length} templates found
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`group hover:shadow-lg transition-all cursor-pointer ${
              isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/40' : 'bg-white border-slate-200 hover:border-violet-300'
            }`} onClick={() => setPreviewTemplate(template)}>
              {/* Preview Area */}
              <div className="aspect-[3/4] relative overflow-hidden bg-white">
                {/* Template Content Preview */}
                <div className="absolute inset-0 p-4 text-xs overflow-hidden">
                  <div className="text-2xl mb-2">{categoryIcons[template.category] || '📄'}</div>
                  {template.template_data?.sections?.slice(0, 3).map((section, i) => (
                    <div key={i} className="mb-2">
                      <div className="font-semibold text-violet-600 text-[10px]">{section.title}</div>
                      <div className="text-slate-600 text-[9px] line-clamp-2">{section.content}</div>
                    </div>
                  )) || (
                    <div className="text-slate-400 text-center mt-8">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-xs">No preview available</p>
                    </div>
                  )}
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}>
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setModifyTemplate(template); }}>
                      <Edit className="w-3 h-3 mr-1" />
                      Modify
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" className="bg-violet-500 hover:bg-violet-600" onClick={(e) => { e.stopPropagation(); downloadTemplate(template); }}>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setShareTemplate(template); }}>
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                  <div className="flex gap-1">
                    {template.is_protected && (
                      <Badge className="bg-red-500/90 text-xs">
                        <Lock className="w-3 h-3" />
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => toggleFavorite(template, e)}
                      className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                    >
                      <Star className={`w-4 h-4 ${template.is_favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center">
                          <MoreVertical className="w-4 h-4 text-slate-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateTemplate(template); }} className={isDark ? 'text-white' : ''}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); downloadTemplate(template); }} className={isDark ? 'text-white' : ''}>
                          <FileOutput className="w-4 h-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <CardContent className="p-4">
                <h3 className={`font-semibold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {template.name}
                </h3>
                <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {template.description || 'Professional template ready to use'}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <Badge variant="outline" className="text-xs">{template.category}</Badge>
                  <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {template.usage_count || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileText className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
          <p className={`text-lg font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No templates found
          </p>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className={`max-w-4xl max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-3xl">{categoryIcons[previewTemplate?.category] || '📄'}</span>
              {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {previewTemplate?.description}
            </p>
            <div className="space-y-4">
              {previewTemplate?.template_data?.sections?.map((section, i) => (
                <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {section.title}
                  </h4>
                  <p className={`whitespace-pre-wrap text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => { downloadTemplate(previewTemplate); setPreviewTemplate(null); }} className="bg-gradient-to-r from-emerald-500 to-teal-500">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => { setModifyTemplate(previewTemplate); setPreviewTemplate(null); }} className="bg-gradient-to-r from-violet-500 to-cyan-500">
                <Edit className="w-4 h-4 mr-2" />
                Modify
              </Button>
              <Button onClick={() => { setShareTemplate(previewTemplate); setPreviewTemplate(null); }} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modify Modal */}
      <Dialog open={!!modifyTemplate} onOpenChange={() => setModifyTemplate(null)}>
        <DialogContent className={`max-w-4xl max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Edit className="w-5 h-5 text-violet-400" />
              Modify Template: {modifyTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {modifyTemplate?.template_data?.sections?.map((section, i) => (
              <div key={i} className="space-y-2">
                <label className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  {section.title}
                  <Badge variant="outline" className="text-xs">Editable</Badge>
                </label>
                <Textarea
                  className={`min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                  defaultValue={section.content}
                  onChange={(e) => setModifiedContent(prev => ({
                    ...prev,
                    [section.title]: e.target.value
                  }))}
                />
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <Button onClick={saveModifications} className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500">
                <Save className="w-4 h-4 mr-2" />
                Save as My Template
              </Button>
              <Button variant="outline" onClick={() => setModifyTemplate(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sharing Dialog */}
      {shareTemplate && (
        <AdvancedSharingDialog
          template={shareTemplate}
          open={!!shareTemplate}
          onOpenChange={() => setShareTemplate(null)}
          isDark={isDark}
        />
      )}
    </div>
  );
}