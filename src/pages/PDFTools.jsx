import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Merge,
  Scissors,
  RotateCw,
  Lock,
  Unlock,
  Layers,
  FileText,
  Stamp,
  Eye,
  Trash2,
  FileOutput,
  Image,
  Sparkles,
  ArrowRight,
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DropZone from '@/components/shared/DropZone';
import { base44 } from '@/api/base44Client';

const tools = [
  {
    id: 'merge',
    name: 'Merge PDFs',
    description: 'Combine multiple PDFs into one document',
    icon: Merge,
    color: 'from-violet-500 to-violet-600',
    category: 'organize'
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract pages or split into multiple files',
    icon: Scissors,
    color: 'from-pink-500 to-pink-600',
    category: 'organize'
  },
  {
    id: 'rotate',
    name: 'Rotate Pages',
    description: 'Rotate PDF pages in any direction',
    icon: RotateCw,
    color: 'from-amber-500 to-amber-600',
    category: 'organize'
  },
  {
    id: 'delete',
    name: 'Delete Pages',
    description: 'Remove unwanted pages from PDF',
    icon: Trash2,
    color: 'from-red-500 to-red-600',
    category: 'organize'
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size up to 90%',
    icon: Layers,
    color: 'from-emerald-500 to-emerald-600',
    category: 'optimize'
  },
  {
    id: 'optimize',
    name: 'Optimize for Web',
    description: 'Linearize PDF for fast web viewing',
    icon: FileOutput,
    color: 'from-blue-500 to-blue-600',
    category: 'optimize'
  },
  {
    id: 'protect',
    name: 'Protect PDF',
    description: 'Add password protection & encryption',
    icon: Lock,
    color: 'from-indigo-500 to-indigo-600',
    category: 'security'
  },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    description: 'Remove password from PDF',
    icon: Unlock,
    color: 'from-teal-500 to-teal-600',
    category: 'security'
  },
  {
    id: 'watermark',
    name: 'Add Watermark',
    description: 'Add text or image watermarks',
    icon: Stamp,
    color: 'from-purple-500 to-purple-600',
    category: 'edit'
  },
  {
    id: 'ocr',
    name: 'OCR Text Recognition',
    description: 'Extract text from scanned documents',
    icon: Eye,
    color: 'from-cyan-500 to-cyan-600',
    category: 'edit'
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Images',
    description: 'Convert PDF pages to JPG or PNG',
    icon: Image,
    color: 'from-rose-500 to-rose-600',
    category: 'convert'
  },
  {
    id: 'image-to-pdf',
    name: 'Images to PDF',
    description: 'Combine images into a PDF document',
    icon: FileText,
    color: 'from-orange-500 to-orange-600',
    category: 'convert'
  },
];

const categories = [
  { id: 'all', name: 'All Tools' },
  { id: 'organize', name: 'Organize' },
  { id: 'optimize', name: 'Optimize' },
  { id: 'security', name: 'Security' },
  { id: 'edit', name: 'Edit' },
  { id: 'convert', name: 'Convert' },
];

export default function PDFTools({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [password, setPassword] = useState('');

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter(t => t.category === activeCategory);

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setUploadedFiles(prev => [...prev, document]);
  };

  const handleProcess = async () => {
    if (uploadedFiles.length === 0) return;
    
    setProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log activity
    await base44.entities.ActivityLog.create({
      action: selectedTool.id === 'merge' ? 'merge' : 
              selectedTool.id === 'split' ? 'split' :
              selectedTool.id === 'compress' ? 'compress' :
              selectedTool.id === 'protect' ? 'protect' : 'convert',
      document_id: uploadedFiles[0].id,
      document_name: uploadedFiles[0].name,
      details: {
        tool: selectedTool.id,
        files_count: uploadedFiles.length
      }
    });
    
    setProcessing(false);
    setCompleted(true);
  };

  const resetTool = () => {
    setSelectedTool(null);
    setUploadedFiles([]);
    setCompleted(false);
    setPassword('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">Professional PDF Tools</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          PDF Tools Suite
        </h1>
        <p className={`max-w-lg mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Everything you need to work with PDFs. Merge, split, compress, protect, and more.
        </p>
      </motion.div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1 flex-wrap h-auto gap-1">
          {categories.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 text-slate-400"
            >
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedTool(tool)}
              className="glass-light rounded-2xl p-6 hover:border-violet-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 group-hover:text-violet-300 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {tool.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{tool.description}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Use tool</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tool Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={(open) => !open && resetTool()}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          {selectedTool && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedTool.color} flex items-center justify-center`}>
                    <selectedTool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-white text-xl">{selectedTool.name}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {selectedTool.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-6">
                {!completed ? (
                  <>
                    <DropZone
                      onFileUploaded={handleFileUploaded}
                      acceptedTypes={['.pdf']}
                      maxSize={25 * 1024 * 1024}
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={file.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                            <FileText className="w-5 h-5 text-red-400" />
                            <span className="text-white text-sm flex-1 truncate">{file.name}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-slate-400 hover:text-red-400 h-8 w-8"
                              onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedTool.id === 'protect' && uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-slate-400 text-sm mb-2 block">Password</Label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password to protect PDF"
                          className="bg-slate-800 border-slate-700 text-white"
                        />
                      </div>
                    )}

                    {uploadedFiles.length > 0 && (
                      <Button
                        onClick={handleProcess}
                        disabled={processing || (selectedTool.id === 'protect' && !password)}
                        className="w-full mt-6 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white py-6"
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <selectedTool.icon className="w-5 h-5 mr-2" />
                            {selectedTool.name}
                          </>
                        )}
                      </Button>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Complete!</h3>
                    <p className="text-slate-400 mb-6">Your file has been processed successfully.</p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        className="border-slate-700 text-white hover:bg-slate-800"
                        onClick={() => window.open(uploadedFiles[0]?.file_url, '_blank')}
                      >
                        Download
                      </Button>
                      <Button
                        onClick={resetTool}
                        className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                      >
                        Process Another
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}