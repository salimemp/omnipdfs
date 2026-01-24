import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Download, Trash2, Share2, Star, StarOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FileIcon from './FileIcon';
import { format } from 'date-fns';

export default function FileCard({ 
  file, 
  onDownload, 
  onDelete, 
  onShare, 
  onToggleFavorite,
  delay = 0 
}) {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="glass-light rounded-2xl p-4 hover:border-violet-500/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <FileIcon type={file.file_type} size="lg" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-medium text-white truncate group-hover:text-violet-300 transition-colors">
                {file.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-500 uppercase">{file.file_type}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-500">{formatFileSize(file.file_size)}</span>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
                <DropdownMenuItem onClick={() => onDownload?.(file)} className="text-slate-300 focus:text-white focus:bg-slate-800">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(file)} className="text-slate-300 focus:text-white focus:bg-slate-800">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavorite?.(file)} className="text-slate-300 focus:text-white focus:bg-slate-800">
                  {file.is_favorite ? (
                    <>
                      <StarOff className="w-4 h-4 mr-2" />
                      Remove from favorites
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Add to favorites
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={() => onDelete?.(file)} className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-3 mt-3">
            {file.is_favorite && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            )}
            {file.is_shared && (
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="text-xs text-slate-500">
              {file.created_date && format(new Date(file.created_date), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}