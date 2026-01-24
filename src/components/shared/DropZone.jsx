import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileUp, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function DropZone({ onFileUploaded, acceptedTypes, maxSize = 25 * 1024 * 1024, className = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setError(null);
    
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds ${maxSize / 1024 / 1024}MB limit`);
        continue;
      }

      setUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        const fileType = file.name.split('.').pop().toLowerCase();
        
        onFileUploaded?.({
          name: file.name,
          file_url,
          file_type: fileType,
          file_size: file.size
        });

        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } catch (err) {
        clearInterval(progressInterval);
        setError(`Failed to upload "${file.name}"`);
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className={className}>
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed
          transition-all duration-300 cursor-pointer
          ${isDragging
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-slate-700 hover:border-violet-500/50 bg-slate-900/50 hover:bg-slate-900/80'
          }
        `}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept={acceptedTypes?.join(',')}
          multiple
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={175.93}
                    strokeDashoffset={175.93 - (175.93 * uploadProgress) / 100}
                    className="text-violet-500 transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  {uploadProgress === 100 ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <span className="text-sm font-semibold text-white">{uploadProgress}%</span>
                  )}
                </div>
              </div>
              <p className="text-white font-medium">
                {uploadProgress === 100 ? 'Upload complete!' : 'Uploading...'}
              </p>
            </motion.div>
          ) : isDragging ? (
            <motion.div
              key="dragging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                <FileUp className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-white font-medium">Drop your files here</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
                <Upload className="w-8 h-8 text-violet-400" />
              </div>
              <p className="text-white font-medium mb-1">
                Drag & drop files here
              </p>
              <p className="text-sm text-slate-400">
                or click to browse
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Max file size: {maxSize / 1024 / 1024}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}