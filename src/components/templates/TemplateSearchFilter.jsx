import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, SlidersHorizontal, Download, Eye, Calendar, User
} from 'lucide-react';
import moment from 'moment';

export default function TemplateSearchFilter({ onResults, isDark = true }) {
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    dateRange: 'all',
    sortBy: 'recent',
    isPublic: 'all',
    minUsage: 0
  });

  const { data: allTemplates = [] } = useQuery({
    queryKey: ['all-templates-search'],
    queryFn: () => base44.entities.Template.list()
  });

  const applyFilters = () => {
    let results = [...allTemplates];

    // Search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(t =>
        t.name?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'all') {
      results = results.filter(t => t.category === filters.category);
    }

    // Date range
    if (filters.dateRange !== 'all') {
      const now = moment();
      const ranges = {
        today: 1,
        week: 7,
        month: 30,
        year: 365
      };
      results = results.filter(t =>
        moment(t.created_date).isAfter(now.subtract(ranges[filters.dateRange], 'days'))
      );
    }

    // Privacy
    if (filters.isPublic !== 'all') {
      results = results.filter(t => t.is_public === (filters.isPublic === 'public'));
    }

    // Min usage
    if (filters.minUsage > 0) {
      results = results.filter(t => (t.usage_count || 0) >= filters.minUsage);
    }

    // Sort
    switch (filters.sortBy) {
      case 'recent':
        results.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case 'popular':
        results.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    onResults?.(results);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters, allTemplates]);

  const categories = [...new Set(allTemplates.map(t => t.category))].filter(Boolean);

  return (
    <Card className={isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className={`w-5 h-5 ${isDark ? 'text-violet-400' : 'text-violet-600'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Search & Filter
          </h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`} />
          <Input
            placeholder="Search templates..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
          />
        </div>

        {/* Filters Grid */}
        <div className="grid md:grid-cols-2 gap-3">
          <Select
            value={filters.category}
            onValueChange={(v) => setFilters(prev => ({ ...prev, category: v }))}
          >
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.dateRange}
            onValueChange={(v) => setFilters(prev => ({ ...prev, dateRange: v }))}
          >
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sortBy}
            onValueChange={(v) => setFilters(prev => ({ ...prev, sortBy: v }))}
          >
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.isPublic}
            onValueChange={(v) => setFilters(prev => ({ ...prev, isPublic: v }))}
          >
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectValue placeholder="Privacy" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="public">Public Only</SelectItem>
              <SelectItem value="private">Private Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Usage Slider */}
        <div>
          <label className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Min Usage: {filters.minUsage}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.minUsage}
            onChange={(e) => setFilters(prev => ({ ...prev, minUsage: parseInt(e.target.value) }))}
            className="w-full mt-2"
          />
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.query && (
            <Badge variant="secondary">
              Search: {filters.query}
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary">
              {filters.category}
            </Badge>
          )}
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary">
              <Calendar className="w-3 h-3 mr-1" />
              {filters.dateRange}
            </Badge>
          )}
          {filters.isPublic !== 'all' && (
            <Badge variant="secondary">
              {filters.isPublic}
            </Badge>
          )}
          {filters.minUsage > 0 && (
            <Badge variant="secondary">
              <Download className="w-3 h-3 mr-1" />
              {filters.minUsage}+ uses
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}