import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download, Edit, Share2, Copy, Eye, Maximize2, ZoomIn, ZoomOut,
  FileText, Clock, User, Star
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function EnhancedTemplatePreview({ template, open, onOpenChange, onUse, onEdit, onShare, isDark = true }) {
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState('preview');

  if (!template) return null;

  const categoryIcons = {
    invoice: '🧾',
    contract: '📄',
    resume: '📝',
    letter: '✉️',
    report: '📊',
    form: '📋',
    certificate: '🏆'
  };

  const downloadTemplate = () => {
    const content = template.template_data?.sections?.map(s => 
      `${s.title}\n${'-'.repeat(s.title.length)}\n${s.content}\n`
    ).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const copyToClipboard = () => {
    const content = template.template_data?.sections?.map(s => 
      `${s.title}\n${s.content}`
    ).join('\n\n');
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-6xl max-h-[90vh] ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className={`flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className="text-4xl">{categoryIcons[template.category] || '📄'}</span>
              <div>
                <p className="text-xl">{template.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{template.category}</Badge>
                  {template.is_public && <Badge className="bg-emerald-500">Public</Badge>}
                </div>
              </div>
            </DialogTitle>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => setZoom(Math.min(150, zoom + 10))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={isDark ? 'bg-slate-800' : 'bg-slate-100'}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className={`border rounded-lg overflow-y-auto max-h-[50vh] ${isDark ? 'bg-white border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="p-8" style={{ zoom: `${zoom}%` }}>
                {template.template_data?.sections?.map((section, i) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-lg font-bold text-violet-600 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={downloadTemplate} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => { onEdit?.(template); onOpenChange(false); }} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={() => { onUse?.(template); onOpenChange(false); }} className="bg-gradient-to-r from-violet-500 to-cyan-500">
                <Eye className="w-4 h-4 mr-2" />
                Use
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Template Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Description</p>
                  <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.description || 'No description'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Category</p>
                  <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.category}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Created</p>
                  <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {moment(template.created_date).format('MMM D, YYYY')}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Usage Count</p>
                  <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.usage_count || 0} downloads
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sections</p>
                  <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.template_data?.sections?.length || 0}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Created By</p>
                  <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.created_by?.split('@')[0] || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {template.template_data?.tags && template.template_data.tags.length > 0 && (
              <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {template.template_data.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Download className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {template.usage_count || 0}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Total Downloads
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {template.is_favorite ? 'Yes' : 'No'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Favorite
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {moment(template.updated_date).fromNow()}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Last Updated
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}