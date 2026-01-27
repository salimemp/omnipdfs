import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Folder, Plus, Edit, Trash2, Copy, Star, StarOff, Share2,
  Lock, Unlock, Download, Upload, Search, Filter, MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function TemplateManager({ onSelectTemplate, isDark = true }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const queryClient = useQueryClient();

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.Template.list(),
  });

  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: () => base44.entities.Folder.list(),
  });

  const createFolderMutation = useMutation({
    mutationFn: (data) => base44.entities.Folder.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
      setShowCreateFolder(false);
      setNewFolderName('');
      toast.success('Folder created');
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Template.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template updated');
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => base44.entities.Template.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template deleted');
    },
  });

  const duplicateTemplate = async (template) => {
    try {
      await base44.entities.Template.create({
        ...template,
        name: `${template.name} (Copy)`,
        id: undefined,
        created_date: undefined
      });
      queryClient.invalidateQueries(['templates']);
      toast.success('Template duplicated');
    } catch (e) {
      toast.error('Failed to duplicate');
    }
  };

  const toggleFavorite = (template) => {
    updateTemplateMutation.mutate({
      id: template.id,
      data: { is_favorite: !template.is_favorite }
    });
  };

  const togglePublic = (template) => {
    updateTemplateMutation.mutate({
      id: template.id,
      data: { is_public: !template.is_public }
    });
  };

  const exportTemplate = (template) => {
    const json = JSON.stringify(template, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || t.folder_id === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const favoriteTemplates = filteredTemplates.filter(t => t.is_favorite);
  const regularTemplates = filteredTemplates.filter(t => !t.is_favorite);

  return (
    <div className="grid lg:grid-cols-4 gap-4 h-[600px]">
      {/* Sidebar - Folders */}
      <div className={`rounded-2xl p-4 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Folders</h4>
          <Button size="icon" variant="ghost" onClick={() => setShowCreateFolder(true)} className={isDark ? 'text-slate-400' : ''}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              !selectedFolder
                ? 'bg-violet-500/20 text-violet-400'
                : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span className="text-sm">All Templates</span>
            <span className="ml-auto text-xs">{templates.length}</span>
          </button>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-violet-500/20 text-violet-400'
                  : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Folder className="w-4 h-4" style={{ color: folder.color }} />
              <span className="text-sm truncate">{folder.name}</span>
              <span className="ml-auto text-xs">
                {templates.filter(t => t.folder_id === folder.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area - Templates */}
      <div className={`lg:col-span-3 rounded-2xl p-4 ${isDark ? 'bg-slate-900/50 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        {/* Search */}
        <div className="relative mb-4">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className={`pl-10 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
          />
        </div>

        {/* Templates List */}
        <div className="space-y-4 overflow-y-auto h-[500px]">
          {/* Favorites */}
          {favoriteTemplates.length > 0 && (
            <div>
              <h5 className={`text-sm font-medium mb-2 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Star className="w-4 h-4 text-amber-400" />
                Favorites
              </h5>
              <div className="space-y-2">
                {favoriteTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={onSelectTemplate}
                    onDuplicate={duplicateTemplate}
                    onDelete={() => deleteTemplateMutation.mutate(template.id)}
                    onToggleFavorite={() => toggleFavorite(template)}
                    onTogglePublic={() => togglePublic(template)}
                    onExport={() => exportTemplate(template)}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Templates */}
          {regularTemplates.length > 0 && (
            <div>
              <h5 className={`text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Templates
              </h5>
              <div className="space-y-2">
                {regularTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={onSelectTemplate}
                    onDuplicate={duplicateTemplate}
                    onDelete={() => deleteTemplateMutation.mutate(template.id)}
                    onToggleFavorite={() => toggleFavorite(template)}
                    onTogglePublic={() => togglePublic(template)}
                    onExport={() => exportTemplate(template)}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Folder className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
              <p className={isDark ? 'text-slate-500' : 'text-slate-400'}>No templates found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Create Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolder(false)} className={isDark ? 'border-slate-700' : ''}>
              Cancel
            </Button>
            <Button
              onClick={() => createFolderMutation.mutate({ name: newFolderName })}
              disabled={!newFolderName.trim()}
              className="bg-violet-500 hover:bg-violet-600"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateCard({ template, onSelect, onDuplicate, onDelete, onToggleFavorite, onTogglePublic, onExport, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{template.name}</p>
          {template.is_public && <Badge variant="outline" className="text-xs">Public</Badge>}
        </div>
        <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {template.description || 'No description'}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onToggleFavorite(template)}
          className={`h-8 w-8 ${template.is_favorite ? 'text-amber-400' : isDark ? 'text-slate-600' : 'text-slate-400'}`}
        >
          {template.is_favorite ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className={`h-8 w-8 ${isDark ? 'text-slate-400' : ''}`}>
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
            <DropdownMenuItem onClick={() => onSelect?.(template)} className={isDark ? 'text-white' : ''}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(template)} className={isDark ? 'text-white' : ''}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePublic(template)} className={isDark ? 'text-white' : ''}>
              {template.is_public ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
              Make {template.is_public ? 'Private' : 'Public'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport(template)} className={isDark ? 'text-white' : ''}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator className={isDark ? 'bg-slate-700' : ''} />
            <DropdownMenuItem onClick={() => onDelete(template)} className="text-red-400">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}