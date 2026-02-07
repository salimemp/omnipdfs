import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  FileText, Briefcase, GraduationCap, Heart, Home,
  TrendingUp, Users, Mail, Calendar, Award, Search,
  Star, Download, Eye, Copy
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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

const sampleTemplates = [
  { id: 1, name: 'Invoice Template', category: 'business', rating: 4.8, downloads: 12500, premium: false },
  { id: 2, name: 'Resume - Modern', category: 'business', rating: 4.9, downloads: 25000, premium: true },
  { id: 3, name: 'Business Proposal', category: 'business', rating: 4.7, downloads: 8900, premium: false },
  { id: 4, name: 'Contract Agreement', category: 'legal', rating: 4.9, downloads: 15000, premium: true },
  { id: 5, name: 'Assignment Sheet', category: 'education', rating: 4.6, downloads: 18000, premium: false },
  { id: 6, name: 'Lesson Plan', category: 'education', rating: 4.7, downloads: 9500, premium: false },
  { id: 7, name: 'Wedding Invitation', category: 'personal', rating: 4.8, downloads: 22000, premium: true },
  { id: 8, name: 'Rental Agreement', category: 'real-estate', rating: 4.9, downloads: 11000, premium: false },
  { id: 9, name: 'Marketing Brief', category: 'marketing', rating: 4.7, downloads: 7800, premium: true },
  { id: 10, name: 'Employee Handbook', category: 'hr', rating: 4.8, downloads: 6500, premium: false },
  { id: 11, name: 'Offer Letter', category: 'hr', rating: 4.9, downloads: 13000, premium: true },
  { id: 12, name: 'NDA Template', category: 'legal', rating: 4.8, downloads: 16500, premium: false },
];

export default function ExpandedTemplateLibrary({ isDark = true }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list(),
    initialData: sampleTemplates,
  });

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const useTemplate = async (template) => {
    try {
      const doc = await base44.entities.Document.create({
        name: `${template.name} - Copy.pdf`,
        file_type: 'pdf',
        file_url: 'https://placeholder.pdf',
        status: 'ready'
      });
      toast.success(`Template "${template.name}" created`);
    } catch (error) {
      toast.error('Failed to create template');
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
            <Card className={`group hover:shadow-lg transition-all ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="aspect-[3/4] bg-gradient-to-br from-violet-500/20 to-cyan-500/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-violet-400 opacity-50" />
                </div>
                {template.premium && (
                  <Badge className="absolute top-2 right-2 bg-amber-500">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => useTemplate(template)}>
                    <Copy className="w-4 h-4 mr-1" />
                    Use
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {template.name}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {template.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4 text-slate-400" />
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {(template.downloads / 1000).toFixed(1)}k
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}