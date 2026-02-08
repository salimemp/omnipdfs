import React, { useState } from 'react';
import { FileText, Download, Eye, Star, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.filter({ is_public: true }),
  });

  const filtered = templates.filter(t => 
    (category === 'all' || t.category === category) &&
    (t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const useTemplate = async (template) => {
    toast.promise(
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await base44.entities.ActivityLog.create({
          action: 'convert',
          details: { type: 'template_used', template_name: template.name }
        });
      },
      {
        loading: 'Loading template...',
        success: `${template.name} ready to use!`,
        error: 'Failed to load template'
      }
    );
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
              <div className="aspect-[8.5/11] rounded-lg mb-3 flex items-center justify-center text-6xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                {categoryIcons[template.category] || '📄'}
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
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button size="sm" onClick={() => useTemplate(template)} className="flex-1 bg-violet-500">
                  <Download className="w-4 h-4 mr-2" />
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}