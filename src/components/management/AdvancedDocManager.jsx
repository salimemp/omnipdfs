import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Search, Filter, SortAsc, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function AdvancedDocManager({ isDark = true }) {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, sortBy, filterType, documents]);

  const loadDocuments = async () => {
    try {
      const docs = await base44.entities.Document.list();
      setDocuments(docs);
      setFilteredDocs(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.file_type === filterType);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.created_date) - new Date(a.created_date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return (b.file_size || 0) - (a.file_size || 0);
        default:
          return 0;
      }
    });

    setFilteredDocs(filtered);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="docx">Word</SelectItem>
            <SelectItem value="xlsx">Excel</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="size">Size</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <FolderOpen className="w-8 h-8 text-violet-400" />
                    <Badge>{doc.file_type}</Badge>
                  </div>
                  <h3 className={`font-medium mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {doc.name}
                  </h3>
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <p>{formatSize(doc.file_size)}</p>
                    <p>{new Date(doc.created_date).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocs.map(doc => (
            <Card key={doc.id} className={`cursor-pointer hover:shadow-md transition-shadow ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FolderOpen className="w-6 h-6 text-violet-400" />
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {doc.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatSize(doc.file_size)} • {new Date(doc.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge>{doc.file_type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
            No documents found
          </p>
        </div>
      )}
    </div>
  );
}