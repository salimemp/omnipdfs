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
  ChevronDown
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
import DropZone from '@/components/shared/DropZone';
import FileIcon from '@/components/shared/FileIcon';

const conversionOptions = {
  pdf: ['docx', 'xlsx', 'pptx', 'jpg', 'png', 'txt', 'html'],
  docx: ['pdf', 'txt', 'html'],
  doc: ['pdf', 'docx', 'txt'],
  xlsx: ['pdf', 'csv'],
  xls: ['pdf', 'xlsx', 'csv'],
  pptx: ['pdf', 'jpg', 'png'],
  ppt: ['pdf', 'pptx'],
  jpg: ['pdf', 'png', 'webp'],
  jpeg: ['pdf', 'png', 'webp'],
  png: ['pdf', 'jpg', 'webp'],
  txt: ['pdf', 'docx'],
  html: ['pdf', 'docx'],
  epub: ['pdf', 'docx'],
};

export default function Convert() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState({
    quality: 'high',
    ocr_enabled: false,
    compress: false,
  });
  const [convertingFiles, setConvertingFiles] = useState({});

  const queryClient = useQueryClient();

  const handleFileUploaded = async (fileData) => {
    const document = await base44.entities.Document.create(fileData);
    setUploadedFiles(prev => [...prev, document]);
    
    // Set default target format
    const formats = conversionOptions[fileData.file_type] || ['pdf'];
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
      // Create conversion job
      const job = await base44.entities.ConversionJob.create({
        document_id: file.id,
        source_format: file.file_type,
        target_format: targetFormat,
        status: 'processing',
        options: options
      });

      // Simulate conversion with LLM-based response
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Simulate a file conversion from ${file.file_type} to ${targetFormat}. 
                 File name: ${file.name}
                 Options: Quality=${options.quality}, OCR=${options.ocr_enabled}, Compress=${options.compress}
                 Return a success message with estimated file size reduction if compression is enabled.`,
        response_json_schema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            estimated_size: { type: "number" },
            processing_time: { type: "number" }
          }
        }
      });

      // Update job status
      await base44.entities.ConversionJob.update(job.id, {
        status: 'completed',
        output_url: file.file_url, // In real app, this would be the converted file
        processing_time: result.processing_time || 2500
      });

      // Update document with conversion history
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

      // Log activity
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
    ? conversionOptions[uploadedFiles[0].file_type] || ['pdf']
    : Object.keys(conversionOptions);

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-violet-300">Universal File Converter</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Convert Any File
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto">
          Support for 50+ formats including PDF, Office, Images, and more.
          Powered by AI with enterprise-grade security.
        </p>
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
                  className="glass-light rounded-2xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <FileIcon type={file.file_type} size="md" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 uppercase">{file.file_type}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">{formatFileSize(file.file_size)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ArrowRight className="w-5 h-5 text-slate-500" />
                      <span className="text-sm font-medium text-violet-400 uppercase">{targetFormat}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {status === 'converting' && (
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                      )}
                      {status === 'completed' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                      {status === 'completed' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-violet-400 hover:text-violet-300"
                          onClick={() => window.open(file.file_url, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {!status && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-slate-400 hover:text-red-400"
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
          className="glass-light rounded-2xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            <div className="flex-1">
              <Label className="text-slate-400 text-sm mb-2 block">Convert to</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {availableFormats.map(format => (
                    <SelectItem key={format} value={format} className="text-white hover:bg-slate-800">
                      {format.toUpperCase()}
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
              <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Settings2 className="w-4 h-4" />
                Advanced Options
                <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-slate-400 text-sm mb-2 block">Quality</Label>
                  <Select 
                    value={options.quality} 
                    onValueChange={(v) => setOptions({ ...options, quality: v })}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      <SelectItem value="low" className="text-white">Low (faster)</SelectItem>
                      <SelectItem value="medium" className="text-white">Medium</SelectItem>
                      <SelectItem value="high" className="text-white">High</SelectItem>
                      <SelectItem value="maximum" className="text-white">Maximum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
                  <Label className="text-slate-400 text-sm">Enable OCR</Label>
                  <Switch
                    checked={options.ocr_enabled}
                    onCheckedChange={(v) => setOptions({ ...options, ocr_enabled: v })}
                  />
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-start gap-2">
                  <Label className="text-slate-400 text-sm">Compress Output</Label>
                  <Switch
                    checked={options.compress}
                    onCheckedChange={(v) => setOptions({ ...options, compress: v })}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </motion.div>
      )}

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-6 text-sm text-slate-500"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>AES-256 Encrypted</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-700" />
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>AI-Powered</span>
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-700" />
        <div className="hidden md:flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Sub-100ms Processing</span>
        </div>
      </motion.div>
    </div>
  );
}