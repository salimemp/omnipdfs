import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Search as SearchIcon, Filter, X, Calendar,
  FileText, Users, Tag, SlidersHorizontal,
  Clock, TrendingUp, Star, Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileCard from '@/components/shared/FileCard';

export default function SearchPage({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    fileType: 'all',
    dateRange: 'all',
    size: 'all',
    owner: 'all',
    favorite: false,
    shared: false,
    tags: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date', 500),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });

  // Advanced search logic
  const searchResults = documents.filter(doc => {
    // Text search
    const matchesQuery = !query || 
      doc.name?.toLowerCase().includes(query.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

    // File type filter
    const matchesFileType = filters.fileType === 'all' || doc.file_type === filters.fileType;

    // Date range filter
    const matchesDateRange = (() => {
      if (filters.dateRange === 'all') return true;
      const docDate = new Date(doc.created_date);
      const now = new Date();
      const daysDiff = Math.floor((now - docDate) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        case 'year': return daysDiff <= 365;
        default: return true;
      }
    })();

    // Size filter
    const matchesSize = (() => {
      if (filters.size === 'all') return true;
      const sizeMB = (doc.file_size || 0) / (1024 * 1024);
      switch (filters.size) {
        case 'small': return sizeMB < 1;
        case 'medium': return sizeMB >= 1 && sizeMB < 10;
        case 'large': return sizeMB >= 10;
        default: return true;
      }
    })();

    // Owner filter
    const matchesOwner = filters.owner === 'all' || doc.created_by === filters.owner;

    // Favorite filter
    const matchesFavorite = !filters.favorite || doc.is_favorite;

    // Shared filter
    const matchesShared = !filters.shared || doc.is_shared;

    return matchesQuery && matchesFileType && matchesDateRange && 
           matchesSize && matchesOwner && matchesFavorite && matchesShared;
  });

  // Sort results
  const sortedResults = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'date':
        return new Date(b.created_date) - new Date(a.created_date);
      case 'size':
        return (b.file_size || 0) - (a.file_size || 0);
      default: // relevance
        return 0;
    }
  });

  const activeFiltersCount = Object.values(filters).filter(v => 
    v !== 'all' && v !== false && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const clearFilters = () => {
    setFilters({
      fileType: 'all',
      dateRange: 'all',
      size: 'all',
      owner: 'all',
      favorite: false,
      shared: false,
      tags: []
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
          <SearchIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Advanced Search
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Search and filter across all your documents
          </p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, tags, or content..."
                className={`pl-10 h-12 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className={`h-12 ${isDark ? 'border-slate-700' : ''}`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-violet-500">{activeFiltersCount}</Badge>
              )}
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className={`w-40 h-12 ${isDark ? 'bg-slate-800 border-slate-700' : ''}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-slate-700"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    File Type
                  </label>
                  <Select value={filters.fileType} onValueChange={(v) => setFilters({...filters, fileType: v})}>
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="jpg">Images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Date Range
                  </label>
                  <Select value={filters.dateRange} onValueChange={(v) => setFilters({...filters, dateRange: v})}>
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    File Size
                  </label>
                  <Select value={filters.size} onValueChange={(v) => setFilters({...filters, size: v})}>
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Size</SelectItem>
                      <SelectItem value="small">Small (&lt;1MB)</SelectItem>
                      <SelectItem value="medium">Medium (1-10MB)</SelectItem>
                      <SelectItem value="large">Large (&gt;10MB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Owner
                  </label>
                  <Select value={filters.owner} onValueChange={(v) => setFilters({...filters, owner: v})}>
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.email}>
                          {user.full_name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant={filters.favorite ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({...filters, favorite: !filters.favorite})}
                  className={filters.favorite ? 'bg-violet-500' : ''}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Favorites Only
                </Button>
                <Button
                  variant={filters.shared ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters({...filters, shared: !filters.shared})}
                  className={filters.shared ? 'bg-violet-500' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Shared Only
                </Button>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {sortedResults.length} {sortedResults.length === 1 ? 'Result' : 'Results'}
          </h2>
          {query && (
            <Badge variant="secondary" className={isDark ? 'bg-violet-500/20 text-violet-300' : ''}>
              Searching for: "{query}"
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-40 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
            ))}
          </div>
        ) : sortedResults.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedResults.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FileCard file={doc} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
            <CardContent className="py-12 text-center">
              <SearchIcon className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
              <p className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                No results found
              </p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}