import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, FileText, Folder, Download, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CloudFilePicker({ open, onClose, onFileSelected, isDark = true }) {
  const [provider, setProvider] = useState('googledrive');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const providers = [
    { id: 'googledrive', name: 'Google Drive', icon: Cloud },
    { id: 'dropbox', name: 'Dropbox', icon: Cloud },
    { id: 'onedrive', name: 'OneDrive', icon: Cloud },
    { id: 'box', name: 'Box', icon: Cloud }
  ];

  useEffect(() => {
    if (open && provider) {
      loadFiles();
    }
  }, [open, provider]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke('cloudFilePicker', {
        provider,
        action: 'list_files'
      });

      if (response.data.success) {
        setFiles(response.data.files || []);
      }
    } catch (error) {
      toast.error('Failed to load files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    try {
      toast.loading('Importing file...');
      
      const response = await base44.functions.invoke('cloudFilePicker', {
        provider,
        action: 'download_file',
        data: { fileId: file.id }
      });

      if (response.data.success) {
        const document = await base44.entities.Document.create({
          name: file.name,
          file_url: response.data.file_url,
          file_type: file.name.split('.').pop().toLowerCase(),
          file_size: file.size
        });

        onFileSelected?.(document);
        toast.success('File imported successfully');
        onClose();
      }
    } catch (error) {
      toast.error('Failed to import file');
      console.error(error);
    }
  };

  const filteredFiles = files.filter(f => 
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl ${isDark ? 'bg-slate-900 text-white' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-violet-400" />
            Import from Cloud Storage
          </DialogTitle>
        </DialogHeader>

        <Tabs value={provider} onValueChange={setProvider}>
          <TabsList className={`grid grid-cols-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            {providers.map(p => (
              <TabsTrigger key={p.id} value={p.id}>
                <p.icon className="w-4 h-4 mr-2" />
                {p.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Cloud className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No files found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredFiles.map(file => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <FileText className="w-5 h-5 text-violet-400" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-slate-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}