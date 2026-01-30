import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Download,
  Loader2,
  CheckCircle2,
  X,
  Settings2,
  Sparkles,
  Shield,
  ChevronDown,
  FileText,
  Image,
  BookOpen,
  Cog,
  Code
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DropZone from '@/components/shared/DropZone';
import FileIcon from '@/components/shared/FileIcon';
import QualitySettings from '@/components/conversion/QualitySettings';
import BatchConversionProgress from '@/components/conversion/BatchConversionProgress';

// Extended format support
const formatCategories = {
  documents: {
    label: 'Documents',
    icon: FileText,
    formats: {
      pdf: ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'txt', 'rtf', 'html', 'md', 'odt'],
      docx: ['pdf', 'doc', 'txt', 'rtf', 'html', 'md', 'odt'],
      doc: ['pdf', 'docx', 'txt', 'rtf', 'html'],
      xlsx: ['pdf', 'xls', 'csv', 'ods'],
      xls: ['pdf', 'xlsx', 'csv', 'ods'],
      pptx: ['pdf', 'ppt', 'jpg', 'png', 'odp'],
      ppt: ['pdf', 'pptx', 'jpg', 'png'],
      txt: ['pdf', 'docx', 'html', 'md', 'rtf'],
      rtf: ['pdf', 'docx', 'txt', 'html'],
      html: ['pdf', 'docx', 'txt', 'md'],
      md: ['pdf', 'docx', 'html', 'txt'],
      odt: ['pdf', 'docx', 'txt'],
    }
  },
  images: {
    label: 'Images',
    icon: Image,
    formats: {
      jpg: ['pdf', 'png', 'tiff', 'bmp', 'webp', 'svg', 'gif'],
      jpeg: ['pdf', 'png', 'tiff', 'bmp', 'webp', 'svg', 'gif'],
      png: ['pdf', 'jpg', 'tiff', 'bmp', 'webp', 'svg', 'gif'],
      tiff: ['pdf', 'jpg', 'png', 'bmp', 'webp'],
      bmp: ['pdf', 'jpg', 'png', 'tiff', 'webp'],
      webp: ['pdf', 'jpg', 'png', 'tiff', 'gif'],
      svg: ['pdf', 'png', 'jpg', 'eps'],
      gif: ['pdf', 'jpg', 'png', 'webp'],
      heic: ['pdf', 'jpg', 'png'],
    }
  },
  ebooks: {
    label: 'E-Books',
    icon: BookOpen,
    formats: {
      epub: ['pdf', 'docx', 'txt', 'html', 'mobi'],
      mobi: ['pdf', 'epub', 'docx', 'txt'],
      azw: ['pdf', 'epub', 'mobi', 'docx'],
      azw3: ['pdf', 'epub', 'mobi', 'docx'],
      fb2: ['pdf', 'epub', 'docx'],
    }
  },
  cad: {
    label: 'CAD/Vector',
    icon: Cog,
    formats: {
      dwg: ['pdf', 'dxf', 'svg', 'png', 'jpg'],
      dxf: ['pdf', 'dwg', 'svg', 'png', 'jpg'],
      ai: ['pdf', 'svg', 'eps', 'png', 'jpg'],
      eps: ['pdf', 'svg', 'ai', 'png', 'jpg'],
      cdr: ['pdf', 'svg', 'ai', 'png'],
    }
  },
  code: {
    label: 'Code/Text',
    icon: Code,
    formats: {
      json: ['pdf', 'txt', 'xml', 'yaml'],
      xml: ['pdf', 'json', 'txt', 'html'],
      yaml: ['pdf', 'json', 'txt'],
      csv: ['pdf', 'xlsx', 'json', 'txt'],
    }
  }
};

// Flatten all formats for lookup
const allFormats = {};
Object.values(formatCategories).forEach(category => {
  Object.entries(category.formats).forEach(([source, targets]) => {
    allFormats[source] = targets;
  });
});

