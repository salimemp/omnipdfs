import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import {
  FileText,
  Zap,
  FolderOpen,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowRight,
  Layers,
  Shield,
  Sparkles,
  FileOutput,
  Merge,
  Scissors,
  Lock,
  Image
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import StatsCard from '@/components/shared/StatsCard';
import FileCard from '@/components/shared/FileCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    fetchUser();
  }, []);

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list('-created_date', 5),
  });

  const { data: recentJobs = [] } = useQuery({
    queryKey: ['recent-jobs'],
    queryFn: () => base44.entities.ConversionJob.list('-created_date', 10),
  });

  const { data: allDocuments = [] } = useQuery({
    queryKey: ['all-documents'],
    queryFn: () => base44.entities.Document.list(),
  });

  const quickActions = [
    { 
      name: 'PDF to Word', 
      icon: FileOutput, 
      color: 'from-blue-500 to-blue-600',
      formats: 'pdf → docx'
    },
    { 
      name: 'Merge PDFs', 
      icon: Merge, 
      color: 'from-violet-500 to-violet-600',
      formats: 'Combine files'
    },
    { 
      name: 'Split PDF', 
      icon: Scissors, 
      color: 'from-pink-500 to-pink-600',
      formats: 'Extract pages'
    },
    { 
      name: 'Compress PDF', 
      icon: Layers, 
      color: 'from-emerald-500 to-emerald-600',
      formats: 'Reduce size'
    },
    { 
      name: 'Protect PDF', 
      icon: Lock, 
      color: 'from-amber-500 to-amber-600',
      formats: 'Add password'
    },
    { 
      name: 'Image to PDF', 
      icon: Image, 
      color: 'from-cyan-500 to-cyan-600',
      formats: 'jpg, png → pdf'
    },
  ];

  const completedJobs = recentJobs.filter(j => j.status === 'completed').length;
  const totalStorageUsed = allDocuments.reduce((acc, doc) => acc + (doc.file_size || 0), 0);
  const formatStorageSize = (bytes) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-slate-900 to-cyan-500/10 border border-slate-800/50 p-8 md:p-12"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">Enterprise-grade PDF tools</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Convert, edit, and manage your documents with military-grade security and blazing-fast performance.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link to={createPageUrl('Convert')}>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-6 py-6 text-base rounded-xl">
                <Zap className="w-5 h-5 mr-2" />
                Start Converting
              </Button>
            </Link>
            <Link to={createPageUrl('PDFTools')}>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 px-6 py-6 text-base rounded-xl">
                <Layers className="w-5 h-5 mr-2" />
                PDF Tools
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-80 rounded-2xl glass p-6 glow"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 mb-4 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="h-3 bg-slate-700 rounded-full w-3/4 mb-3" />
            <div className="h-3 bg-slate-700 rounded-full w-1/2 mb-6" />
            <div className="space-y-2">
              <div className="h-2 bg-slate-700/50 rounded w-full" />
              <div className="h-2 bg-slate-700/50 rounded w-full" />
              <div className="h-2 bg-slate-700/50 rounded w-4/5" />
              <div className="h-2 bg-slate-700/50 rounded w-full" />
              <div className="h-2 bg-slate-700/50 rounded w-3/5" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Files"
          value={allDocuments.length}
          icon={FolderOpen}
          gradient="from-violet-500/20 to-violet-600/20"
          delay={0.1}
        />
        <StatsCard
          title="Conversions"
          value={completedJobs}
          subtitle="This month"
          icon={Zap}
          gradient="from-cyan-500/20 to-cyan-600/20"
          delay={0.2}
        />
        <StatsCard
          title="Storage Used"
          value={formatStorageSize(totalStorageUsed)}
          subtitle="of 50GB"
          icon={TrendingUp}
          gradient="from-emerald-500/20 to-emerald-600/20"
          delay={0.3}
        />
        <StatsCard
          title="Security"
          value="AES-256"
          subtitle="Encrypted"
          icon={Shield}
          gradient="from-amber-500/20 to-amber-600/20"
          delay={0.4}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
          <Link 
            to={createPageUrl('PDFTools')}
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            View all tools
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(action.name === 'Merge PDFs' ? 'PDFTools' : 'Convert')}>
                  <div className="glass-light rounded-2xl p-5 hover:border-violet-500/30 transition-all group cursor-pointer text-center">
                    <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-white text-sm mb-1">{action.name}</p>
                    <p className="text-xs text-slate-500">{action.formats}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Files */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Files</h2>
          <Link 
            to={createPageUrl('Files')}
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            View all files
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {documents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 6).map((file, index) => (
              <FileCard
                key={file.id}
                file={file}
                delay={index * 0.05}
                onDownload={(f) => window.open(f.file_url, '_blank')}
              />
            ))}
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
            <h3 className="text-white font-medium mb-2">No files yet</h3>
            <p className="text-slate-400 text-sm mb-6">Upload your first document to get started</p>
            <Link to={createPageUrl('Convert')}>
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white">
                <Zap className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Features Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <div className="glass-light rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium text-white">Zero-Knowledge Security</p>
            <p className="text-sm text-slate-400">End-to-end encrypted</p>
          </div>
        </div>
        
        <div className="glass-light rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="font-medium text-white">Blazing Fast</p>
            <p className="text-sm text-slate-400">&lt;100ms global latency</p>
          </div>
        </div>
        
        <div className="glass-light rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <p className="font-medium text-white">99.9% Uptime</p>
            <p className="text-sm text-slate-400">Enterprise SLA</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}