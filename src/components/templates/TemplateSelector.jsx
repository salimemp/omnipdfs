import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Briefcase,
  FileSignature,
  Mail,
  Receipt,
  Award,
  ClipboardList,
  Plus,
  Search,
  Star,
  Download,
  Eye
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const categoryIcons = {
  invoice: Receipt,
  contract: FileSignature,
  letter: Mail,
  report: FileText,
  resume: Award,
  certificate: Award,
  form: ClipboardList,
  custom: Plus,
};

export default function TemplateSelector({ 
  onSelectTemplate, 
  isDark = true 
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list('-created_date'),
  });

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'invoice', label: 'Invoices' },
    { id: 'contract', label: 'Contracts' },
    { id: 'letter', label: 'Letters' },
    { id: 'report', label: 'Reports' },
    { id: 'resume', label: 'Resumes' },
    { id: 'certificate', label: 'Certificates' },
    { id: 'form', label: 'Forms' },
    { id: 'custom', label: 'Custom' },
  ];

  const handleUseTemplate = (template) => {
    onSelectTemplate?.(template);
    toast.success('Template loaded');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className={`pl-9 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className={`w-[150px] ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id} className={isDark ? 'text-white' : ''}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <FileText className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            No templates found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category] || FileText;
            
            return (
              <div
                key={template.id}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-violet-500/50 group ${
                  isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                }`}
                onClick={() => handleUseTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-violet-500/20' : 'bg-violet-100'
                  } group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  {template.is_public && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Public
                    </Badge>
                  )}
                </div>
                
                <h4 className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {template.name}
                </h4>
                
                {template.description && (
                  <p className={`text-xs mb-2 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {template.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Eye className="w-3 h-3" />
                    {template.usage_count || 0}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}