import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen,
  Plus,
  Search,
  Grid3X3,
  List,
  Star,
  Trash2,
  Filter,
  SortAsc,
  ChevronDown,
  FolderPlus,
  Upload
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FileCard from '@/components/shared/FileCard';
import DropZone from '@/components/shared/DropZone';

export default function Files() {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date'),
  });

  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: () => base44.entities.Folder.list('-created_date'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      toast.success('File deleted');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Document.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: (data) => base44.entities.Folder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
      setShowNewFolder(false);
      setNewFolderName('');
      toast.success('Folder created');
    },
  });

  const handleFileUploaded = async (fileData) => {
    await base44.entities.Document.create(fileData);
    queryClient.invalidateQueries(['documents']);
    setShowUpload(false);
    toast.success('File uploaded');
    
    await base44.entities.ActivityLog.create({
      action: 'upload',
      document_name: fileData.name,
      details: { file_type: fileData.file_type }
    });
  };

  const filteredDocuments = documents
    .filter(doc => {
      if (searchQuery) {
        return doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter(doc => {
      if (filter === 'favorites') return doc.is_favorite;
      if (filter === 'shared') return doc.is_shared;
      if (filter !== 'all') return doc.file_type === filter;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return (b.file_size || 0) - (a.file_size || 0);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Files</h1>
          <p className="text-slate-400 text-sm mt-1">{documents.length} files • Encrypted storage</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={() => setShowNewFolder(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <Button
            className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
            onClick={() => setShowUpload(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-light rounded-2xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36 bg-slate-900 border-slate-700 text-white">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="all" className="text-white">All Files</SelectItem>
                <SelectItem value="favorites" className="text-white">Favorites</SelectItem>
                <SelectItem value="shared" className="text-white">Shared</SelectItem>
                <SelectItem value="pdf" className="text-white">PDF</SelectItem>
                <SelectItem value="docx" className="text-white">Word</SelectItem>
                <SelectItem value="xlsx" className="text-white">Excel</SelectItem>
                <SelectItem value="jpg" className="text-white">Images</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 bg-slate-900 border-slate-700 text-white">
                <SortAsc className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="recent" className="text-white">Recent</SelectItem>
                <SelectItem value="name" className="text-white">Name</SelectItem>
                <SelectItem value="size" className="text-white">Size</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden md:flex border border-slate-700 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-light rounded-xl p-4 hover:border-violet-500/30 transition-all cursor-pointer group"
              >
                <FolderOpen className="w-10 h-10 text-amber-400 mb-2" />
                <p className="text-white text-sm font-medium truncate">{folder.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-light rounded-2xl p-4 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-700" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          <AnimatePresence>
            {filteredDocuments.map((file, index) => (
              <FileCard
                key={file.id}
                file={file}
                delay={index * 0.03}
                onDownload={(f) => window.open(f.file_url, '_blank')}
                onDelete={(f) => deleteMutation.mutate(f.id)}
                onToggleFavorite={(f) => updateMutation.mutate({ id: f.id, data: { is_favorite: !f.is_favorite } })}
                onShare={(f) => updateMutation.mutate({ id: f.id, data: { is_shared: true } })}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-light rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-white font-medium mb-2">
            {searchQuery ? 'No files found' : 'No files yet'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {searchQuery ? 'Try adjusting your search or filters' : 'Upload your first document to get started'}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setShowUpload(true)}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          )}
        </motion.div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Files</DialogTitle>
          </DialogHeader>
          <DropZone
            onFileUploaded={handleFileUploaded}
            maxSize={25 * 1024 * 1024}
          />
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolder} onOpenChange={setShowNewFolder}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="text-slate-400 text-sm">Folder Name</Label>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="mt-2 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewFolder(false)}
              className="border-slate-700 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={() => createFolderMutation.mutate({ name: newFolderName })}
              disabled={!newFolderName.trim()}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
            >
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}