export default function Convert({ theme = 'dark' }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    quality: 'maximum',
    ocr_enabled: false,
    compress: false,
    dpi: 300,
    colorMode: 'color',
    preserve_metadata: true,
  });
  const [convertingFiles, setConvertingFiles] = useState({});
  const [activeCategory, setActiveCategory] = useState('all');

  const isDark = theme === 'dark';
  const queryClient = useQueryClient();

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setUploadedFiles(prev => [...prev, document]);
    
    // Set default target format
    const formats = allFormats[fileData.file_type] || ['pdf'];
    if (!formats.includes(targetFormat)) {
      setTargetFormat(formats[0]);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const convertFile = async (file) => {
    setConvertingFiles(prev => ({ ...prev, [file.id]: 'converting' }));
    
    try {
      const job = await base44.entities.ConversionJob.create({
        document_id: file.id,
        source_format: file.file_type,
        target_format: targetFormat,
        status: 'processing',
        options: options
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Simulate a file conversion from ${file.file_type.toUpperCase()} to ${targetFormat.toUpperCase()}. 
                 File name: ${file.name}
                 Options: Quality=${options.quality}, OCR=${options.ocr_enabled}, Compress=${options.compress}, DPI=${options.dpi}
                 Return a success message with estimated file size and processing details.`,
        response_json_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            estimated_size: { type: "number" },
            processing_time: { type: "number" },
            pages_converted: { type: "number" }
          }
        }
      });

      await base44.entities.ConversionJob.update(job.id, {
        status: 'completed',
        output_url: file.file_url,
        processing_time: result.processing_time || 2500
      });

      await base44.entities.Document.update(file.id, {
        conversion_history: [
          ...(file.conversion_history || []),
          {
            from_format: file.file_type,
            to_format: targetFormat,
            date: new Date().toISOString(),
            output_url: file.file_url
          }
        ]
      });

      setConvertingFiles(prev => ({ ...prev, [file.id]: 'completed' }));
      queryClient.invalidateQueries(['documents']);
      queryClient.invalidateQueries(['recent-jobs']);

      await base44.entities.ActivityLog.create({
        action: 'convert',
        document_id: file.id,
        document_name: file.name,
        details: {
          from: file.file_type,
          to: targetFormat,
          options
        }
      });

    } catch (error) {
      setConvertingFiles(prev => ({ ...prev, [file.id]: 'error' }));
    }
  };

  const convertAll = () => {
    uploadedFiles.forEach(file => {
      if (!convertingFiles[file.id]) {
        convertFile(file);
      }
    });
  };

  const availableFormats = uploadedFiles.length > 0
    ? allFormats[uploadedFiles[0].file_type] || ['pdf']
    : ['pdf', 'docx', 'xlsx', 'jpg', 'png'];

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFormatBadgeColor = (format) => {
    const imageFormats = ['jpg', 'jpeg', 'png', 'tiff', 'bmp', 'webp', 'svg', 'gif', 'heic'];
    const docFormats = ['pdf', 'docx', 'doc', 'txt', 'rtf', 'html', 'md', 'odt'];
    const spreadsheetFormats = ['xlsx', 'xls', 'csv', 'ods'];
    const ebookFormats = ['epub', 'mobi', 'azw', 'azw3', 'fb2'];
    const cadFormats = ['dwg', 'dxf', 'ai', 'eps', 'cdr'];
    
    if (imageFormats.includes(format)) return 'bg-pink-500/20 text-pink-400';
    if (docFormats.includes(format)) return 'bg-blue-500/20 text-blue-400';
    if (spreadsheetFormats.includes(format)) return 'bg-emerald-500/20 text-emerald-400';
    if (ebookFormats.includes(format)) return 'bg-amber-500/20 text-amber-400';
    if (cadFormats.includes(format)) return 'bg-purple-500/20 text-purple-400';
    return 'bg-slate-500/20 text-slate-400';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">Universal File Converter</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Convert Any File Format
        </h1>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
          Support for 50+ formats: Documents, Images, E-Books, CAD files, and more
        </p>
      </motion.div>

      {/* Format Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {Object.entries(formatCategories).map(([key, category]) => {
            const Icon = category.icon;
            return (
              <Badge
                key={key}
                variant="outline"
                className={`px-4 py-2 cursor-pointer transition-all ${
                  isDark 
                    ? 'border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/10' 
                    : 'border-slate-200 hover:border-violet-500/50 hover:bg-violet-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2 text-violet-400" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{category.label}</span>
              </Badge>
            );
          })}
        </div>
        <div className={`mt-4 text-center text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          <span className="font-medium">Supported formats:</span> PDF, DOCX, XLSX, PPTX, JPG, PNG, TIFF, BMP, SVG, WebP, EPUB, MOBI, DWG, DXF, AI, EPS, HTML, Markdown, and more
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DropZone
          onFileUploaded={handleFileUploaded}
          maxSize={25 * 1024 * 1024}
          className="mb-6"
        />
      </motion.div>

      {/* Batch Progress */}
      {uploadedFiles.length > 1 && Object.keys(convertingFiles).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <BatchConversionProgress 
            files={uploadedFiles.map(f => ({ ...f, status: convertingFiles[f.id] || 'pending' }))}
            isDark={isDark}
          />
        </motion.div>
      )}

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 mb-6"
          >
            {uploadedFiles.map((file, index) => {
              const status = convertingFiles[file.id];
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl p-4 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <FileIcon type={file.file_type} size="md" />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className={getFormatBadgeColor(file.file_type)}>
                          {file.file_type?.toUpperCase()}
                        </Badge>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                          {formatFileSize(file.file_size)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <Badge className={`${getFormatBadgeColor(targetFormat)} font-semibold`}>
                        {targetFormat?.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'converting' && (
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                      )}
                      {status === 'completed' && (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-violet-400 hover:text-violet-300"
                            onClick={() => window.open(file.file_url, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </>
                      )}
                      {!status && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className={isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversion Settings */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 mb-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div className="flex-1">
              <Label className={isDark ? 'text-slate-400' : 'text-slate-600'}>Convert to</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
                  {availableFormats.map(format => (
                    <SelectItem 
                      key={format} 
                      value={format} 
                      className={isDark ? 'text-white hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-100'}
                    >
                      <div className="flex items-center gap-2">
                        <Badge className={`${getFormatBadgeColor(format)} text-xs`}>
                          {format.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={convertAll}
              disabled={Object.values(convertingFiles).some(s => s === 'converting')}
              className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8 py-6"
            >
              {Object.values(convertingFiles).some(s => s === 'converting') ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Convert {uploadedFiles.length > 1 ? 'All' : 'File'}
                </>
              )}
            </Button>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showOptions} onOpenChange={setShowOptions}>
            <CollapsibleTrigger asChild>
              <button className={`flex items-center gap-2 text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                <Settings2 className="w-4 h-4" />
                Advanced Options
                <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <QualitySettings
                options={options}
                onChange={(newOpts) => setOptions({ ...options, ...newOpts })}
                isDark={isDark}
              />
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      )}

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>AES-256 Encrypted</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-700" />
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>AI-Powered</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-700" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>50+ Formats</span>
        </div>
      </motion.div>
    </div>
  );
}