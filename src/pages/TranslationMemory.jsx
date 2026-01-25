import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Languages,
  Plus,
  Search,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  Book,
  Globe,
  CheckCircle2,
  X,
  Copy,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

const sampleEntries = [
  { id: 1, source: 'Welcome to our service', sourceLanguage: 'en', target: 'Bienvenido a nuestro servicio', targetLanguage: 'es', category: 'greeting', usageCount: 45 },
  { id: 2, source: 'Terms and Conditions', sourceLanguage: 'en', target: 'Términos y Condiciones', targetLanguage: 'es', category: 'legal', usageCount: 120 },
  { id: 3, source: 'Privacy Policy', sourceLanguage: 'en', target: 'Politique de confidentialité', targetLanguage: 'fr', category: 'legal', usageCount: 89 },
  { id: 4, source: 'Contact Us', sourceLanguage: 'en', target: 'Kontaktieren Sie uns', targetLanguage: 'de', category: 'navigation', usageCount: 67 },
  { id: 5, source: 'Submit', sourceLanguage: 'en', target: '提交', targetLanguage: 'zh', category: 'button', usageCount: 230 },
];

export default function TranslationMemory({ theme = 'dark' }) {
  const [entries, setEntries] = useState(sampleEntries);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    source: '',
    sourceLanguage: 'en',
    target: '',
    targetLanguage: 'es',
    category: 'general'
  });

  const isDark = theme === 'dark';

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || 
                           entry.sourceLanguage === filterLanguage || 
                           entry.targetLanguage === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleAddEntry = () => {
    if (!newEntry.source || !newEntry.target) {
      toast.error('Please fill in both source and target text');
      return;
    }

    const entry = {
      id: Date.now(),
      ...newEntry,
      usageCount: 0
    };
    setEntries([entry, ...entries]);
    setNewEntry({ source: '', sourceLanguage: 'en', target: '', targetLanguage: 'es', category: 'general' });
    setShowAddDialog(false);
    toast.success('Translation entry added');
  };

  const handleDeleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
    toast.success('Entry deleted');
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry(entry);
    setShowAddDialog(true);
  };

  const handleUpdateEntry = () => {
    setEntries(entries.map(e => e.id === editingEntry.id ? { ...newEntry, id: e.id, usageCount: e.usageCount } : e));
    setEditingEntry(null);
    setNewEntry({ source: '', sourceLanguage: 'en', target: '', targetLanguage: 'es', category: 'general' });
    setShowAddDialog(false);
    toast.success('Entry updated');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getLanguageInfo = (code) => languages.find(l => l.code === code) || { name: code, flag: '🌐' };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Translation Memory
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Store and reuse translations for consistency
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className={isDark ? 'border-slate-700' : ''}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className={isDark ? 'border-slate-700' : ''}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingEntry(null);
              setNewEntry({ source: '', sourceLanguage: 'en', target: '', targetLanguage: 'es', category: 'general' });
              setShowAddDialog(true);
            }}
            className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Entries', value: entries.length, color: 'text-violet-400' },
          { label: 'Languages', value: [...new Set([...entries.map(e => e.sourceLanguage), ...entries.map(e => e.targetLanguage)])].length, color: 'text-cyan-400' },
          { label: 'Total Usage', value: entries.reduce((acc, e) => acc + e.usageCount, 0), color: 'text-emerald-400' },
          { label: 'Categories', value: [...new Set(entries.map(e => e.category))].length, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-4 rounded-2xl ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 mb-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <Input
              placeholder="Search translations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
            />
          </div>
          <Select value={filterLanguage} onValueChange={setFilterLanguage}>
            <SelectTrigger className={`w-48 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
              <SelectItem value="all" className={isDark ? 'text-white' : ''}>All Languages</SelectItem>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code} className={isDark ? 'text-white' : ''}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl overflow-hidden ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
      >
        <Table>
          <TableHeader>
            <TableRow className={isDark ? 'border-slate-700 hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
              <TableHead className={isDark ? 'text-slate-400' : ''}>Source</TableHead>
              <TableHead className={isDark ? 'text-slate-400' : ''}>Target</TableHead>
              <TableHead className={isDark ? 'text-slate-400' : ''}>Category</TableHead>
              <TableHead className={isDark ? 'text-slate-400' : ''}>Usage</TableHead>
              <TableHead className={`text-right ${isDark ? 'text-slate-400' : ''}`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.map((entry) => (
              <TableRow key={entry.id} className={isDark ? 'border-slate-700 hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguageInfo(entry.sourceLanguage).flag}</span>
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{entry.source}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getLanguageInfo(entry.targetLanguage).flag}</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{entry.target}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={isDark ? 'border-slate-700' : ''}>
                    {entry.category}
                  </Badge>
                </TableCell>
                <TableCell className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  {entry.usageCount}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(entry.target)}
                      className={isDark ? 'text-slate-400 hover:text-white' : ''}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditEntry(entry)}
                      className={isDark ? 'text-slate-400 hover:text-white' : ''}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEntries.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Languages className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No translation entries found</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>
              {editingEntry ? 'Edit Translation Entry' : 'Add Translation Entry'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={isDark ? 'text-slate-400' : ''}>Source Language</Label>
                <Select value={newEntry.sourceLanguage} onValueChange={(v) => setNewEntry({ ...newEntry, sourceLanguage: v })}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code} className={isDark ? 'text-white' : ''}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className={isDark ? 'text-slate-400' : ''}>Target Language</Label>
                <Select value={newEntry.targetLanguage} onValueChange={(v) => setNewEntry({ ...newEntry, targetLanguage: v })}>
                  <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code} className={isDark ? 'text-white' : ''}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Source Text</Label>
              <Textarea
                value={newEntry.source}
                onChange={(e) => setNewEntry({ ...newEntry, source: e.target.value })}
                placeholder="Enter source text..."
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Target Text</Label>
              <Textarea
                value={newEntry.target}
                onChange={(e) => setNewEntry({ ...newEntry, target: e.target.value })}
                placeholder="Enter translation..."
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
            <div>
              <Label className={isDark ? 'text-slate-400' : ''}>Category</Label>
              <Input
                value={newEntry.category}
                onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                placeholder="e.g., legal, greeting, button"
                className={`mt-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button
              onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
              className="bg-gradient-to-r from-violet-500 to-cyan-500"
            >
              {editingEntry ? 'Update' : 'Add'} Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}