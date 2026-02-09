import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Store, TrendingUp, Star, Download, Eye, ShoppingCart,
  DollarSign, Award, Filter, Search, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const categoryIcons = {
  invoice: '🧾',
  contract: '📄',
  resume: '📝',
  letter: '✉️',
  report: '📊',
  form: '📋',
  certificate: '🏆'
};

export default function TemplateMarketplace({ isDark = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filterCategory, setFilterCategory] = useState('all');
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ['marketplace-templates'],
    queryFn: () => base44.entities.Template.filter({ is_public: true })
  });

  const purchaseTemplateMutation = useMutation({
    mutationFn: async (template) => {
      await base44.entities.Template.create({
        ...template,
        id: undefined,
        is_public: false,
        created_date: undefined
      });
      await base44.entities.Template.update(template.id, {
        usage_count: (template.usage_count || 0) + 1
      });
      await base44.entities.ActivityLog.create({
        action: 'download',
        document_name: template.name,
        details: { template_id: template.id, type: 'marketplace_purchase' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['marketplace-templates']);
      toast.success('Template added to your library');
    }
  });

  // Filter and sort templates
  let filteredTemplates = templates.filter(t => {
    const matchesSearch = !searchQuery || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === 'popular') {
    filteredTemplates = [...filteredTemplates].sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
  } else if (sortBy === 'newest') {
    filteredTemplates = [...filteredTemplates].sort((a, b) => 
      new Date(b.created_date) - new Date(a.created_date)
    );
  }

  const featuredTemplates = [...templates]
    .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
    .slice(0, 3);

  const categories = [...new Set(templates.map(t => t.category))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-8 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border ${
        isDark ? 'border-violet-500/30' : 'border-violet-300'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Template Marketplace
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover and use professional templates from our library
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-violet-400" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Templates</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {templates.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Downloads</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {templates.reduce((sum, t) => sum + (t.usage_count || 0), 0).toLocaleString()}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-white/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Categories</span>
            </div>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {categories.length}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className={isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}>
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search & Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : ''}`}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className={`w-48 ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`w-48 ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`group hover:shadow-xl transition-all ${
                  isDark ? 'bg-slate-900/50 border-slate-800 hover:border-violet-500/50' : 'bg-white border-slate-200 hover:border-violet-300'
                }`}>
                  <div className="aspect-[3/4] relative overflow-hidden bg-white rounded-t-xl">
                    <div className="absolute inset-0 p-4 text-xs overflow-hidden">
                      <div className="text-3xl mb-2">{categoryIcons[template.category] || '📄'}</div>
                      <div className="space-y-1">
                        {template.template_data?.sections?.slice(0, 2).map((s, i) => (
                          <div key={i}>
                            <div className="font-semibold text-violet-600 text-[10px]">{s.title}</div>
                            <div className="text-slate-600 text-[9px] line-clamp-1">{s.content}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-violet-500">
                        <Zap className="w-3 h-3 mr-1" />
                        Free
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className={`font-semibold mb-2 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {template.name}
                    </h3>
                    <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <Badge variant="outline">{template.category}</Badge>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Download className="w-3 h-3" />
                        {template.usage_count || 0}
                      </div>
                    </div>
                    <Button
                      onClick={() => purchaseTemplateMutation.mutate(template)}
                      className="w-full bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                      size="sm"
                    >
                      <ShoppingCart className="w-3 h-3 mr-2" />
                      Add to Library
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid md:grid-cols-3 gap-6">
            {featuredTemplates.map((template) => (
              <Card key={template.id} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{categoryIcons[template.category] || '📄'}</div>
                    <Badge className="bg-amber-500">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Featured
                    </Badge>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {template.name}
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Download className="w-4 h-4" />
                        {template.usage_count || 0}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => purchaseTemplateMutation.mutate(template)}
                    className="w-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Library
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div className="space-y-4">
            {filteredTemplates.slice(0, 10).map((template, index) => (
              <Card key={template.id} className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {template.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {template.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {template.usage_count || 0}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>downloads</p>
                      </div>
                      <Button
                        onClick={() => purchaseTemplateMutation.mutate(template)}
                        size="sm"
                        className="bg-violet-500"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}