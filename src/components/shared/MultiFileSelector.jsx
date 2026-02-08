import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare, Square, Download, Trash2, Archive,
  Share2, Folder, X, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FileCard from './FileCard';
import { toast } from 'sonner';

export default function MultiFileSelector({ 
  files, 
  onDelete, 
  onDownload,
  onShare,
  onToggleFavorite,
  isDark = false 
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const toggleSelection = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    setSelectedFiles(files.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFiles([]);
    setSelectionMode(false);
  };

  const bulkDownload = () => {
    selectedFiles.forEach(id => {
      const file = files.find(f => f.id === id);
      if (file) window.open(file.file_url, '_blank');
    });
    toast.success(`Downloading ${selectedFiles.length} files`);
  };

  const bulkDelete = async () => {
    if (confirm(`Delete ${selectedFiles.length} files?`)) {
      for (const id of selectedFiles) {
        const file = files.find(f => f.id === id);
        if (file && onDelete) await onDelete(file);
      }
      setSelectedFiles([]);
      toast.success('Files deleted');
    }
  };

  const bulkShare = () => {
    const urls = selectedFiles.map(id => {
      const file = files.find(f => f.id === id);
      return file?.file_url;
    }).filter(Boolean);
    
    const shareText = urls.join('\n');
    navigator.clipboard.writeText(shareText);
    toast.success('Links copied to clipboard');
  };

  return (
    <div className="space-y-4">
      {/* Selection Toolbar */}
      <AnimatePresence>
        {selectionMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-100 border border-slate-200'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-violet-400 border-violet-500/30">
                  {selectedFiles.length} selected
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={selectAll}
                  className={isDark ? 'text-slate-300' : 'text-slate-700'}
                >
                  Select All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={deselectAll}
                  className={isDark ? 'text-slate-300' : 'text-slate-700'}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={bulkDownload}
                  disabled={selectedFiles.length === 0}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  onClick={bulkShare}
                  disabled={selectedFiles.length === 0}
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button
                  size="sm"
                  onClick={bulkDelete}
                  disabled={selectedFiles.length === 0}
                  variant="outline"
                  className="text-red-400 hover:text-red-300 border-red-500/30"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Selection Mode */}
      {!selectionMode && (
        <Button
          onClick={() => setSelectionMode(true)}
          variant="outline"
          size="sm"
          className={isDark ? 'border-slate-700' : 'border-slate-200'}
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Select Multiple
        </Button>
      )}

      {/* Files Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div key={file.id} className="relative">
            {selectionMode && (
              <div
                className="absolute top-2 left-2 z-10 cursor-pointer"
                onClick={() => toggleSelection(file.id)}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                  selectedFiles.includes(file.id)
                    ? 'bg-violet-500 text-white'
                    : isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-300'
                }`}>
                  {selectedFiles.includes(file.id) ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </div>
              </div>
            )}
            <FileCard
              file={file}
              delay={index * 0.05}
              onDownload={onDownload}
              onDelete={onDelete}
              onShare={onShare}
              onToggleFavorite={onToggleFavorite}
              isDark={isDark}
            />
          </div>
        ))}
      </div>
    </div>
  );
}