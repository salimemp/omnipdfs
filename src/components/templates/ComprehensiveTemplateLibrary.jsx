import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Eye, Star, Copy, ExternalLink, 
  Sparkles, TrendingUp, Clock, Users, CheckCircle2 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const templateData = [
  // Business Templates
  {
    id: 1,
    name: 'Business Proposal',
    description: 'Professional business proposal with executive summary, project scope, and pricing',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    downloads: 15234,
    rating: 4.9,
    tags: ['proposal', 'business', 'professional'],
    featured: true,
    isPremium: false,
  },
  {
    id: 2,
    name: 'Invoice Template',
    description: 'Clean and professional invoice with automatic calculations',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    downloads: 28451,
    rating: 4.8,
    tags: ['invoice', 'billing', 'finance'],
    featured: true,
    isPremium: false,
  },
  {
    id: 3,
    name: 'Business Report',
    description: 'Comprehensive business report template with charts and analysis sections',
    category: 'business',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    downloads: 12890,
    rating: 4.7,
    tags: ['report', 'analytics', 'business'],
    featured: false,
    isPremium: false,
  },
  // Legal Templates
  {
    id: 4,
    name: 'Non-Disclosure Agreement',
    description: 'Standard NDA template for business partnerships and confidential information',
    category: 'legal',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
    downloads: 19873,
    rating: 4.9,
    tags: ['nda', 'legal', 'contract'],
    featured: true,
    isPremium: false,
  },
  {
    id: 5,
    name: 'Employment Contract',
    description: 'Comprehensive employment agreement with salary, benefits, and terms',
    category: 'legal',
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400',
    downloads: 16234,
    rating: 4.8,
    tags: ['employment', 'contract', 'hr'],
    featured: false,
    isPremium: true,
  },
  {
    id: 6,
    name: 'Service Agreement',
    description: 'Professional service agreement for contractors and freelancers',
    category: 'legal',
    thumbnail: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400',
    downloads: 14567,
    rating: 4.7,
    tags: ['service', 'contract', 'freelance'],
    featured: false,
    isPremium: false,
  },
  // Education Templates
  {
    id: 7,
    name: 'Certificate of Achievement',
    description: 'Professional certificate template for courses, training, and awards',
    category: 'education',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    downloads: 32156,
    rating: 4.9,
    tags: ['certificate', 'education', 'award'],
    featured: true,
    isPremium: false,
  },
  {
    id: 8,
    name: 'Course Syllabus',
    description: 'Detailed course syllabus with schedule, objectives, and grading criteria',
    category: 'education',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    downloads: 8934,
    rating: 4.6,
    tags: ['syllabus', 'course', 'education'],
    featured: false,
    isPremium: false,
  },
  {
    id: 9,
    name: 'Student Transcript',
    description: 'Official academic transcript template with grades and credits',
    category: 'education',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
    downloads: 11245,
    rating: 4.8,
    tags: ['transcript', 'academic', 'grades'],
    featured: false,
    isPremium: true,
  },
  // Personal Templates
  {
    id: 10,
    name: 'Resume - Modern',
    description: 'Clean and modern resume template with ATS-friendly design',
    category: 'personal',
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
    downloads: 45678,
    rating: 4.9,
    tags: ['resume', 'cv', 'job'],
    featured: true,
    isPremium: false,
  },
  {
    id: 11,
    name: 'Cover Letter',
    description: 'Professional cover letter template to accompany your resume',
    category: 'personal',
    thumbnail: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400',
    downloads: 23456,
    rating: 4.7,
    tags: ['cover-letter', 'job', 'application'],
    featured: false,
    isPremium: false,
  },
  {
    id: 12,
    name: 'Personal Budget',
    description: 'Monthly budget planner with expense tracking and savings goals',
    category: 'personal',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    downloads: 18923,
    rating: 4.8,
    tags: ['budget', 'finance', 'planning'],
    featured: false,
    isPremium: false,
  },
];

export default function ComprehensiveTemplateLibrary({ isDark = true, categoryFilter = 'all' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const filteredTemplates = templateData.filter(template => {
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleDownload = async (template) => {
    toast.success(`Downloading ${template.name}...`);
  };

  const handleUseTemplate = async (template) => {
    toast.success(`Opening ${template.name} in editor...`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FileText, label: 'Total Templates', value: '500+', color: 'violet' },
          { icon: Download, label: 'Downloads', value: '2.5M+', color: 'cyan' },
          { icon: Users, label: 'Active Users', value: '150K+', color: 'emerald' },
          { icon: Star, label: 'Avg Rating', value: '4.8', color: 'amber' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white border border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Featured Templates */}
      {categoryFilter === 'all' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Featured Templates
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.filter(t => t.featured).slice(0, 3).map((template, i) => (
              <TemplateCard 
                key={template.id}
                template={template}
                delay={i * 0.1}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onUse={handleUseTemplate}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Templates Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {categoryFilter === 'all' ? 'All Templates' : `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Templates`}
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            {filteredTemplates.length} templates found
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredTemplates.map((template, i) => (
              <TemplateCard 
                key={template.id}
                template={template}
                delay={i * 0.05}
                onPreview={handlePreview}
                onDownload={handleDownload}
                onUse={handleUseTemplate}
                isDark={isDark}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className={`max-w-4xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              {selectedTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <img 
                src={selectedTemplate.thumbnail} 
                alt={selectedTemplate.name}
                className="w-full h-96 object-cover rounded-xl"
              />
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                {selectedTemplate.description}
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleUseTemplate(selectedTemplate)}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500"
                >
                  Use Template
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleDownload(selectedTemplate)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateCard({ template, delay, onPreview, onDownload, onUse, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay }}
    >
      <Card className={`group overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
        isDark ? 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50' : 'bg-white hover:border-violet-500/50'
      }`}>
        <div className="relative">
          <img 
            src={template.thumbnail} 
            alt={template.name}
            className="w-full h-48 object-cover"
          />
          {template.isPremium && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => onPreview(template)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={() => onUse(template)}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {template.name}
          </h3>
          <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {template.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {(template.downloads / 1000).toFixed(1)}k
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {template.rating}
              </span>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onDownload(template)}
              className="text-violet-400"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}