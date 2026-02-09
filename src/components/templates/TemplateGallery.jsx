import React, { useState } from 'react';
import { FileText, Download, Eye, Star, Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const categoryIcons = {
  contract: '📄',
  invoice: '🧾',
  resume: '📝',
  letter: '✉️',
  report: '📊',
  form: '📋',
  certificate: '🏆',
  custom: '📑'
};

export default function TemplateGallery({ isDark }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.filter({ is_public: true }),
  });

  const filtered = templates.filter(t => 
    (category === 'all' || t.category === category) &&
    (t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [modifyTemplate, setModifyTemplate] = useState(null);
  const [modifiedContent, setModifiedContent] = useState({});

  const useTemplate = async (template) => {
    toast.promise(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await base44.entities.ActivityLog.create({
          action: 'convert',
          details: { type: 'template_used', template_name: template.name }
        });
        await base44.entities.Template.update(template.id, {
          usage_count: (template.usage_count || 0) + 1
        });
      },
      {
        loading: 'Loading template...',
        success: `${template.name} ready to use!`,
        error: 'Failed to load template'
      }
    );
  };

  const downloadTemplate = async (template) => {
    const content = generatePDFContent(template);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const generatePDFContent = (template) => {
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
      
      toast.success('Modified template saved');
      setModifyTemplate(null);
      setModifiedContent({});
    } catch (e) {
      toast.error('Failed to save modifications');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}
          />
        </div>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="contract">Contract</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="text-center py-12">
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Loading templates...</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(template => (
          <Card key={template.id} className={`group ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/30' : 'bg-white border-slate-200 hover:border-violet-300'} transition-all`}>
            <CardContent className="pt-6">
              <div className="aspect-[8.5/11] rounded-lg mb-3 flex flex-col items-start justify-start p-4 text-xs bg-gradient-to-br from-violet-500/10 to-cyan-500/10 overflow-hidden">
                <div className="text-4xl mb-2">{categoryIcons[template.category] || '📄'}</div>
                {template.template_data?.sections?.slice(0, 3).map((section, i) => (
                  <div key={i} className={`${isDark ? 'text-slate-400' : 'text-slate-600'} truncate w-full`}>
                    <span className="font-semibold">{section.title}:</span> {section.content?.substring(0, 30)}...
                  </div>
                ))}
              </div>
              <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {template.name}
              </h3>
              <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'} line-clamp-2`}>
                {template.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">{template.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    4.8
                  </span>
                </div>
              </div>
              <p className={`text-xs mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {template.usage_count?.toLocaleString() || 0} downloads
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline" onClick={() => setPreviewTemplate(template)}>
                  <Eye className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => {
                  setModifyTemplate(template);
                  setModifiedContent({});
                }}>
                  <FileText className="w-3 h-3" />
                </Button>
                <Button size="sm" onClick={() => downloadTemplate(template)} className="bg-violet-500">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
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
                  <p className={`whitespace-pre-wrap ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => downloadTemplate(previewTemplate)}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={() => {
                  setModifyTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                Modify
              </Button>
              <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modify Modal */}
      <Dialog open={!!modifyTemplate} onOpenChange={() => setModifyTemplate(null)}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <FileText className="w-5 h-5 text-violet-400" />
              Modify Template: {modifyTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {modifyTemplate?.template_data?.sections?.map((section, i) => (
              <div key={i} className="space-y-2">
                <label className={`font-semibold text-sm ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                  {section.title}
                </label>
                <textarea
                  className={`w-full min-h-[100px] p-3 rounded-lg ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                  } border`}
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
                Save as New Template
              </Button>
              <Button variant="outline" onClick={() => setModifyTemplate(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}